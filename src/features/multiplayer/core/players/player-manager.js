/**
 * Player Manager for Pixel-Harvest Multiplayer
 * Handles player state synchronization and management
 */

class PlayerManager {
    constructor(webSocketManager) {
        this.wsManager = webSocketManager;
        this.localPlayer = null;
        this.remotePlayers = new Map();
        this.lastSyncTime = 0;
        this.syncInterval = 100; // 100ms default sync interval
        this.positionBuffer = new Map(); // For smooth interpolation
        
        // Player state tracking
        this.playerStates = {
            position: { x: 0, y: 0, z: 0 },
            rotation: 0,
            currentAction: 'idle',
            actionTarget: null,
            inventory: {},
            lastUpdate: Date.now()
        };
        
        // Event callbacks
        this.onPlayerUpdate = null;
        this.onPlayerAction = null;
        this.onPlayerStateChange = null;
        
        // Optimization settings
        this.maxUpdateDistance = 50; // Only sync players within this distance
        this.compressionEnabled = true;
        this.predictionEnabled = true;
        
        // Start sync timer
        this.startSyncTimer();
    }
    
    /**
     * Initialize local player
     */
    initializeLocalPlayer(playerData) {
        this.localPlayer = {
            playerId: playerData.playerId,
            name: playerData.name,
            avatar: playerData.avatar || {},
            ...this.playerStates
        };
        
        console.log('👤 Local player initialized:', this.localPlayer.playerId);
    }
    
    /**
     * Update local player state
     */
    updateLocalPlayer(updates) {
        if (!this.localPlayer) return;
        
        // Update local state
        Object.assign(this.playerStates, updates);
        this.playerStates.lastUpdate = Date.now();
        
        // Send update to server if significant change
        this.queueStateSync(updates);
    }
    
    /**
     * Add remote player
     */
    addRemotePlayer(playerData) {
        const player = {
            playerId: playerData.playerId,
            name: playerData.name,
            avatar: playerData.avatar || {},
            position: playerData.position || { x: 0, y: 0, z: 0 },
            rotation: playerData.rotation || 0,
            currentAction: playerData.currentAction || 'idle',
            actionTarget: playerData.actionTarget || null,
            lastUpdate: Date.now(),
            interpolationTarget: null,
            interpolationStart: null
        };
        
        this.remotePlayers.set(playerData.playerId, player);
        
        // Initialize position buffer for smooth movement
        this.positionBuffer.set(playerData.playerId, []);
        
        console.log('👤 Remote player added:', playerData.playerId);
        
        if (this.onPlayerUpdate) {
            this.onPlayerUpdate('added', player);
        }
    }
    
    /**
     * Remove remote player
     */
    removeRemotePlayer(playerId) {
        const player = this.remotePlayers.get(playerId);
        if (player) {
            this.remotePlayers.delete(playerId);
            this.positionBuffer.delete(playerId);
            
            console.log('👤 Remote player removed:', playerId);
            
            if (this.onPlayerUpdate) {
                this.onPlayerUpdate('removed', player);
            }
        }
    }
    
    /**
     * Update remote player state
     */
    updateRemotePlayer(playerId, updates) {
        const player = this.remotePlayers.get(playerId);
        if (!player) return;
        
        // Handle position updates with interpolation
        if (updates.position) {
            this.setupPositionInterpolation(playerId, updates.position);
        }
        
        // Update other properties directly
        Object.assign(player, updates);
        player.lastUpdate = Date.now();
        
        if (this.onPlayerUpdate) {
            this.onPlayerUpdate('updated', player);
        }
    }
    
    /**
     * Setup smooth position interpolation
     */
    setupPositionInterpolation(playerId, targetPosition) {
        const player = this.remotePlayers.get(playerId);
        if (!player) return;
        
        player.interpolationStart = {
            position: { ...player.position },
            timestamp: Date.now()
        };
        
        player.interpolationTarget = {
            position: targetPosition,
            timestamp: Date.now() + this.syncInterval
        };
    }
    
    /**
     * Update interpolated positions
     */
    updateInterpolations() {
        const now = Date.now();
        
        this.remotePlayers.forEach((player, playerId) => {
            if (player.interpolationTarget && player.interpolationStart) {
                const startTime = player.interpolationStart.timestamp;
                const endTime = player.interpolationTarget.timestamp;
                const progress = Math.min(1, (now - startTime) / (endTime - startTime));
                
                if (progress >= 1) {
                    // Interpolation complete
                    player.position = { ...player.interpolationTarget.position };
                    player.interpolationTarget = null;
                    player.interpolationStart = null;
                } else {
                    // Interpolate position
                    const start = player.interpolationStart.position;
                    const target = player.interpolationTarget.position;
                    
                    player.position = {
                        x: start.x + (target.x - start.x) * progress,
                        y: start.y + (target.y - start.y) * progress,
                        z: start.z + (target.z - start.z) * progress
                    };
                }
            }
        });
    }
    
    /**
     * Handle player action (planting, harvesting, etc.)
     */
    handlePlayerAction(actionType, actionData) {
        const action = {
            playerId: this.localPlayer?.playerId,
            type: actionType,
            data: actionData,
            timestamp: Date.now()
        };
        
        // Send action to server
        this.wsManager.send('PLAYER_ACTION', action);
        
        // Update local state
        this.updateLocalPlayer({
            currentAction: actionType,
            actionTarget: actionData,
            lastUpdate: Date.now()
        });
        
        if (this.onPlayerAction) {
            this.onPlayerAction(action);
        }
    }
    
