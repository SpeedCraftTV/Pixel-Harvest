/**
 * Main Multiplayer Module for Pixel-Harvest
 * Coordinates all multiplayer functionality
 */

class MultiplayerModule {
    constructor() {
        this.initialized = false;
        this.enabled = false;
        this.config = null;
        
        // Core components
        this.wsManager = null;
        this.roomManager = null;
        this.playerManager = null;
        this.eventSystem = null;
        
        // Module state
        this.state = 'OFFLINE'; // OFFLINE | CONNECTING | ONLINE | ERROR
        this.lastError = null;
        this.connectionQuality = 'unknown';
        
        // Game integration hooks
        this.gameIntegration = {
            getPlayerPosition: null,
            setPlayerPosition: null,
            getGameState: null,
            updateGameState: null,
            showNotification: null
        };
        
        // UI callbacks
        this.uiCallbacks = {
            onConnectionStatusChange: null,
            onRoomStatusChange: null,
            onPlayerListUpdate: null,
            onChatMessage: null,
            onNotification: null
        };
        
        console.log('🎮 Multiplayer module created');
    }
    
    /**
     * Initialize the multiplayer module
     */
    async initialize(gameConfig = {}) {
        if (this.initialized) {
            console.warn('Multiplayer module already initialized');
            return;
        }
        
        try {
            // Load configuration
            await this.loadConfiguration();
            
            if (!this.enabled) {
                console.log('🔒 Multiplayer module disabled in configuration');
                return;
            }
            
            // Initialize core components
            this.initializeComponents();
            
            // Setup event handlers
            this.setupEventHandlers();
            
            // Initialize game integration
            this.setupGameIntegration(gameConfig);
            
            this.initialized = true;
            this.setState('OFFLINE');
            
            console.log('✅ Multiplayer module initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize multiplayer module:', error);
            this.setState('ERROR');
            this.lastError = error;
            throw error;
        }
    }
    
    /**
     * Load configuration from features.json
     */
    async loadConfiguration() {
        try {
            const response = await fetch('data/features.json');
            const data = await response.json();
            
            this.config = data.features.multiplayer.config;
            this.enabled = data.features.multiplayer.enabled;
            
            console.log('📋 Multiplayer configuration loaded:', this.config);
            
        } catch (error) {
            console.error('Failed to load configuration, using defaults');
            // Use default configuration
            this.config = {
                heartbeatInterval: 30000,
                reconnectAttempts: 3,
                maxPlayersPerRoom: 8,
                enableChat: true
            };
            this.enabled = false;
        }
    }
    
    /**
     * Initialize core components
     */
    initializeComponents() {
        // Initialize WebSocket manager
        this.wsManager = new WebSocketManager(this.config);
        
        // Initialize room manager
        this.roomManager = new RoomManager(this.wsManager);
        
        // Initialize player manager
        this.playerManager = new PlayerManager(this.wsManager);
        
        // Initialize event system
        this.eventSystem = new MultiplayerEventSystem(this.wsManager);
        
        console.log('🔧 Core components initialized');
    }
    
    /**
     * Setup event handlers between components
     */
    setupEventHandlers() {
        // WebSocket connection events
        this.wsManager.onStateChange = (newState, oldState) => {
            this.handleConnectionStateChange(newState, oldState);
        };
        
        this.wsManager.onMessage = (message) => {
            this.routeMessage(message);
        };
        
        // Room events
        this.roomManager.onRoomJoined = (room) => {
            this.handleRoomJoined(room);
        };
        
        this.roomManager.onRoomLeft = (room) => {
            this.handleRoomLeft(room);
        };
        
        this.roomManager.onPlayerJoined = (player) => {
            this.handlePlayerJoined(player);
        };
        
        this.roomManager.onPlayerLeft = (player) => {
            this.handlePlayerLeft(player);
        };
        
        // Player events
        this.playerManager.onPlayerUpdate = (type, player) => {
            this.handlePlayerUpdate(type, player);
        };
        
        this.playerManager.onPlayerAction = (action) => {
            this.handlePlayerAction(action);
        };
        
        // Game events
        this.eventSystem.on('player_move', (event) => {
            this.handlePlayerMoveEvent(event);
        });
        
        this.eventSystem.on('plant_seed', (event) => {
            this.handlePlantSeedEvent(event);
        });
        
        this.eventSystem.on('harvest_plant', (event) => {
            this.handleHarvestPlantEvent(event);
        });
        
        this.eventSystem.on('chat_message', (event) => {
            this.handleChatMessageEvent(event);
        });
        
        console.log('🔗 Event handlers setup complete');
    }
    
