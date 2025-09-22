/**
 * Multiplayer Integration for Pixel-Harvest
 * Integrates multiplayer functionality with the main game
 */

class MultiplayerIntegration {
    constructor() {
        this.initialized = false;
        this.gameStateHooks = new Map();
        this.syncCallbacks = new Map();
        
        console.log('🔗 Multiplayer integration created');
    }
    
    /**
     * Initialize multiplayer integration
     */
    async initialize() {
        if (this.initialized) {
            console.warn('Multiplayer integration already initialized');
            return;
        }
        
        try {
            // Wait for dependencies to load
            await this.waitForDependencies();
            
            // Initialize core multiplayer module
            await window.MultiplayerModule.initialize();
            
            // Initialize UI
            if (window.MultiplayerUI) {
                window.MultiplayerUI.initialize(window.MultiplayerModule);
            }
            
            // Setup game integration hooks
            this.setupGameHooks();
            
            // Setup multiplayer event handlers
            this.setupMultiplayerEventHandlers();
            
            // Initialize communication system
            this.initializeCommunication();
            
            this.initialized = true;
            
            console.log('✅ Multiplayer integration initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize multiplayer integration:', error);
            throw error;
        }
    }
    
    /**
     * Wait for required dependencies to load
     */
    async waitForDependencies() {
        const maxWait = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            if (window.MultiplayerModule && 
                window.WebSocketManager && 
                window.RoomManager && 
                window.PlayerManager && 
                window.MultiplayerEventSystem) {
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        throw new Error('Multiplayer dependencies not loaded');
    }
    
    /**
     * Setup game integration hooks
     */
    setupGameHooks() {
        const mp = window.MultiplayerModule;
        
        // Hook into player position updates
        mp.gameIntegration.getPlayerPosition = () => {
            if (window.character) {
                return {
                    x: window.character.x,
                    y: window.character.y,
                    z: window.character.z
                };
            }
            return null;
        };
        
        mp.gameIntegration.setPlayerPosition = (playerId, position) => {
            // Update remote player position in game world
            this.updateRemotePlayerPosition(playerId, position);
        };
        
        mp.gameIntegration.getGameState = () => {
            return {
                playerPosition: mp.gameIntegration.getPlayerPosition(),
                currentAction: window.character?.currentAction || 'idle',
                inventory: window.inventory || {},
                coins: window.coins || 0,
                plots: this.getRelevantPlotsState()
            };
        };
        
        mp.gameIntegration.updateGameState = (stateUpdate) => {
            this.applyGameStateUpdate(stateUpdate);
        };
        
        mp.gameIntegration.showNotification = (message, type) => {
            this.showGameNotification(message, type);
        };
        
        console.log('🎮 Game hooks setup complete');
    }
    
    /**
     * Setup multiplayer event handlers
     */
    setupMultiplayerEventHandlers() {
        const eventSystem = window.MultiplayerModule.eventSystem;
        
        // Handle planting events
        eventSystem.on('plant_seed', (event, isLocal) => {
            this.handlePlantSeedEvent(event, isLocal);
        });
        
        // Handle harvest events
        eventSystem.on('harvest_plant', (event, isLocal) => {
            this.handleHarvestEvent(event, isLocal);
        });
        
        // Handle watering events
        eventSystem.on('water_plot', (event, isLocal) => {
            this.handleWaterEvent(event, isLocal);
        });
        
        // Handle plot unlock events
        eventSystem.on('unlock_plot', (event, isLocal) => {
            this.handleUnlockPlotEvent(event, isLocal);
        });
        
        // Handle player movement
        eventSystem.on('player_move', (event, isLocal) => {
            this.handlePlayerMoveEvent(event, isLocal);
        });
        
        console.log('🎯 Multiplayer event handlers setup');
    }
    
    /**
     * Initialize communication system
     */
    initializeCommunication() {
        if (window.CommunicationSystem) {
            const commSystem = new window.CommunicationSystem(window.MultiplayerModule);
            window.MultiplayerModule.communicationSystem = commSystem;
            
            // Setup communication callbacks
            commSystem.onMessageReceived = (messageData) => {
                if (window.MultiplayerUI) {
                    window.MultiplayerUI.displayChatMessage(messageData);
                }
            };
            
            commSystem.onEmojiReceived = (reactionData) => {
                // Handle emoji reactions
                commSystem.showEmojiReaction(reactionData);
            };
            
            console.log('💬 Communication system initialized');
        }
    }
    
    /**
     * Override game functions to add multiplayer sync
     */
    setupGameFunctionOverrides() {
        // Store original functions
        const originalPlantSeed = window.plantSeed;
        const originalHarvestPlant = window.harvestPlant;
        const originalWaterPlot = window.waterPlot;
        const originalPerformCharacterAction = window.performCharacterAction;
        
        // Override plant seed function
        if (originalPlantSeed) {
            window.plantSeed = (plot, plantType) => {
                const result = originalPlantSeed.call(this, plot, plantType);
                
                // Sync to multiplayer if in room
                if (window.MultiplayerModule.isInRoom()) {
                    window.MultiplayerModule.syncPlayerAction('plant_seed', {
                        plotId: this.getPlotId(plot),
                        plantType: plantType,
                        position: { x: plot.x, z: plot.z }
                    });
                }
                
                return result;
            };
        }
        
        // Override harvest function
        if (originalHarvestPlant) {
            window.harvestPlant = (plot) => {
                const result = originalHarvestPlant.call(this, plot);
                
                // Sync to multiplayer if in room
                if (window.MultiplayerModule.isInRoom()) {
                    window.MultiplayerModule.syncPlayerAction('harvest_plant', {
                        plotId: this.getPlotId(plot),
                        position: { x: plot.x, z: plot.z },
                        plantType: plot.plantType
                    });
                }
                
                return result;
            };
        }
        
        // Override water function
        if (originalWaterPlot) {
            window.waterPlot = (plot) => {
                const result = originalWaterPlot.call(this, plot);
                
                // Sync to multiplayer if in room
                if (window.MultiplayerModule.isInRoom()) {
                    window.MultiplayerModule.syncPlayerAction('water_plot', {
                        plotId: this.getPlotId(plot),
                        position: { x: plot.x, z: plot.z }
                    });
                }
                
                return result;
            };
        }
        
        console.log('🔧 Game function overrides applied');
    }
    
    /**
     * Handle plant seed event from multiplayer
     */
    handlePlantSeedEvent(event, isLocal) {
        if (isLocal) return; // Already handled locally
        
        const { plotId, plantType, position } = event.data;
        const plot = this.findPlotByPosition(position);
        
        if (plot && plot.stage === window.PLANT_STAGES?.EMPTY && plot.unlocked) {
            // Apply the planting action
            plot.plantType = plantType;
            plot.stage = window.PLANT_STAGES?.GROWING;
            plot.plantedTime = Date.now();
            plot.wateredTime = Date.now();
            
            // Visual feedback
            this.showRemoteActionFeedback(position, '🌱', event.playerId);
            
            console.log(`🌱 Remote player planted ${plantType} at`, position);
        }
    }
    
    /**
     * Handle harvest event from multiplayer
     */
    handleHarvestEvent(event, isLocal) {
        if (isLocal) return; // Already handled locally
        
        const { plotId, position, plantType } = event.data;
        const plot = this.findPlotByPosition(position);
        
        if (plot && plot.stage === window.PLANT_STAGES?.MATURE) {
            // Apply the harvest action
            plot.stage = window.PLANT_STAGES?.EMPTY;
            plot.plantType = null;
            plot.plantedTime = 0;
            plot.wateredTime = 0;
            
            // Visual feedback
            this.showRemoteActionFeedback(position, '✨', event.playerId);
            
            console.log(`🌾 Remote player harvested ${plantType} at`, position);
        }
    }
    
    /**
     * Handle water event from multiplayer
     */
    handleWaterEvent(event, isLocal) {
        if (isLocal) return; // Already handled locally
        
        const { plotId, position } = event.data;
        const plot = this.findPlotByPosition(position);
        
        if (plot && plot.stage !== window.PLANT_STAGES?.EMPTY) {
            // Apply watering
            plot.wateredTime = Date.now();
            plot.growthRate = Math.min(plot.growthRate * 1.5, 3.0);
            
            // Visual feedback
            this.showRemoteActionFeedback(position, '💧', event.playerId);
            
            console.log(`💧 Remote player watered plot at`, position);
        }
    }
    
    /**
     * Handle unlock plot event from multiplayer
     */
    handleUnlockPlotEvent(event, isLocal) {
        if (isLocal) return; // Already handled locally
        
        const { plotId, position } = event.data;
        const plot = this.findPlotByPosition(position);
        
        if (plot && !plot.unlocked) {
            plot.unlocked = true;
            
            // Visual feedback
            this.showRemoteActionFeedback(position, '🔓', event.playerId);
            
            console.log(`🔓 Remote player unlocked plot at`, position);
        }
    }
    
    /**
     * Handle player movement from multiplayer
     */
    handlePlayerMoveEvent(event, isLocal) {
        if (isLocal) return; // Don't handle our own movement
        
        const { playerId, position, rotation } = event.data;
        this.updateRemotePlayerPosition(playerId, position, rotation);
    }
    
    /**
     * Update remote player position in game world
     */
    updateRemotePlayerPosition(playerId, position, rotation) {
        // This would integrate with the game's player rendering system
        // For now, just log the update
        console.log(`👤 Player ${playerId} moved to:`, position);
        
        // TODO: Integrate with actual player rendering system
        // This would involve:
        // 1. Creating/updating visual representation of remote players
        // 2. Smooth interpolation between positions
        // 3. Showing player names and status
    }
    
    /**
     * Show visual feedback for remote player actions
     */
    showRemoteActionFeedback(position, emoji, playerId) {
        // Create visual effect at world position
        const screenPos = this.worldToScreenPosition(position);
        
        const effect = document.createElement('div');
        effect.className = 'remote-action-effect';
        effect.innerHTML = `
            <div class="action-emoji">${emoji}</div>
            <div class="player-name">${this.getPlayerName(playerId)}</div>
        `;
        
        effect.style.cssText = `
            position: fixed;
            left: ${screenPos.x}px;
            top: ${screenPos.y}px;
            transform: translate(-50%, -50%);
            z-index: 1000;
            pointer-events: none;
            text-align: center;
            animation: remoteActionFeedback 2s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 2000);
    }
    
    /**
     * Update multiplayer player position when local player moves
     */
    updatePlayerPosition() {
        if (!window.MultiplayerModule.isInRoom() || !window.character) {
            return;
        }
        
        const position = {
            x: window.character.x,
            y: window.character.y,
            z: window.character.z
        };
        
        window.MultiplayerModule.updatePlayerState({
            position: position,
            rotation: window.character.rotation || 0,
            currentAction: window.character.currentAction || 'idle'
        });
    }
    
    /**
     * Sync player action when local player performs action
     */
    syncPlayerAction(actionType, actionData) {
        if (window.MultiplayerModule.isInRoom()) {
            window.MultiplayerModule.syncPlayerAction(actionType, actionData);
        }
    }
    
    /**
     * Utility functions
     */
    getPlotId(plot) {
        return `plot_${plot.x}_${plot.z}`;
    }
    
    findPlotByPosition(position) {
        if (!window.plots) return null;
        
        return window.plots.find(plot => 
            Math.abs(plot.x - position.x) < 0.1 && 
            Math.abs(plot.z - position.z) < 0.1
        );
    }
    
    getRelevantPlotsState() {
        if (!window.plots) return {};
        
        const plotsState = {};
        window.plots.forEach(plot => {
            plotsState[this.getPlotId(plot)] = {
                x: plot.x,
                z: plot.z,
                stage: plot.stage,
                plantType: plot.plantType,
                unlocked: plot.unlocked,
                plantedTime: plot.plantedTime,
                wateredTime: plot.wateredTime
            };
        });
        
        return plotsState;
    }
    
    applyGameStateUpdate(stateUpdate) {
        // Apply state updates from server
        if (stateUpdate.plots) {
            this.applyPlotsUpdate(stateUpdate.plots);
        }
        
        if (stateUpdate.players) {
            this.applyPlayersUpdate(stateUpdate.players);
        }
    }
    
    applyPlotsUpdate(plotsUpdate) {
        Object.keys(plotsUpdate).forEach(plotId => {
            const plotState = plotsUpdate[plotId];
            const plot = this.findPlotByPosition({ x: plotState.x, z: plotState.z });
            
            if (plot) {
                Object.assign(plot, plotState);
            }
        });
    }
    
    applyPlayersUpdate(playersUpdate) {
        playersUpdate.forEach(playerState => {
            if (playerState.playerId !== window.MultiplayerModule.roomManager?.getPlayerId()) {
                this.updateRemotePlayerPosition(playerState.playerId, playerState.position);
            }
        });
    }
    
    worldToScreenPosition(worldPos) {
        // This would use the game's actual camera projection
        // For now, return a placeholder position
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    }
    
    getPlayerName(playerId) {
        const player = window.MultiplayerModule.playerManager?.getPlayer(playerId);
        return player ? player.name : 'Unknown Player';
    }
    
    showGameNotification(message, type = 'info') {
        // This would integrate with the game's notification system
        console.log(`📢 [${type.toUpperCase()}] ${message}`);
        
        // Create a simple notification for now
        const notification = document.createElement('div');
        notification.className = `game-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 1500;
            animation: slideDown 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#f44336';
            case 'warning': return '#FF9800';
            default: return '#2196F3';
        }
    }
    
