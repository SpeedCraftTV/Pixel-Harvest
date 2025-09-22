/**
 * Multiplayer UI Manager for Pixel-Harvest
 * Handles multiplayer-specific user interface elements
 */

class MultiplayerUI {
    constructor() {
        this.multiplayerModule = null;
        this.panels = new Map();
        this.currentPanel = null;
        this.connectionIndicator = null;
        this.playerList = null;
        this.chatWindow = null;
        
        // UI state
        this.isVisible = false;
        this.panelHistory = [];
        
        console.log('🎨 Multiplayer UI initialized');
    }
    
    /**
     * Initialize the UI with multiplayer module reference
     */
    initialize(multiplayerModule) {
        this.multiplayerModule = multiplayerModule;
        
        // Setup UI callbacks
        this.multiplayerModule.uiCallbacks = {
            onConnectionStatusChange: (status, moduleStatus) => this.updateConnectionStatus(status, moduleStatus),
            onRoomStatusChange: (action, room) => this.updateRoomStatus(action, room),
            onPlayerListUpdate: (players) => this.updatePlayerList(players),
            onChatMessage: (chatData) => this.displayChatMessage(chatData),
            onNotification: (message, type) => this.showNotification(message, type)
        };
        
        // Create UI elements
        this.createMultiplayerPanels();
        this.createConnectionIndicator();
        this.createMultiplayerButton();
        
        console.log('🎨 Multiplayer UI setup complete');
    }
    
    /**
     * Create main multiplayer UI panels
     */
    createMultiplayerPanels() {
        // Main multiplayer panel
        const multiplayerPanel = this.createPanel('multiplayer', 'Multiplayer', `
            <div class="multiplayer-main">
                <div class="connection-section">
                    <div class="connection-status">
                        <span class="status-indicator offline"></span>
                        <span class="status-text">Offline</span>
                    </div>
                    
                    <div class="server-config">
                        <label for="serverUrl" class="mp-label">Server URL:</label>
                        <div class="server-input-group">
                            <input type="text" id="serverUrl" class="mp-input" placeholder="localhost:8080" 
                                   value="localhost:8080" title="Enter the multiplayer server address">
                            <button id="connectButton" class="mp-button primary">Connect</button>
                        </div>
                        <div class="server-help">
                            <small class="help-text">Enter the address of a multiplayer server. 
                            If you don't have a server, you can <a href="#" id="demoModeLink">try demo mode</a> or 
                            <a href="https://github.com/SpeedCraftTV/Pixel-Harvest#multiplayer-setup" target="_blank">set up your own server</a>.</small>
                        </div>
                        <div class="quick-start-section" style="margin-top: 15px; padding: 12px; background: rgba(156, 39, 176, 0.1); border-left: 3px solid #9C27B0; border-radius: 4px;">
                            <div style="font-weight: bold; color: #9C27B0; margin-bottom: 8px;">👋 New to multiplayer?</div>
                            <div style="font-size: 13px; color: #ddd; margin-bottom: 10px;">
                                Try demo mode to explore multiplayer features without setting up a server!
                            </div>
                            <button id="quickDemoButton" class="mp-button" style="background: #9C27B0; font-size: 12px; padding: 6px 12px;">
                                🎮 Start Demo Mode
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="room-section" style="display: none;">
                    <h3>Room</h3>
                    <div class="room-info">
                        <div class="room-name">Not in room</div>
                        <div class="room-players">Players: 0/8</div>
                    </div>
                    <div class="room-controls">
                        <button id="createRoomButton" class="mp-button">Create Room</button>
                        <button id="joinRoomButton" class="mp-button">Join Room</button>
                        <button id="quickJoinButton" class="mp-button">Quick Join</button>
                        <button id="leaveRoomButton" class="mp-button danger" style="display: none;">Leave Room</button>
                    </div>
                </div>
                
                <div class="players-section" style="display: none;">
                    <h3>Players <span id="playerCount">(0)</span></h3>
                    <div id="playersList" class="players-list"></div>
                </div>
            </div>
        `);
        
        // Room browser panel
        const roomBrowserPanel = this.createPanel('roomBrowser', 'Room Browser', `
            <div class="room-browser">
                <div class="browser-controls">
                    <input type="text" id="roomSearchInput" placeholder="Search rooms..." class="mp-input">
                    <button id="refreshRoomsButton" class="mp-button">Refresh</button>
                </div>
                <div id="roomsList" class="rooms-list">
                    <div class="loading">Loading rooms...</div>
                </div>
                <div class="browser-actions">
                    <button id="cancelBrowseButton" class="mp-button">Cancel</button>
                </div>
            </div>
        `);
        
        // Room creation panel
        const createRoomPanel = this.createPanel('createRoom', 'Create Room', `
            <div class="create-room">
                <form id="createRoomForm">
                    <div class="form-group">
                        <label for="roomName">Room Name</label>
                        <input type="text" id="roomName" class="mp-input" placeholder="My Awesome Farm" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="gameMode">Game Mode</label>
                        <select id="gameMode" class="mp-select">
                            <option value="cooperative">Cooperative</option>
                            <option value="competitive">Competitive</option>
                            <option value="free_play">Free Play</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="maxPlayers">Max Players</label>
                        <select id="maxPlayers" class="mp-select">
                            <option value="2">2 Players</option>
                            <option value="4" selected>4 Players</option>
                            <option value="6">6 Players</option>
                            <option value="8">8 Players</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="isPublic" checked>
                            <span class="checkmark"></span>
                            Public Room
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="allowChat" checked>
                            <span class="checkmark"></span>
                            Enable Chat
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="mp-button primary">Create Room</button>
                        <button type="button" id="cancelCreateButton" class="mp-button">Cancel</button>
                    </div>
                </form>
            </div>
        `);
        
        // Chat panel
        const chatPanel = this.createPanel('chat', 'Chat', `
            <div class="chat-window">
                <div id="chatMessages" class="chat-messages"></div>
                <div class="chat-input-area">
                    <input type="text" id="chatInput" class="mp-input" placeholder="Type a message..." maxlength="200">
                    <button id="sendChatButton" class="mp-button primary">Send</button>
                </div>
            </div>
        `);
        
        // Player profile panel  
        const profilePanel = this.createPanel('profile', 'Player Profile', `
            <div class="player-profile">
                <div class="profile-info">
                    <div class="avatar-section">
                        <div class="avatar-display" id="avatarDisplay">👤</div>
                        <button id="changeAvatarButton" class="mp-button small">Change</button>
                    </div>
                    <div class="name-section">
                        <input type="text" id="playerNameInput" class="mp-input" placeholder="Your Name" maxlength="20">
                        <button id="saveNameButton" class="mp-button primary">Save</button>
                    </div>
                </div>
            </div>
        `);
        
        this.setupPanelEventHandlers();
    }
    
