/**
 * Room Manager for Pixel-Harvest Multiplayer
 * Handles room creation, joining, and management
 */

class RoomManager {
    constructor(webSocketManager) {
        this.wsManager = webSocketManager;
        this.currentRoom = null;
        this.availableRooms = new Map();
        this.playerSession = null;
        
        // Room configuration defaults
        this.roomDefaults = {
            maxPlayers: 8,
            gameMode: 'cooperative',
            isPublic: true,
            allowChat: true,
            sharedInventory: false,
            timeLimit: null
        };
        
        // Event callbacks
        this.onRoomJoined = null;
        this.onRoomLeft = null;
        this.onRoomUpdated = null;
        this.onPlayerJoined = null;
        this.onPlayerLeft = null;
        this.onRoomListUpdated = null;
        
        // Bind WebSocket message handling
        if (this.wsManager) {
            this.wsManager.onMessage = (message) => this.handleWebSocketMessage(message);
        }
    }
    
    /**
     * Create a new multiplayer room
     */
    async createRoom(roomOptions = {}) {
        const roomConfig = {
            ...this.roomDefaults,
            ...roomOptions,
            roomId: this.generateRoomId(),
            createdAt: Date.now(),
            hostPlayerId: this.getPlayerId()
        };
        
        try {
            const response = await this.wsManager.sendWithAck('CREATE_ROOM', roomConfig);
            
            if (response.success) {
                this.currentRoom = response.room;
                console.log('🏠 Room created successfully:', this.currentRoom.roomId);
                
                if (this.onRoomJoined) {
                    this.onRoomJoined(this.currentRoom);
                }
                
                return this.currentRoom;
            } else {
                throw new Error(response.error || 'Failed to create room');
            }
        } catch (error) {
            console.error('Failed to create room:', error);
            throw error;
        }
    }
    
    /**
     * Join an existing room
     */
    async joinRoom(roomId, playerData = null) {
        if (this.currentRoom) {
            console.warn('Already in a room, leaving current room first');
            await this.leaveRoom();
        }
        
        const joinData = {
            roomId,
            playerData: playerData || this.getDefaultPlayerData()
        };
        
        try {
            const response = await this.wsManager.sendWithAck('JOIN_ROOM', joinData);
            
            if (response.success) {
                this.currentRoom = response.room;
                this.playerSession = response.playerSession;
                
                console.log('🚪 Joined room:', roomId);
                console.log('👥 Players in room:', this.currentRoom.players.length);
                
                if (this.onRoomJoined) {
                    this.onRoomJoined(this.currentRoom);
                }
                
                return this.currentRoom;
            } else {
                throw new Error(response.error || 'Failed to join room');
            }
        } catch (error) {
            console.error('Failed to join room:', error);
            throw error;
        }
    }
    
    /**
     * Leave current room
     */
    async leaveRoom() {
        if (!this.currentRoom) {
            console.warn('Not in any room');
            return;
        }
        
        try {
            await this.wsManager.sendWithAck('LEAVE_ROOM', {
                roomId: this.currentRoom.roomId
            });
            
            const leftRoom = this.currentRoom;
            this.currentRoom = null;
            this.playerSession = null;
            
            console.log('🚪 Left room:', leftRoom.roomId);
            
            if (this.onRoomLeft) {
                this.onRoomLeft(leftRoom);
            }
            
        } catch (error) {
            console.error('Failed to leave room:', error);
            // Force local cleanup even if server communication fails
            this.currentRoom = null;
            this.playerSession = null;
        }
    }
    