    /**
     * Setup game integration hooks
     */
    setupGameIntegration(gameConfig) {
        // Register with the main game loop
        if (window.MultiplayerModule) {
            window.MultiplayerModule = this;
        }
        
        // Hook into game events
        if (typeof window.addEventListener === 'function') {
            window.addEventListener('gameStateUpdate', (event) => {
                this.handleGameStateUpdate(event.detail);
            });
        }
        
        console.log('🎮 Game integration setup complete');
    }
    
    /**
     * Connect to multiplayer server
     */
    async connect(serverUrl) {
        if (!this.initialized || !this.enabled) {
            throw new Error('Multiplayer module not initialized or disabled');
        }
        
        try {
            this.setState('CONNECTING');
            
            // Use default server URL if not provided
            const url = serverUrl || this.config.defaultServerUrl || 'localhost:8080';
            
            await this.wsManager.connect(url);
            
            console.log('🌐 Connected to multiplayer server');
            
        } catch (error) {
            console.error('❌ Failed to connect to server:', error);
            this.setState('ERROR');
            this.lastError = error;
            throw error;
        }
    }
    
    /**
     * Disconnect from multiplayer server
     */
    async disconnect() {
        if (this.wsManager) {
            // Leave current room if in one
            if (this.roomManager && this.roomManager.isInRoom()) {
                await this.roomManager.leaveRoom();
            }
            
            // Disconnect WebSocket
            this.wsManager.disconnect();
            
            this.setState('OFFLINE');
            console.log('🔌 Disconnected from multiplayer server');
        }
    }
    
    /**
     * Create a multiplayer room
     */
    async createRoom(roomOptions = {}) {
        if (!this.isOnline()) {
            throw new Error('Not connected to multiplayer server');
        }
        
        return this.roomManager.createRoom(roomOptions);
    }
    
    /**
     * Join a multiplayer room
     */
    async joinRoom(roomId, playerData = null) {
        if (!this.isOnline()) {
            throw new Error('Not connected to multiplayer server');
        }
        
        return this.roomManager.joinRoom(roomId, playerData);
    }
    
    /**
     * Quick join available room
     */
    async quickJoin(preferences = {}) {
        if (!this.isOnline()) {
            throw new Error('Not connected to multiplayer server');
        }
        
        return this.roomManager.quickJoin(preferences);
    }
    
    /**
     * Leave current room
     */
    async leaveRoom() {
        if (this.roomManager) {
            return this.roomManager.leaveRoom();
        }
    }
    
    /**
     * Send chat message
     */
    sendChatMessage(message) {
        if (!this.roomManager.isInRoom()) {
            throw new Error('Not in a room');
        }
        
        this.eventSystem.emit('chat_message', {
            message: message,
            timestamp: Date.now()
        });
    }
    
    /**
     * Sync player action to other players
     */
    syncPlayerAction(actionType, actionData) {
        if (!this.roomManager.isInRoom()) {
            return; // Don't sync if not in multiplayer
        }
        
        this.eventSystem.emit(actionType, actionData);
    }
    
    /**
     * Update player state
     */
    updatePlayerState(stateUpdates) {
        if (this.playerManager) {
            this.playerManager.updateLocalPlayer(stateUpdates);
        }
    }
    