    /**
     * Create a UI panel
     */
    createPanel(id, title, content) {
        const panel = document.createElement('div');
        panel.id = `mp-${id}Panel`;
        panel.className = 'multiplayer-panel';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <div class="panel-header">
                <h2>${title}</h2>
                <button class="panel-close">&times;</button>
            </div>
            <div class="panel-content">
                ${content}
            </div>
        `;
        
        // Add to page
        document.body.appendChild(panel);
        
        // Store reference
        this.panels.set(id, panel);
        
        // Setup close handler
        panel.querySelector('.panel-close').addEventListener('click', () => {
            this.hidePanel(id);
        });
        
        return panel;
    }
    
    /**
     * Create connection status indicator
     */
    createConnectionIndicator() {
        this.connectionIndicator = document.createElement('div');
        this.connectionIndicator.id = 'multiplayerConnectionIndicator';
        this.connectionIndicator.className = 'mp-connection-indicator';
        this.connectionIndicator.innerHTML = `
            <span class="connection-dot offline"></span>
            <span class="connection-text">Offline</span>
        `;
        
        // Position it in the UI
        this.connectionIndicator.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 200;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            display: none;
            align-items: center;
            gap: 6px;
        `;
        
        document.body.appendChild(this.connectionIndicator);
    }
    
    /**
     * Create multiplayer main button
     */
    createMultiplayerButton() {
        const button = document.createElement('button');
        button.id = 'multiplayerButton';
        button.className = 'mp-main-button';
        button.innerHTML = '👥 Multiplayer';
        
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 150px;
            z-index: 100;
            background: #9C27B0;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        `;
        
        button.addEventListener('click', () => {
            this.toggleMainPanel();
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#7B1FA2';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#9C27B0';
        });
        
        document.body.appendChild(button);
    }
    