    /**
     * Get list of available public rooms
     */
    async getRoomList(filters = {}) {
        try {
            const response = await this.wsManager.sendWithAck('GET_ROOM_LIST', filters);
            
            if (response.success) {
                this.availableRooms.clear();
                response.rooms.forEach(room => {
                    this.availableRooms.set(room.roomId, room);
                });
                
                if (this.onRoomListUpdated) {
                    this.onRoomListUpdated(Array.from(this.availableRooms.values()));
                }
                
                return Array.from(this.availableRooms.values());
            } else {
                throw new Error(response.error || 'Failed to get room list');
            }
        } catch (error) {
            console.error('Failed to get room list:', error);
            return [];
        }
    }
    
    /**
     * Kick a player from the room (host only)
     */
    async kickPlayer(playerId) {
        if (!this.currentRoom || !this.isHost()) {
            throw new Error('Not authorized to kick players');
        }
        
        try {
            const response = await this.wsManager.sendWithAck('KICK_PLAYER', {
                roomId: this.currentRoom.roomId,
                playerId
            });
            
            if (!response.success) {
                throw new Error(response.error || 'Failed to kick player');
            }
            
            console.log('👋 Player kicked:', playerId);
        } catch (error) {
            console.error('Failed to kick player:', error);
            throw error;
        }
    }
    
    /**
     * Update room settings (host only)
     */
    async updateRoomSettings(settings) {
        if (!this.currentRoom || !this.isHost()) {
            throw new Error('Not authorized to update room settings');
        }
        
        try {
            const response = await this.wsManager.sendWithAck('UPDATE_ROOM_SETTINGS', {
                roomId: this.currentRoom.roomId,
                settings
            });
            
            if (response.success) {
                Object.assign(this.currentRoom.settings, settings);
                console.log('⚙️ Room settings updated');
                
                if (this.onRoomUpdated) {
                    this.onRoomUpdated(this.currentRoom);
                }
            } else {
                throw new Error(response.error || 'Failed to update room settings');
            }
        } catch (error) {
            console.error('Failed to update room settings:', error);
            throw error;
        }
    }
    
    /**
     * Handle WebSocket messages
     */
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'PLAYER_JOINED':
                this.handlePlayerJoined(message.data);
                break;
                
            case 'PLAYER_LEFT':
                this.handlePlayerLeft(message.data);
                break;
                
            case 'ROOM_UPDATED':
                this.handleRoomUpdated(message.data);
                break;
                
            case 'ROOM_LIST_UPDATED':
                this.handleRoomListUpdated(message.data);
                break;
                
            case 'KICKED_FROM_ROOM':
                this.handleKickedFromRoom(message.data);
                break;
                