    /**
     * Get current room info
     */
    getRoomInfo() {
        return this.roomManager ? this.roomManager.getRoomInfo() : null;
    }
    
    /**
     * Get all players in current room
     */
    getPlayers() {
        return this.playerManager ? this.playerManager.getAllPlayers() : [];
    }
    
    /**
     * Get module status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            enabled: this.enabled,
            state: this.state,
            connected: this.isOnline(),
            inRoom: this.roomManager ? this.roomManager.isInRoom() : false,
            roomInfo: this.getRoomInfo(),
            playerCount: this.getPlayers().length,
            connectionQuality: this.connectionQuality,
            lastError: this.lastError,
            metrics: this.getMetrics()
        };
    }
    
    /**
     * Get performance metrics
     */
    getMetrics() {
        const metrics = {};
        
        if (this.wsManager) {
            metrics.connection = this.wsManager.getStatus();
        }
        
        if (this.playerManager) {
            metrics.players = this.playerManager.getStats();
        }
        
        if (this.eventSystem) {
            metrics.events = this.eventSystem.getMetrics();
        }
        
        return metrics;
    }
    
    /**
     * Route WebSocket messages to appropriate handlers
     */
    routeMessage(message) {
        // Route to room manager
        if (['PLAYER_JOINED', 'PLAYER_LEFT', 'ROOM_UPDATED', 'KICKED_FROM_ROOM'].includes(message.type)) {
            this.roomManager.handleWebSocketMessage(message);
        }
        
        // Route to player manager
        if (['PLAYER_STATE_UPDATE', 'PLAYER_ACTION', 'GAME_STATE_SYNC'].includes(message.type)) {
            this.playerManager.handleWebSocketMessage(message);
        }
        
        // Route to event system
        if (['GAME_EVENT', 'EVENT_BATCH', 'EVENT_CONFLICT_RESOLUTION'].includes(message.type)) {
            this.eventSystem.handleWebSocketMessage(message);
        }
        
        // Handle chat messages
        if (message.type === 'CHAT_MESSAGE') {
            this.handleChatMessage(message.data);
        }
    }
    
    /**
     * Event handlers
     */
    handleConnectionStateChange(newState, oldState) {
        switch (newState) {
            case 'CONNECTED':
                this.setState('ONLINE');
                this.connectionQuality = 'good';
                break;
            case 'DISCONNECTED':
                this.setState('OFFLINE');
                this.connectionQuality = 'unknown';
                break;
            case 'RECONNECTING':
                this.connectionQuality = 'poor';
                break;
        }
        
        if (this.uiCallbacks.onConnectionStatusChange) {
            this.uiCallbacks.onConnectionStatusChange(newState, this.getStatus());
        }
    }
    
    handleRoomJoined(room) {
        console.log('🏠 Joined room:', room.roomId);
        
        // Initialize local player in player manager
        const playerData = {
            playerId: this.roomManager.getPlayerId(),
            name: this.roomManager.getPlayerName(),
            avatar: {}
        };
        
        this.playerManager.initializeLocalPlayer(playerData);
        
        if (this.uiCallbacks.onRoomStatusChange) {
            this.uiCallbacks.onRoomStatusChange('joined', room);
        }
    }
    
    handleRoomLeft(room) {
        console.log('🚪 Left room:', room.roomId);
        
        if (this.uiCallbacks.onRoomStatusChange) {
            this.uiCallbacks.onRoomStatusChange('left', room);
        }
    }
    
    handlePlayerJoined(player) {
        console.log('👤 Player joined:', player.name);
        
        this.playerManager.addRemotePlayer(player);
        
        if (this.uiCallbacks.onPlayerListUpdate) {
            this.uiCallbacks.onPlayerListUpdate(this.getPlayers());
        }
        
        this.showNotification(`${player.name} joined the farm!`);
    }
    
    handlePlayerLeft(player) {
        console.log('👤 Player left:', player.playerId);
        
        this.playerManager.removeRemotePlayer(player.playerId);
        
        if (this.uiCallbacks.onPlayerListUpdate) {
            this.uiCallbacks.onPlayerListUpdate(this.getPlayers());
        }
    }
    
