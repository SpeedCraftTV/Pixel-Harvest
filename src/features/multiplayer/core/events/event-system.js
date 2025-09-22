/**
 * Event System for Pixel-Harvest Multiplayer
 * Handles event routing and synchronization across players
 */

class MultiplayerEventSystem {
    constructor(webSocketManager) {
        this.wsManager = webSocketManager;
        this.eventHandlers = new Map();
        this.eventQueue = [];
        this.processedEvents = new Set();
        this.eventTimeout = 30000; // 30 seconds
        
        // Event types that require synchronization
        this.syncEventTypes = [
            'plant_seed',
            'harvest_plant',
            'water_plot',
            'unlock_plot',
            'buy_item',
            'sell_item',
            'player_move',
            'chat_message',
            'emoji_reaction'
        ];
        
        // Event conflict resolution
        this.conflictResolvers = new Map();
        this.setupDefaultResolvers();
        
        // Performance metrics
        this.eventMetrics = {
            sent: 0,
            received: 0,
            conflicts: 0,
            latency: []
        };
    }
    
    /**
     * Register event handler
     */
    on(eventType, handler) {
        if (!this.eventHandlers.has(eventType)) {
            this.eventHandlers.set(eventType, []);
        }
        this.eventHandlers.get(eventType).push(handler);
    }
    
    /**
     * Remove event handler
     */
    off(eventType, handler) {
        const handlers = this.eventHandlers.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }
    
    /**
     * Emit local event and sync to other players
     */
    emit(eventType, eventData, syncToRemote = true) {
        const event = {
            id: this.generateEventId(),
            type: eventType,
            data: eventData,
            playerId: this.getLocalPlayerId(),
            timestamp: Date.now(),
            synchronized: false
        };
        
        // Process locally first
        this.processEvent(event, true);
        
        // Send to remote players if sync is enabled
        if (syncToRemote && this.syncEventTypes.includes(eventType)) {
            this.syncEventToRemote(event);
        }
        
        return event.id;
    }
    