    /**
     * Setup event handlers for panel interactions
     */
    setupPanelEventHandlers() {
        // Connect button
        document.getElementById('connectButton').addEventListener('click', async () => {
            const serverUrlInput = document.getElementById('serverUrl');
            const serverUrl = serverUrlInput ? serverUrlInput.value.trim() : '';
            
            if (!serverUrl) {
                this.showNotification('Please enter a server URL', 'error');
                return;
            }
            
            try {
                await this.multiplayerModule.connect(serverUrl);
                this.showNotification('Connected successfully!', 'success');
            } catch (error) {
                const errorMsg = this.getDetailedErrorMessage(error, serverUrl);
                this.showNotification(errorMsg, 'error');
                
                // If connecting to localhost failed, offer demo mode as alternative
                if (serverUrl && (serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1'))) {
                    setTimeout(() => {
                        this.showLocalhostFailureDialog();
                    }, 1500);
                }
            }
        });
        
        // Demo mode link
        document.getElementById('demoModeLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showDemoModeDialog();
        });
        
        // Quick demo button for better UX
        document.getElementById('quickDemoButton').addEventListener('click', () => {
            this.showDemoModeDialog();
        });
        
        // Server URL input - connect on Enter key
        document.getElementById('serverUrl').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('connectButton').click();
            }
        });
        
        // Room control buttons
        document.getElementById('createRoomButton').addEventListener('click', () => {
            this.showPanel('createRoom');
        });
        
        document.getElementById('joinRoomButton').addEventListener('click', () => {
            this.showPanel('roomBrowser');
            this.refreshRoomList();
        });
        
        document.getElementById('quickJoinButton').addEventListener('click', async () => {
            try {
                await this.multiplayerModule.quickJoin();
                this.showNotification('Joined room successfully!', 'success');
            } catch (error) {
                this.showNotification('Failed to join room: ' + this.getErrorMessage(error), 'error');
            }
        });
        
        document.getElementById('leaveRoomButton').addEventListener('click', async () => {
            try {
                await this.multiplayerModule.leaveRoom();
                this.showNotification('Left room', 'info');
            } catch (error) {
                this.showNotification('Failed to leave room: ' + this.getErrorMessage(error), 'error');
            }
        });
        
        // Create room form
        document.getElementById('createRoomForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleCreateRoom();
        });
        
        document.getElementById('cancelCreateButton').addEventListener('click', () => {
            this.hidePanel('createRoom');
        });
        
        // Room browser
        document.getElementById('refreshRoomsButton').addEventListener('click', () => {
            this.refreshRoomList();
        });
        
        document.getElementById('cancelBrowseButton').addEventListener('click', () => {
            this.hidePanel('roomBrowser');
        });
        
        // Chat
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
        
        document.getElementById('sendChatButton').addEventListener('click', () => {
            this.sendChatMessage();
        });
        
        // Profile
        document.getElementById('saveNameButton').addEventListener('click', () => {
            this.savePlayerName();
        });
    }
    
    /**
     * Show a panel
     */
    showPanel(panelId) {
        const panel = this.panels.get(panelId);
        if (!panel) return;
        
        // Hide current panel
        if (this.currentPanel) {
            this.currentPanel.style.display = 'none';
            this.panelHistory.push(this.currentPanel.id.replace('mp-', '').replace('Panel', ''));
        }
        
        // Show new panel
        panel.style.display = 'block';
        this.currentPanel = panel;
        this.isVisible = true;
        
        // Center the panel
        this.centerPanel(panel);
    }
    
    /**
     * Hide a panel
     */
    hidePanel(panelId) {
        const panel = this.panels.get(panelId);
        if (!panel) return;
        
        panel.style.display = 'none';
        
        if (this.currentPanel === panel) {
            this.currentPanel = null;
            
            // Show previous panel if exists
            if (this.panelHistory.length > 0) {
                const previousPanelId = this.panelHistory.pop();
                this.showPanel(previousPanelId);
            } else {
                this.isVisible = false;
            }
        }
    }
    
    /**
     * Toggle main multiplayer panel
     */
    toggleMainPanel() {
        if (this.isVisible) {
            this.hideAllPanels();
        } else {
            this.showPanel('multiplayer');
        }
    }
    
    /**
     * Hide all panels
     */
    hideAllPanels() {
        this.panels.forEach(panel => {
            panel.style.display = 'none';
        });
        this.currentPanel = null;
        this.isVisible = false;
        this.panelHistory = [];
    }
    
    /**
     * Center a panel on screen
     */
    centerPanel(panel) {
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.zIndex = '1000';
        panel.style.background = 'rgba(0, 0, 0, 0.95)';
        panel.style.border = '2px solid #9C27B0';
        panel.style.borderRadius = '10px';
        panel.style.padding = '20px';
        panel.style.minWidth = '400px';
        panel.style.maxWidth = '80vw';
        panel.style.maxHeight = '80vh';
        panel.style.overflow = 'auto';
        panel.style.color = 'white';
    }
    
    /**
     * Update connection status
     */
    updateConnectionStatus(status, moduleStatus) {
        const indicator = this.connectionIndicator;
        const dot = indicator.querySelector('.connection-dot');
        const text = indicator.querySelector('.connection-text');
        const statusText = document.querySelector('.status-text');
        const statusIndicator = document.querySelector('.status-indicator');
        const connectButton = document.getElementById('connectButton');
        const roomSection = document.querySelector('.room-section');
        
        // Update connection indicator
        dot.className = `connection-dot ${status.toLowerCase()}`;
        text.textContent = this.getStatusText(status);
        
        // Update main panel
        if (statusText) statusText.textContent = this.getStatusText(status);
        if (statusIndicator) statusIndicator.className = `status-indicator ${status.toLowerCase()}`;
        
        // Update UI based on connection state
        if (moduleStatus.connected) {
            indicator.style.display = 'flex';
            if (connectButton) connectButton.textContent = 'Disconnect';
            if (roomSection) roomSection.style.display = 'block';
        } else {
            if (status === 'OFFLINE') {
                indicator.style.display = 'none';
            } else {
                indicator.style.display = 'flex';
            }
            if (connectButton) connectButton.textContent = 'Connect';
            if (roomSection) roomSection.style.display = 'none';
        }
    }
    
    /**
     * Update room status
     */
    updateRoomStatus(action, room) {
        const roomInfo = document.querySelector('.room-info');
        const roomName = document.querySelector('.room-name');
        const roomPlayers = document.querySelector('.room-players');
        const leaveButton = document.getElementById('leaveRoomButton');
        const playersSection = document.querySelector('.players-section');
        
        if (action === 'joined') {
            if (roomName) roomName.textContent = room.name || room.roomId;
            if (roomPlayers) roomPlayers.textContent = `Players: ${room.currentPlayers}/${room.maxPlayers}`;
            if (leaveButton) leaveButton.style.display = 'inline-block';
            if (playersSection) playersSection.style.display = 'block';
            
            this.hidePanel('roomBrowser');
            this.hidePanel('createRoom');
            
        } else if (action === 'left') {
            if (roomName) roomName.textContent = 'Not in room';
            if (roomPlayers) roomPlayers.textContent = 'Players: 0/8';
            if (leaveButton) leaveButton.style.display = 'none';
            if (playersSection) playersSection.style.display = 'none';
        }
    }
    
    /**
     * Update player list
     */
    updatePlayerList(players) {
        const playersList = document.getElementById('playersList');
        const playerCount = document.getElementById('playerCount');
        
        if (!playersList) return;
        
        playerCount.textContent = `(${players.length})`;
        
        playersList.innerHTML = players.map(player => `
            <div class="player-item">
                <span class="player-avatar">👤</span>
                <span class="player-name">${player.name}</span>
                <span class="player-status ${player.currentAction}">${player.currentAction || 'idle'}</span>
            </div>
        `).join('');
    }
    
    /**
     * Display chat message
     */
    displayChatMessage(chatData) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <span class="message-time">${new Date(chatData.timestamp).toLocaleTimeString()}</span>
            <span class="message-author">${chatData.playerName}:</span>
            <span class="message-text">${this.escapeHtml(chatData.message)}</span>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    /**
     * Send chat message
     */
    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput || !chatInput.value.trim()) return;
        
        try {
            this.multiplayerModule.sendChatMessage(chatInput.value.trim());
            chatInput.value = '';
        } catch (error) {
            this.showNotification('Failed to send message: ' + this.getErrorMessage(error), 'error');
        }
    }
    
    /**
     * Handle room creation
     */
    async handleCreateRoom() {
        const formData = new FormData(document.getElementById('createRoomForm'));
        const roomOptions = {
            name: formData.get('roomName'),
            gameMode: formData.get('gameMode'),
            maxPlayers: parseInt(formData.get('maxPlayers')),
            isPublic: formData.get('isPublic') === 'on',
            settings: {
                allowChat: formData.get('allowChat') === 'on'
            }
        };
        
        try {
            await this.multiplayerModule.createRoom(roomOptions);
            this.showNotification('Room created successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to create room: ' + this.getErrorMessage(error), 'error');
        }
    }
    
    /**
     * Refresh room list
     */
    async refreshRoomList() {
        const roomsList = document.getElementById('roomsList');
        if (!roomsList) return;
        
        roomsList.innerHTML = '<div class="loading">Loading rooms...</div>';
        
        try {
            const rooms = await this.multiplayerModule.roomManager.getRoomList();
            
            if (rooms.length === 0) {
                roomsList.innerHTML = '<div class="no-rooms">No rooms available</div>';
                return;
            }
            
            roomsList.innerHTML = rooms.map(room => `
                <div class="room-item" onclick="window.MultiplayerUI.joinRoomFromBrowser('${room.roomId}')">
                    <div class="room-name">${room.name || room.roomId}</div>
                    <div class="room-info">
                        <span class="room-mode">${room.gameMode}</span>
                        <span class="room-players">${room.currentPlayers}/${room.maxPlayers}</span>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            roomsList.innerHTML = '<div class="error">Failed to load rooms</div>';
            this.showNotification('Failed to load rooms: ' + this.getErrorMessage(error), 'error');
        }
    }
    
    /**
     * Join room from browser
     */
    async joinRoomFromBrowser(roomId) {
        try {
            await this.multiplayerModule.joinRoom(roomId);
            this.showNotification('Joined room successfully!', 'success');
        } catch (error) {
            this.showNotification('Failed to join room: ' + this.getErrorMessage(error), 'error');
        }
    }
    
    /**
     * Save player name
     */
    savePlayerName() {
        const nameInput = document.getElementById('playerNameInput');
        if (!nameInput || !nameInput.value.trim()) return;
        
        const name = nameInput.value.trim();
        localStorage.setItem('pixelHarvestPlayerName', name);
        this.showNotification('Name saved!', 'success');
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mp-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 2000;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    /**
     * Utility methods
     */
    getErrorMessage(error) {
        // Handle different types of error objects
        if (typeof error === 'string') {
            return error;
        }
        
        if (error && error.message) {
            return error.message;
        }
        
        if (error && error.type) {
            // WebSocket Event objects
            return 'Connection failed';
        }
        
        if (error && error.code) {
            return `Connection error (${error.code})`;
        }
        
        // Fallback for unknown error types
        return 'An unexpected error occurred';
    }
    
    /**
     * Get detailed error message with helpful suggestions
     */
    getDetailedErrorMessage(error, serverUrl) {
        const baseMessage = this.getErrorMessage(error);
        
        // Check if it's a connection refusal to localhost
        if (serverUrl && (serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1')) && 
            (baseMessage.includes('Connection failed') || baseMessage.includes('refused'))) {
            return `Cannot connect to ${serverUrl}. No multiplayer server is running on this address. ` +
                   `Try demo mode to explore multiplayer features, or set up a server to play with others.`;
        }
        
        // Check for network/connection errors
        if (baseMessage.includes('Connection failed') || baseMessage.includes('timeout')) {
            return `Failed to connect to ${serverUrl}. Please check that the server is running and the address is correct.`;
        }
        
        return `Connection error: ${baseMessage}`;
    }
    
    /**
     * Show special dialog when localhost connection fails
     */
    showLocalhostFailureDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'localhost-failure-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3000;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 30px;
            border-radius: 10px;
            border: 2px solid #FF9800;
            max-width: 520px;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;
        
        dialog.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 15px;">🤔</div>
            <h3 style="margin-top: 0; color: #FF9800;">No Local Server Found</h3>
            <p>It looks like there's no multiplayer server running on localhost:8080.</p>
            <p style="color: #ccc; font-size: 14px; margin-bottom: 20px;">
                This is normal! The game is a client that connects to multiplayer servers. 
                To try multiplayer features right now, you can use demo mode.
            </p>
            <div style="background: rgba(156, 39, 176, 0.2); padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong style="color: #9C27B0;">💡 Recommended:</strong><br>
                <span style="font-size: 14px;">Start with demo mode to explore multiplayer features safely</span>
            </div>
            <div style="margin-top: 25px;">
                <button id="startDemoFromFailureBtn" class="mp-button primary" style="margin: 5px; background: #9C27B0;">
                    🎮 Try Demo Mode
                </button>
                <button id="learnMoreBtn" class="mp-button" style="margin: 5px; background: #2196F3;">
                    📚 Learn About Servers
                </button>
                <button id="dismissFailureBtn" class="mp-button" style="margin: 5px;">
                    Maybe Later
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Event handlers for dialog buttons
        document.getElementById('startDemoFromFailureBtn').addEventListener('click', () => {
            dialog.remove();
            this.startDemoMode();
        });
        
        document.getElementById('learnMoreBtn').addEventListener('click', () => {
            dialog.remove();
            window.open('https://github.com/SpeedCraftTV/Pixel-Harvest#multiplayer-setup', '_blank');
        });
        
        document.getElementById('dismissFailureBtn').addEventListener('click', () => {
            dialog.remove();
        });
        
        // Close on backdrop click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
        
        // Auto-close after 10 seconds if no interaction
        setTimeout(() => {
            if (document.body.contains(dialog)) {
                dialog.remove();
            }
        }, 10000);
    }
    
    /**
     * Show demo mode dialog
     */
    showDemoModeDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'demo-dialog';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3000;
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 30px;
            border-radius: 10px;
            border: 2px solid #9C27B0;
            max-width: 500px;
            text-align: center;
        `;
        
        dialog.innerHTML = `
            <h3 style="margin-top: 0; color: #9C27B0;">🎮 Demo Mode</h3>
            <p>Demo mode allows you to explore all multiplayer features offline!</p>
            <div style="background: rgba(76, 175, 80, 0.2); padding: 12px; border-radius: 6px; margin: 15px 0;">
                <strong style="color: #4CAF50;">✨ What you can try:</strong><br>
                <div style="font-size: 14px; text-align: left; margin-top: 8px;">
                    • Create and join virtual rooms<br>
                    • Test chat and communication features<br>
                    • Explore multiplayer UI and controls<br>
                    • Practice before joining real servers
                </div>
            </div>
            <p style="color: #ccc; font-size: 14px;">
                Note: This is a local simulation only. To play with other players, 
                you'll need to connect to a real multiplayer server.
            </p>
            <div style="margin-top: 20px;">
                <button id="startDemoBtn" class="mp-button primary" style="margin: 5px;">🚀 Start Demo</button>
                <button id="cancelDemoBtn" class="mp-button" style="margin: 5px;">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Event handlers for dialog buttons
        document.getElementById('startDemoBtn').addEventListener('click', () => {
            dialog.remove();
            this.startDemoMode();
        });
        
        document.getElementById('cancelDemoBtn').addEventListener('click', () => {
            dialog.remove();
        });
        
        // Close on backdrop click
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.remove();
            }
        });
    }
    
    /**
     * Start demo mode (local simulation)
     */
    startDemoMode() {
        // Set demo server URL
        const serverUrlInput = document.getElementById('serverUrl');
        if (serverUrlInput) {
            serverUrlInput.value = 'demo://local';
        }
        
        // Simulate successful connection
        this.multiplayerModule.setState('CONNECTED');
        this.updateConnectionStatus('CONNECTED', 'ONLINE');
        this.showNotification('Demo mode started! 🎮 You are now in offline multiplayer simulation. Try creating a room!', 'success');
        
        // Show room controls for demo
        const roomSection = document.querySelector('.room-section');
        if (roomSection) {
            roomSection.style.display = 'block';
        }
    }
    
    getStatusText(status) {
        switch (status) {
            case 'CONNECTED': return 'Online';
            case 'CONNECTING': return 'Connecting...';
            case 'RECONNECTING': return 'Reconnecting...';
            case 'DISCONNECTED': return 'Offline';
            case 'ERROR': return 'Error';
            default: return 'Unknown';
        }
    }
    
    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#f44336';
            case 'warning': return '#FF9800';
            default: return '#2196F3';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Enable/disable multiplayer UI based on feature flag
     */
    setEnabled(enabled) {
        const button = document.getElementById('multiplayerButton');
        if (button) {
            button.style.display = enabled ? 'block' : 'none';
        }
    }
    
    /**
     * Destroy UI elements
     */
    destroy() {
        this.panels.forEach(panel => panel.remove());
        this.panels.clear();
        
        if (this.connectionIndicator) {
            this.connectionIndicator.remove();
        }
        
        const button = document.getElementById('multiplayerButton');
        if (button) {
            button.remove();
        }
    }
}

// Create global instance
window.MultiplayerUI = new MultiplayerUI();

// CSS styles for multiplayer UI
const multiplayerStyles = `
<style>
.multiplayer-panel {
    font-family: Arial, sans-serif;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #9C27B0;
    padding-bottom: 10px;
}

.panel-header h2 {
    margin: 0;
    color: #9C27B0;
}

.panel-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
}

.panel-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.mp-button {
    background: #9C27B0;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
    margin: 2px;
}

.mp-button:hover {
    background: #7B1FA2;
}

.mp-button.primary {
    background: #4CAF50;
}

.mp-button.primary:hover {
    background: #45a049;
}

.mp-button.danger {
    background: #f44336;
}

.mp-button.danger:hover {
    background: #da190b;
}

.mp-button.small {
    padding: 4px 8px;
    font-size: 12px;
}

.mp-input, .mp-select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
}

.mp-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.connection-section {
    margin-bottom: 20px;
}

.server-config {
    margin-top: 15px;
}

.mp-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: white;
}