    handlePlayerUpdate(type, player) {
        if (this.uiCallbacks.onPlayerListUpdate) {
            this.uiCallbacks.onPlayerListUpdate(this.getPlayers());
        }
    }
    
    handlePlayerAction(action) {
        // Handle visual feedback for other players' actions
        console.log('🎬 Player action:', action.type, action.playerId);
    }
    
    handleChatMessage(chatData) {
        console.log('💬 Chat message:', chatData.message);
        
        if (this.uiCallbacks.onChatMessage) {
            this.uiCallbacks.onChatMessage(chatData);
        }
    }
    
    handleGameStateUpdate(gameState) {
        // Sync important game state changes
        if (this.roomManager.isInRoom()) {
            this.updatePlayerState({
                position: gameState.playerPosition,
                currentAction: gameState.currentAction,
                lastUpdate: Date.now()
            });
        }
    }
    
    // Game event handlers
    handlePlayerMoveEvent(event) {
        if (this.gameIntegration.setPlayerPosition && event.data.playerId !== this.roomManager.getPlayerId()) {
            this.gameIntegration.setPlayerPosition(event.data.playerId, event.data.position);
        }
    }
    
    handlePlantSeedEvent(event) {
        if (event.data.playerId !== this.roomManager.getPlayerId()) {
            // Apply the planting action to the game state
            console.log('🌱 Remote player planted seed:', event.data);
        }
    }
    
    handleHarvestPlantEvent(event) {
        if (event.data.playerId !== this.roomManager.getPlayerId()) {
            // Apply the harvest action to the game state
            console.log('🌾 Remote player harvested plant:', event.data);
        }
    }
    
    handleChatMessageEvent(event) {
        this.handleChatMessage({
            playerId: event.playerId,
            playerName: this.getPlayerName(event.playerId),
            message: event.data.message,
            timestamp: event.timestamp
        });
    }
    
    /**
     * Utility methods
     */
    setState(newState) {
        if (this.state !== newState) {
            const oldState = this.state;
            this.state = newState;
            console.log(`🔄 Multiplayer state: ${oldState} → ${newState}`);
        }
    }
    
    isEnabled() {
        return this.enabled;
    }
    
    isInitialized() {
        return this.initialized;
    }
    
    isOnline() {
        return this.state === 'ONLINE';
    }
    
    isInRoom() {
        return this.roomManager ? this.roomManager.isInRoom() : false;
    }
    
    getPlayerName(playerId) {
        const player = this.playerManager.getPlayer(playerId);
        return player ? player.name : 'Unknown Player';
    }
    
    showNotification(message, type = 'info') {
        if (this.gameIntegration.showNotification) {
            this.gameIntegration.showNotification(message, type);
        } else if (this.uiCallbacks.onNotification) {
            this.uiCallbacks.onNotification(message, type);
        } else {
            console.log(`📢 ${message}`);
        }
    }
    
    /**
     * Update configuration at runtime
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        if (this.wsManager) {
            this.wsManager.config = { ...this.wsManager.config, ...newConfig };
        }
        
        if (this.playerManager) {
            this.playerManager.updateConfig(newConfig);
        }
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.wsManager) {
            this.wsManager.destroy();
        }
        
        if (this.roomManager) {
            this.roomManager.destroy();
        }
        
        if (this.playerManager) {
            this.playerManager.destroy();
        }
        
        if (this.eventSystem) {
            this.eventSystem.destroy();
        }
        
        this.initialized = false;
        this.enabled = false;
        
        console.log('🗑️ Multiplayer module destroyed');
    }
}

// Create global instance
window.MultiplayerModule = new MultiplayerModule();

// Integration hook for main game
window.MultiplayerModule.update = function(deltaTime) {
    // Called from main game loop if multiplayer is enabled
    // Update any time-based multiplayer operations here
};

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerModule;
}