    /**
     * Process an event locally
     */
    processEvent(event, isLocal = false) {
        // Check if already processed (prevent duplicates)
        if (this.processedEvents.has(event.id)) {
            return;
        }
        
        this.processedEvents.add(event.id);
        
        // Check for conflicts with other events
        const conflict = this.checkForConflicts(event);
        if (conflict) {
            this.resolveConflict(event, conflict);
            return;
        }
        
        // Emit to local handlers
        const handlers = this.eventHandlers.get(event.type);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(event, isLocal);
                } catch (error) {
                    console.error(`Error in event handler for ${event.type}:`, error);
                }
            });
        }
        
        // Update metrics
        if (isLocal) {
            this.eventMetrics.sent++;
        } else {
            this.eventMetrics.received++;
        }
        
        // Clean up old processed events
        this.cleanupProcessedEvents();
    }
    
    /**
     * Sync event to remote players
     */
    syncEventToRemote(event) {
        this.wsManager.send('GAME_EVENT', {
            event: {
                ...event,
                synchronized: true
            }
        });
    }
    
    /**
     * Handle incoming remote events
     */
    handleRemoteEvent(eventData) {
        // Validate event structure
        if (!this.validateEvent(eventData.event)) {
            console.warn('Invalid event received:', eventData);
            return;
        }
        
        const event = eventData.event;
        
        // Calculate latency for metrics
        const latency = Date.now() - event.timestamp;
        this.eventMetrics.latency.push(latency);
        if (this.eventMetrics.latency.length > 100) {
            this.eventMetrics.latency = this.eventMetrics.latency.slice(-50);
        }
        
        // Process the remote event
        this.processEvent(event, false);
    }
    
    /**
     * Check for event conflicts
     */
    checkForConflicts(event) {
        // Look for conflicting events in the recent queue
        const timeWindow = 5000; // 5 second conflict window
        const recentEvents = this.eventQueue.filter(e => 
            Date.now() - e.timestamp < timeWindow &&
            e.type === event.type &&
            e.playerId !== event.playerId
        );
        
        for (const existingEvent of recentEvents) {
            if (this.eventsConflict(event, existingEvent)) {
                return existingEvent;
            }
        }
        
        return null;
    }
    
    /**
     * Check if two events conflict
     */
    eventsConflict(event1, event2) {
        // Same plot actions conflict
        if (['plant_seed', 'harvest_plant', 'water_plot'].includes(event1.type) &&
            ['plant_seed', 'harvest_plant', 'water_plot'].includes(event2.type)) {
            
            const plot1 = event1.data.plotId || event1.data.position;
            const plot2 = event2.data.plotId || event2.data.position;
            
            return this.plotsAreEqual(plot1, plot2);
        }
        
        // Resource conflicts (same item at same time)
        if (event1.type === 'buy_item' && event2.type === 'buy_item') {
            return event1.data.itemType === event2.data.itemType &&
                   Math.abs(event1.timestamp - event2.timestamp) < 1000;
        }
        
        return false;
    }
    
    /**
     * Resolve conflict between events
     */
    resolveConflict(event, conflictingEvent) {
        this.eventMetrics.conflicts++;
        
        const resolver = this.conflictResolvers.get(event.type);
        if (resolver) {
            const resolution = resolver(event, conflictingEvent);
            console.log(`🔧 Conflict resolved for ${event.type}:`, resolution);
            
            // Apply resolution
            if (resolution.winner === event) {
                this.processEvent(event, false);
            }
            // If conflicting event wins, do nothing (it's already processed)
            
        } else {
            // Default resolution: timestamp wins (earliest event)
            if (event.timestamp < conflictingEvent.timestamp) {
                this.processEvent(event, false);
            }
            
            console.log(`⚠️ Conflict resolved by timestamp for ${event.type}`);
        }
    }
    
    /**
     * Setup default conflict resolvers
     */
    setupDefaultResolvers() {
        // Plot action resolver - first action wins
        this.conflictResolvers.set('plant_seed', (event1, event2) => ({
            winner: event1.timestamp < event2.timestamp ? event1 : event2,
            reason: 'first_action_wins'
        }));
        
        this.conflictResolvers.set('harvest_plant', (event1, event2) => ({
            winner: event1.timestamp < event2.timestamp ? event1 : event2,
            reason: 'first_action_wins'
        }));
        
        // Purchase resolver - sufficient funds wins
        this.conflictResolvers.set('buy_item', (event1, event2) => {
            // This would need integration with the actual game state
            // For now, use timestamp
            return {
                winner: event1.timestamp < event2.timestamp ? event1 : event2,
                reason: 'timestamp_priority'
            };
        });
    }
    
    /**
     * Validate event structure
     */
    validateEvent(event) {
        return event &&
               typeof event.id === 'string' &&
               typeof event.type === 'string' &&
               typeof event.timestamp === 'number' &&
               event.data !== undefined;
    }
    
    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Get local player ID
     */
    getLocalPlayerId() {
        // Get from session storage or generate
        let playerId = sessionStorage.getItem('pixelHarvestPlayerId');
        if (!playerId) {
            playerId = 'player_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('pixelHarvestPlayerId', playerId);
        }
        return playerId;
    }
    
    /**
     * Check if two plots are equal
     */
    plotsAreEqual(plot1, plot2) {
        if (typeof plot1 === 'string' && typeof plot2 === 'string') {
            return plot1 === plot2;
        }
        
        if (plot1 && plot2 && typeof plot1 === 'object' && typeof plot2 === 'object') {
            return plot1.x === plot2.x && plot1.z === plot2.z;
        }
        
        return false;
    }
    
    /**
     * Clean up old processed events
     */
    cleanupProcessedEvents() {
        // Remove events older than timeout
        this.eventQueue = this.eventQueue.filter(event => 
            Date.now() - event.timestamp < this.eventTimeout
        );
        
        // Clean processed events set if it gets too large
        if (this.processedEvents.size > 1000) {
            const eventsArray = Array.from(this.processedEvents);
            this.processedEvents = new Set(eventsArray.slice(-500));
        }
    }
    
    /**
     * Handle WebSocket messages
     */
    handleWebSocketMessage(message) {
        switch (message.type) {
            case 'GAME_EVENT':
                this.handleRemoteEvent(message.data);
                break;
                
            case 'EVENT_BATCH':
                message.data.events.forEach(eventData => {
                    this.handleRemoteEvent({ event: eventData });
                });
                break;
                
            case 'EVENT_CONFLICT_RESOLUTION':
                this.handleConflictResolution(message.data);
                break;
        }
    }
    
    /**
     * Handle server-side conflict resolution
     */
    handleConflictResolution(resolutionData) {
        console.log('📡 Server conflict resolution:', resolutionData);
        
        // Remove conflicting events from processed set
        resolutionData.rejectedEvents.forEach(eventId => {
            this.processedEvents.delete(eventId);
        });
        
        // Process accepted event
        if (resolutionData.acceptedEvent) {
            this.processEvent(resolutionData.acceptedEvent, false);
        }
    }
    
    /**
     * Get event metrics
     */
    getMetrics() {
        const avgLatency = this.eventMetrics.latency.length > 0 ?
            this.eventMetrics.latency.reduce((a, b) => a + b, 0) / this.eventMetrics.latency.length : 0;
        
        return {
            sent: this.eventMetrics.sent,
            received: this.eventMetrics.received,
            conflicts: this.eventMetrics.conflicts,
            avgLatency: Math.round(avgLatency),
            queueSize: this.eventQueue.length,
            processedEventsCount: this.processedEvents.size
        };
    }
    
    /**
     * Reset metrics
     */
    resetMetrics() {
        this.eventMetrics = {
            sent: 0,
            received: 0,
            conflicts: 0,
            latency: []
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        this.eventHandlers.clear();
        this.eventQueue = [];
        this.processedEvents.clear();
        this.conflictResolvers.clear();
        this.resetMetrics();
    }
}

// Export for use in multiplayer module
window.MultiplayerEventSystem = MultiplayerEventSystem;