    /**
     * Queue state synchronization
     */
    queueStateSync(updates) {
        // Implement delta compression to only send changed data
        const deltaUpdates = this.createDelta(updates);
        
        if (Object.keys(deltaUpdates).length > 0) {
            this.wsManager.send('PLAYER_STATE_UPDATE', {
                playerId: this.localPlayer.playerId,
                updates: deltaUpdates,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Create delta of changes since last sync
     */
    createDelta(updates) {
        const delta = {};
        
        // Position changes (only if significant movement)
        if (updates.position) {
            const currentPos = this.playerStates.position;
            const newPos = updates.position;
            const distance = Math.sqrt(
                Math.pow(newPos.x - currentPos.x, 2) +
                Math.pow(newPos.z - currentPos.z, 2)
            );
            
            if (distance > 0.1) { // Minimum movement threshold
                delta.position = newPos;
            }
        }
        
        // Action changes
        if (updates.currentAction && updates.currentAction !== this.playerStates.currentAction) {
            delta.currentAction = updates.currentAction;
        }
        
        // Rotation changes
        if (updates.rotation && Math.abs(updates.rotation - this.playerStates.rotation) > 0.1) {
            delta.rotation = updates.rotation;
        }
        
        return delta;
    }
    
    /**
     * Handle WebSocket messages
     */
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'PLAYER_JOINED':
                this.addRemotePlayer(message.data.player);
                break;
                
            case 'PLAYER_LEFT':
                this.removeRemotePlayer(message.data.playerId);
                break;
                
            case 'PLAYER_STATE_UPDATE':
                this.updateRemotePlayer(message.data.playerId, message.data.updates);
                break;
                
            case 'PLAYER_ACTION':
                this.handleRemotePlayerAction(message.data);
                break;
                
            case 'GAME_STATE_SYNC':
                this.handleGameStateSync(message.data);
                break;
        }
    }
    
    /**
     * Handle remote player action
     */
    handleRemotePlayerAction(actionData) {
        const player = this.remotePlayers.get(actionData.playerId);
        if (!player) return;
        
        // Update player action state
        player.currentAction = actionData.type;
        player.actionTarget = actionData.data;
        player.lastUpdate = Date.now();
        
        if (this.onPlayerAction) {
            this.onPlayerAction(actionData);
        }
    }
    
    /**
     * Handle full game state synchronization
     */
    handleGameStateSync(syncData) {
        // Update all player states
        if (syncData.players) {
            syncData.players.forEach(playerData => {
                if (playerData.playerId !== this.localPlayer?.playerId) {
                    this.updateRemotePlayer(playerData.playerId, playerData);
                }
            });
        }
        
        if (this.onPlayerStateChange) {
            this.onPlayerStateChange(syncData);
        }
    }
    
    /**
     * Start synchronization timer
     */
    startSyncTimer() {
        setInterval(() => {
            this.updateInterpolations();
            
            // Periodic full sync (less frequent)
            if (Date.now() - this.lastSyncTime > this.syncInterval * 10) {
                this.sendFullSync();
                this.lastSyncTime = Date.now();
            }
        }, this.syncInterval / 2); // Run at higher frequency for smooth interpolation
    }
    
    /**
     * Send full player state sync
     */
    sendFullSync() {
        if (!this.localPlayer) return;
        
        this.wsManager.send('PLAYER_FULL_SYNC', {
            playerId: this.localPlayer.playerId,
            state: {
                ...this.playerStates,
                timestamp: Date.now()
            }
        });
    }
    
    /**
     * Get player by ID
     */
    getPlayer(playerId) {
        if (this.localPlayer && this.localPlayer.playerId === playerId) {
            return this.localPlayer;
        }
        return this.remotePlayers.get(playerId);
    }
    
    /**
     * Get all players
     */
    getAllPlayers() {
        const players = [];
        if (this.localPlayer) {
            players.push(this.localPlayer);
        }
        this.remotePlayers.forEach(player => players.push(player));
        return players;
    }
    
    /**
     * Get players within distance
     */
    getPlayersInRange(position, range) {
        return this.getAllPlayers().filter(player => {
            if (!player.position) return false;
            
            const distance = Math.sqrt(
                Math.pow(player.position.x - position.x, 2) +
                Math.pow(player.position.z - position.z, 2)
            );
            
            return distance <= range;
        });
    }
    
    /**
     * Update configuration
     */
    updateConfig(config) {
        if (config.syncInterval) {
            this.syncInterval = config.syncInterval;
        }
        if (config.maxUpdateDistance !== undefined) {
            this.maxUpdateDistance = config.maxUpdateDistance;
        }
        if (config.compressionEnabled !== undefined) {
            this.compressionEnabled = config.compressionEnabled;
        }
        if (config.predictionEnabled !== undefined) {
            this.predictionEnabled = config.predictionEnabled;
        }
    }
    
    /**
     * Get player statistics
     */
    getStats() {
        return {
            localPlayer: this.localPlayer ? 1 : 0,
            remotePlayers: this.remotePlayers.size,
            totalPlayers: this.getAllPlayers().length,
            syncInterval: this.syncInterval,
            lastSyncTime: this.lastSyncTime
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.localPlayer = null;
        this.remotePlayers.clear();
        this.positionBuffer.clear();
        
        // Clear callbacks
        this.onPlayerUpdate = null;
        this.onPlayerAction = null;
        this.onPlayerStateChange = null;
    }
}

// Export for use in multiplayer module
window.PlayerManager = PlayerManager;