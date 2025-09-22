/**
 * WebSocket Connection Manager for Pixel-Harvest Multiplayer
 * Handles connection establishment, health monitoring, and reconnection
 */

class WebSocketManager {
    constructor(config = {}) {
        this.config = {
            heartbeatInterval: config.heartbeatInterval || 30000,
            connectionTimeout: config.connectionTimeout || 30000,
            reconnectAttempts: config.reconnectAttempts || 3,
            reconnectBackoffMultiplier: config.reconnectBackoffMultiplier || 2,
            maxReconnectDelay: config.maxReconnectDelay || 30000,
            messageQueueSize: config.messageQueueSize || 1000,
            ...config
        };
        
        this.ws = null;
        this.state = 'DISCONNECTED'; // DISCONNECTED | CONNECTING | CONNECTED | RECONNECTING
        this.reconnectCount = 0;
        this.reconnectTimer = null;
        this.heartbeatTimer = null;
        this.lastPong = Date.now();
        this.messageQueue = [];
        this.pendingMessages = new Map();
        this.messageId = 0;
        this.lastUrl = null;
        
        // Event callbacks
        this.onOpen = null;
        this.onClose = null;
        this.onError = null;
        this.onMessage = null;
        this.onStateChange = null;
        
        // Connection quality metrics
        this.connectionMetrics = {
            latency: 0,
            packetLoss: 0,
            lastUpdate: Date.now()
        };
    }
    
    /**
     * Connect to WebSocket server
     */
    async connect(url) {
        if (this.state === 'CONNECTING' || this.state === 'CONNECTED') {
            console.warn('Already connected or connecting');
            return Promise.resolve();
        }
        
        this.lastUrl = url;
        this.setState('CONNECTING');
        
        return new Promise((resolve, reject) => {
            try {
                // Determine protocol based on current page
                const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                const fullUrl = url.startsWith('ws') ? url : `${protocol}//${url}`;
                
                console.log(`🔌 Connecting to ${fullUrl}`);
                this.ws = new WebSocket(fullUrl);
                
                const connectionTimeout = setTimeout(() => {
                    if (this.state === 'CONNECTING') {
                        this.ws.close();
                        reject(new Error('Connection timeout'));
                    }
                }, this.config.connectionTimeout);
                
                this.ws.onopen = (event) => {
                    clearTimeout(connectionTimeout);
                    this.setState('CONNECTED');
                    this.reconnectCount = 0;
                    this.startHeartbeat();
                    this.processPendingMessages();
                    
                    console.log('✅ WebSocket connected');
                    if (this.onOpen) this.onOpen(event);
                    resolve();
                };
                
                this.ws.onclose = (event) => {
                    clearTimeout(connectionTimeout);
                    this.stopHeartbeat();
                    
                    console.log('🔌 WebSocket closed:', event.code, event.reason);
                    if (this.onClose) this.onClose(event);
                    
                    if (this.state === 'CONNECTED' && !event.wasClean) {
                        this.attemptReconnect();
                    } else {
                        this.setState('DISCONNECTED');
                    }
                };
                
                this.ws.onerror = (error) => {
                    clearTimeout(connectionTimeout);
                    console.error('❌ WebSocket error:', error);
                    if (this.onError) this.onError(error);
                    
                    if (this.state === 'CONNECTING') {
                        reject(error);
                    }
                };
                
                this.ws.onmessage = (event) => {
                    this.handleMessage(event);
                };
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Disconnect from WebSocket server
     */
    disconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close(1000, 'Manual disconnect');
            this.ws = null;
        }
        
        this.setState('DISCONNECTED');
        console.log('🔌 WebSocket disconnected');
    }
    
    /**
     * Send message through WebSocket
     */
    send(type, data, requiresAck = false) {
        const message = {
            id: requiresAck ? ++this.messageId : null,
            type,
            data,
            timestamp: Date.now()
        };
        
        if (this.state === 'CONNECTED' && this.ws.readyState === WebSocket.OPEN) {
            try {
                this.ws.send(JSON.stringify(message));
                
                if (requiresAck) {
                    this.pendingMessages.set(message.id, {
                        message,
                        timestamp: Date.now(),
                        resolve: null,
                        reject: null
                    });
                }
                
                return message.id;
            } catch (error) {
                console.error('Failed to send message:', error);
                if (requiresAck) {
                    this.queueMessage(message);
                }
            }
        } else {
            if (requiresAck) {
                this.queueMessage(message);
            }
            console.warn('WebSocket not connected, message queued');
        }
        
        return null;
    }
    
    /**
     * Send message with acknowledgment
     */
    sendWithAck(type, data, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const messageId = this.send(type, data, true);
            
            if (!messageId) {
                reject(new Error('Failed to send message'));
                return;
            }
            
            const pending = this.pendingMessages.get(messageId);
            if (pending) {
                pending.resolve = resolve;
                pending.reject = reject;
                
                setTimeout(() => {
                    if (this.pendingMessages.has(messageId)) {
                        this.pendingMessages.delete(messageId);
                        reject(new Error('Message acknowledgment timeout'));
                    }
                }, timeout);
            }
        });
    }
    