.server-input-group {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
}

.server-input-group .mp-input {
    flex: 1;
    margin: 0;
}

.server-input-group .mp-button {
    white-space: nowrap;
}

.server-help {
    margin-top: 8px;
}

.help-text {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    line-height: 1.4;
}

.help-text a {
    color: #9C27B0;
    text-decoration: none;
}

.help-text a:hover {
    text-decoration: underline;
}

.connection-status {
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #666;
}

.status-indicator.online {
    background: #4CAF50;
}

.status-indicator.connecting {
    background: #FF9800;
    animation: pulse 1s infinite;
}

.status-indicator.offline {
    background: #666;
}

.connection-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #666;
}

.connection-dot.connected {
    background: #4CAF50;
}

.connection-dot.connecting {
    background: #FF9800;
    animation: pulse 1s infinite;
}

.connection-dot.offline {
    background: #666;
}

.room-info {
    margin-bottom: 15px;
}

.room-name {
    font-weight: bold;
    font-size: 16px;
}

.room-players {
    color: #ccc;
    font-size: 14px;
}

.room-controls {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.players-list {
    max-height: 200px;
    overflow-y: auto;
}

.player-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.player-status {
    margin-left: auto;
    font-size: 12px;
    color: #ccc;
}

.room-item {
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.room-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.room-item .room-info {
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 12px;
    color: #ccc;
}

.chat-window {
    height: 400px;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    margin-bottom: 10px;
    background: rgba(0, 0, 0, 0.3);
}

.chat-message {
    margin-bottom: 8px;
    font-size: 14px;
}

.message-time {
    color: #888;
    font-size: 12px;
    margin-right: 8px;
}

.message-author {
    font-weight: bold;
    margin-right: 8px;
}

.chat-input-area {
    display: flex;
    gap: 10px;
}

.chat-input-area .mp-input {
    flex: 1;
}

.checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
}

.checkbox-label input[type="checkbox"] {
    margin: 0;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.loading, .no-rooms, .error {
    text-align: center;
    padding: 20px;
    color: #ccc;
}

.mp-notification {
    animation: slideIn 0.3s ease;
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', multiplayerStyles);