    /**
     * Enable/disable multiplayer features based on feature flag
     */
    setEnabled(enabled) {
        if (window.MultiplayerUI) {
            window.MultiplayerUI.setEnabled(enabled);
        }
        
        if (enabled && !this.initialized) {
            this.initialize().catch(error => {
                console.error('Failed to initialize multiplayer:', error);
            });
        }
    }
    
    /**
     * Get multiplayer status
     */
    getStatus() {
        return window.MultiplayerModule ? window.MultiplayerModule.getStatus() : {
            initialized: false,
            enabled: false,
            state: 'OFFLINE'
        };
    }
    
    /**
     * Destroy integration
     */
    destroy() {
        if (window.MultiplayerModule) {
            window.MultiplayerModule.destroy();
        }
        
        if (window.MultiplayerUI) {
            window.MultiplayerUI.destroy();
        }
        
        this.initialized = false;
        console.log('🗑️ Multiplayer integration destroyed');
    }
}

// Create global instance
window.MultiplayerIntegration = new MultiplayerIntegration();

// Auto-initialize if enabled in features
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/features.json');
        const data = await response.json();
        
        if (data.features.multiplayer.enabled) {
            console.log('🚀 Auto-initializing multiplayer integration');
            window.MultiplayerIntegration.setEnabled(true);
        }
    } catch (error) {
        console.error('Failed to check multiplayer feature flag:', error);
    }
});

// Add CSS for effects
const integrationStyles = `
<style>
@keyframes remoteActionFeedback {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -70%) scale(1.2);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -90%) scale(0.8);
    }
}

@keyframes slideDown {
    from {
        transform: translateX(-50%) translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

.remote-action-effect .action-emoji {
    font-size: 24px;
    margin-bottom: 4px;
}

.remote-action-effect .player-name {
    font-size: 12px;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
}

.game-notification {
    animation: slideDown 0.3s ease;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', integrationStyles);