            default:
                // Forward other messages to the main multiplayer system
                break;
        }
    }
    
    /**
     * Handle player joined event
     */
    handlePlayerJoined(data) {
        if (this.currentRoom && data.roomId === this.currentRoom.roomId) {
            this.currentRoom.players.push(data.player);
            this.currentRoom.currentPlayers = this.currentRoom.players.length;
            
            console.log('👤 Player joined room:', data.player.name);
            
            if (this.onPlayerJoined) {
                this.onPlayerJoined(data.player);
            }
            
            if (this.onRoomUpdated) {
                this.onRoomUpdated(this.currentRoom);
            }
        }
    }
    
    /**
     * Handle player left event
     */
    handlePlayerLeft(data) {
        if (this.currentRoom && data.roomId === this.currentRoom.roomId) {
            this.currentRoom.players = this.currentRoom.players.filter(
                player => player.playerId !== data.playerId
            );
            this.currentRoom.currentPlayers = this.currentRoom.players.length;
            
            console.log('👤 Player left room:', data.playerId);
            
            if (this.onPlayerLeft) {
                this.onPlayerLeft(data);
            }
            
            if (this.onRoomUpdated) {
                this.onRoomUpdated(this.currentRoom);
            }
        }
    }
    
    /**
     * Handle room updated event
     */
    handleRoomUpdated(data) {
        if (this.currentRoom && data.roomId === this.currentRoom.roomId) {
            Object.assign(this.currentRoom, data.updates);
            
            console.log('🏠 Room updated');
            
            if (this.onRoomUpdated) {
                this.onRoomUpdated(this.currentRoom);
            }
        }
    }
    
    /**
     * Handle room list updated event
     */
    handleRoomListUpdated(data) {
        this.availableRooms.clear();
        data.rooms.forEach(room => {
            this.availableRooms.set(room.roomId, room);
        });
        
        if (this.onRoomListUpdated) {
            this.onRoomListUpdated(Array.from(this.availableRooms.values()));
        }
    }
    
    /**
     * Handle being kicked from room
     */
    handleKickedFromRoom(data) {
        if (this.currentRoom && data.roomId === this.currentRoom.roomId) {
            const leftRoom = this.currentRoom;
            this.currentRoom = null;
            this.playerSession = null;
            
            console.log('❌ Kicked from room:', data.reason || 'No reason provided');
            
            if (this.onRoomLeft) {
                this.onRoomLeft(leftRoom, 'kicked');
            }
        }
    }
    
    /**
     * Quick join - find and join an available room
     */
    async quickJoin(preferences = {}) {
        const rooms = await this.getRoomList({
            gameMode: preferences.gameMode || 'cooperative',
            hasSpace: true,
            isPublic: true
        });
        
        if (rooms.length === 0) {
            // No rooms available, create a new one
            return this.createRoom({
                gameMode: preferences.gameMode || 'cooperative',
                isPublic: true,
                name: `${this.getPlayerName()}'s Farm`
            });
        }
        
        // Join the room with the most players (but not full)
        const bestRoom = rooms
            .filter(room => room.currentPlayers < room.maxPlayers)
            .sort((a, b) => b.currentPlayers - a.currentPlayers)[0];
        
        if (bestRoom) {
            return this.joinRoom(bestRoom.roomId);
        } else {
            throw new Error('No suitable rooms found');
        }
    }
    
    /**
     * Utility methods
     */
    generateRoomId() {
        return 'room_' + Math.random().toString(36).substr(2, 9);
    }
    
    getPlayerId() {
        // Get or create player ID from session storage
        let playerId = sessionStorage.getItem('pixelHarvestPlayerId');
        if (!playerId) {
            playerId = 'player_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('pixelHarvestPlayerId', playerId);
        }
        return playerId;
    }
    
    getPlayerName() {
        return localStorage.getItem('pixelHarvestPlayerName') || 'Anonymous Farmer';
    }
    
    getDefaultPlayerData() {
        return {
            playerId: this.getPlayerId(),
            name: this.getPlayerName(),
            avatar: {
                // Default avatar configuration
                color: '#4CAF50',
                style: 'farmer'
            },
            position: { x: 0, y: 0, z: 0 },
            currentAction: 'idle',
            joinedAt: Date.now()
        };
    }
    
    isHost() {
        return this.currentRoom && 
               this.currentRoom.hostPlayerId === this.getPlayerId();
    }
    
    isInRoom() {
        return this.currentRoom !== null;
    }
    
    getCurrentRoom() {
        return this.currentRoom;
    }
    
    getPlayerSession() {
        return this.playerSession;
    }
    
    getRoomInfo() {
        if (!this.currentRoom) return null;
        
        return {
            roomId: this.currentRoom.roomId,
            name: this.currentRoom.name,
            gameMode: this.currentRoom.gameMode,
            players: this.currentRoom.players.length,
            maxPlayers: this.currentRoom.maxPlayers,
            isHost: this.isHost(),
            settings: this.currentRoom.settings
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.currentRoom = null;
        this.playerSession = null;
        this.availableRooms.clear();
        
        // Clear callbacks
        this.onRoomJoined = null;
        this.onRoomLeft = null;
        this.onRoomUpdated = null;
        this.onPlayerJoined = null;
        this.onPlayerLeft = null;
        this.onRoomListUpdated = null;
    }
}

// Export for use in multiplayer module
window.RoomManager = RoomManager;