    /**
     * Handle incoming messages
     */
    handleMessage(event) {
        try {
            const message = JSON.parse(event.data);
            
            // Handle system messages
            if (message.type === 'PONG') {
                this.lastPong = Date.now();
                this.updateConnectionMetrics(message);
                return;
            }
            
            if (message.type === 'ACK' && message.ackId) {
                const pending = this.pendingMessages.get(message.ackId);
                if (pending) {
                    this.pendingMessages.delete(message.ackId);
                    if (pending.resolve) {
                        pending.resolve(message.data);
                    }
                }
                return;
            }
            
            // Send ACK if message requires it
            if (message.id) {
                this.send('ACK', { success: true }, false);
            }
            
            // Forward to message handler
            if (this.onMessage) {
                this.onMessage(message);
            }
            
        } catch (error) {
            console.error('Failed to parse message:', error);
        }
    }
    
    /**
     * Queue message for later sending
     */
    queueMessage(message) {
        if (this.messageQueue.length >= this.config.messageQueueSize) {
            this.messageQueue.shift(); // Remove oldest message
        }
        this.messageQueue.push(message);
    }
    
    /**
     * Process pending messages after reconnection
     */
    processPendingMessages() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            this.ws.send(JSON.stringify(message));
        }
    }
    
    /**
     * Attempt automatic reconnection
     */
    attemptReconnect() {
        if (this.reconnectCount >= this.config.reconnectAttempts) {
            console.warn('Max reconnection attempts reached');
            this.setState('DISCONNECTED');
            return;
        }
        
        this.setState('RECONNECTING');
        this.reconnectCount++;
        
        const delay = Math.min(
            1000 * Math.pow(this.config.reconnectBackoffMultiplier, this.reconnectCount - 1),
            this.config.maxReconnectDelay
        );
        
        console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectCount})`);
        
        this.reconnectTimer = setTimeout(() => {
            this.connect(this.lastUrl).catch(error => {
                console.error('Reconnection failed:', error);
                this.attemptReconnect();
            });
        }, delay);
    }
    
    /**
     * Start heartbeat monitoring
     */
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            if (this.state === 'CONNECTED' && this.ws.readyState === WebSocket.OPEN) {
                const pingTime = Date.now();
                this.send('PING', { timestamp: pingTime });
                
                // Check if last pong is too old
                if (Date.now() - this.lastPong > this.config.heartbeatInterval * 2) {
                    console.warn('Heartbeat timeout, connection may be dead');
                    this.ws.close();
                }
            }
        }, this.config.heartbeatInterval);
    }
    
    /**
     * Stop heartbeat monitoring
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
    
    /**
     * Update connection quality metrics
     */
    updateConnectionMetrics(pongMessage) {
        if (pongMessage.data && pongMessage.data.timestamp) {
            const latency = Date.now() - pongMessage.data.timestamp;
            this.connectionMetrics.latency = latency;
            this.connectionMetrics.lastUpdate = Date.now();
        }
    }
    
    /**
     * Set connection state and notify listeners
     */
    setState(newState) {
        if (this.state !== newState) {
            const oldState = this.state;
            this.state = newState;
            
            console.log(`🔄 Connection state: ${oldState} → ${newState}`);
            
            if (this.onStateChange) {
                this.onStateChange(newState, oldState);
            }
        }
    }
    
    /**
     * Get current connection status
     */
    getStatus() {
        return {
            state: this.state,
            connected: this.state === 'CONNECTED',
            reconnectCount: this.reconnectCount,
            messageQueueLength: this.messageQueue.length,
            pendingMessages: this.pendingMessages.size,
            metrics: { ...this.connectionMetrics }
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.disconnect();
        this.messageQueue = [];
        this.pendingMessages.clear();
        
        // Clear all callbacks
        this.onOpen = null;
        this.onClose = null;
        this.onError = null;
        this.onMessage = null;
        this.onStateChange = null;
    }
}

// Export for use in multiplayer module
window.WebSocketManager = WebSocketManager;