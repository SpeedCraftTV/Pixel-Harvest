/**
 * Communication System for Pixel-Harvest Multiplayer
 * Handles chat, emoji reactions, and player communication
 */

class CommunicationSystem {
    constructor(multiplayerModule) {
        this.multiplayerModule = multiplayerModule;
        this.chatHistory = [];
        this.maxChatHistory = 100;
        this.profanityFilter = new ProfanityFilter();
        this.emojiSystem = new EmojiSystem();
        
        // Communication settings
        this.settings = {
            chatEnabled: true,
            profanityFilterEnabled: true,
            emojiEnabled: true,
            voiceChatEnabled: false,
            maxMessageLength: 200,
            rateLimitDelay: 1000 // 1 second between messages
        };
        
        this.lastMessageTime = 0;
        
        console.log('💬 Communication system initialized');
    }
    
    /**
     * Send a chat message
     */
    sendChatMessage(message, type = 'text') {
        if (!this.settings.chatEnabled) {
            throw new Error('Chat is disabled');
        }
        
        if (!this.multiplayerModule.isInRoom()) {
            throw new Error('Not in a multiplayer room');
        }
        
        // Rate limiting
        const now = Date.now();
        if (now - this.lastMessageTime < this.settings.rateLimitDelay) {
            throw new Error('Please wait before sending another message');
        }
        
        // Validate message
        const cleanMessage = this.validateAndCleanMessage(message);
        if (!cleanMessage) {
            throw new Error('Invalid message');
        }
        
        const chatMessage = {
            id: this.generateMessageId(),
            playerId: this.multiplayerModule.roomManager.getPlayerId(),
            playerName: this.multiplayerModule.roomManager.getPlayerName(),
            message: cleanMessage,
            type: type,
            timestamp: now,
            roomId: this.multiplayerModule.getCurrentRoom()?.roomId
        };
        
        // Add to local history
        this.addToHistory(chatMessage);
        
        // Send to other players
        this.multiplayerModule.eventSystem.emit('chat_message', chatMessage);
        
        this.lastMessageTime = now;
        
        return chatMessage;
    }
    
    /**
     * Send emoji reaction
     */
    sendEmojiReaction(emoji, targetPlayerId = null) {
        if (!this.settings.emojiEnabled) {
            throw new Error('Emoji reactions are disabled');
        }
        
        if (!this.multiplayerModule.isInRoom()) {
            throw new Error('Not in a multiplayer room');
        }
        
        const reaction = {
            id: this.generateMessageId(),
            playerId: this.multiplayerModule.roomManager.getPlayerId(),
            playerName: this.multiplayerModule.roomManager.getPlayerName(),
            emoji: emoji,
            targetPlayerId: targetPlayerId,
            timestamp: Date.now(),
            roomId: this.multiplayerModule.getCurrentRoom()?.roomId
        };
        
        // Send emoji reaction
        this.multiplayerModule.eventSystem.emit('emoji_reaction', reaction);
        
        // Show local visual feedback
        this.showEmojiReaction(reaction);
        
        return reaction;
    }
    
    /**
     * Handle incoming chat message
     */
    handleIncomingMessage(messageData) {
        // Validate incoming message
        if (!this.validateIncomingMessage(messageData)) {
            console.warn('Invalid incoming message:', messageData);
            return;
        }
        
        // Add to history
        this.addToHistory(messageData);
        
        // Trigger UI update
        if (this.onMessageReceived) {
            this.onMessageReceived(messageData);
        }
        
        // Show notification if needed
        this.showMessageNotification(messageData);
    }
    
    /**
     * Handle incoming emoji reaction
     */
    handleIncomingEmoji(reactionData) {
        if (!this.validateIncomingReaction(reactionData)) {
            console.warn('Invalid incoming reaction:', reactionData);
            return;
        }
        
        // Show emoji reaction visually
        this.showEmojiReaction(reactionData);
        
        // Trigger callback
        if (this.onEmojiReceived) {
            this.onEmojiReceived(reactionData);
        }
    }
    
    /**
     * Validate and clean message content
     */
    validateAndCleanMessage(message) {
        if (!message || typeof message !== 'string') {
            return null;
        }
        
        // Trim whitespace
        let cleanMessage = message.trim();
        
        // Check length
        if (cleanMessage.length === 0 || cleanMessage.length > this.settings.maxMessageLength) {
            return null;
        }
        
        // Apply profanity filter if enabled
        if (this.settings.profanityFilterEnabled) {
            cleanMessage = this.profanityFilter.filter(cleanMessage);
        }
        
        // Basic HTML escape for security
        cleanMessage = this.escapeHtml(cleanMessage);
        
        return cleanMessage;
    }
    
    /**
     * Validate incoming message
     */
    validateIncomingMessage(messageData) {
        return messageData &&
               typeof messageData.id === 'string' &&
               typeof messageData.playerId === 'string' &&
               typeof messageData.playerName === 'string' &&
               typeof messageData.message === 'string' &&
               typeof messageData.timestamp === 'number' &&
               messageData.message.length <= this.settings.maxMessageLength;
    }
    
    /**
     * Validate incoming reaction
     */
    validateIncomingReaction(reactionData) {
        return reactionData &&
               typeof reactionData.playerId === 'string' &&
               typeof reactionData.emoji === 'string' &&
               typeof reactionData.timestamp === 'number' &&
               this.emojiSystem.isValidEmoji(reactionData.emoji);
    }
    
    /**
     * Add message to chat history
     */
    addToHistory(message) {
        this.chatHistory.push(message);
        
        // Keep history within limits
        if (this.chatHistory.length > this.maxChatHistory) {
            this.chatHistory = this.chatHistory.slice(-this.maxChatHistory);
        }
    }
    
    /**
     * Get chat history
     */
    getChatHistory() {
        return [...this.chatHistory];
    }
    
    /**
     * Clear chat history
     */
    clearHistory() {
        this.chatHistory = [];
    }
    
    /**
     * Show emoji reaction visually in game
     */
    showEmojiReaction(reactionData) {
        // Get player position for visual effect
        const player = this.multiplayerModule.playerManager.getPlayer(reactionData.playerId);
        if (!player || !player.position) return;
        
        // Create floating emoji effect
        const emojiElement = document.createElement('div');
        emojiElement.className = 'floating-emoji';
        emojiElement.textContent = reactionData.emoji;
        
        // Position over player
        const position = this.worldToScreenPosition(player.position);
        emojiElement.style.cssText = `
            position: fixed;
            left: ${position.x}px;
            top: ${position.y - 60}px;
            font-size: 32px;
            z-index: 1000;
            pointer-events: none;
            animation: floatUp 2s ease-out forwards;
        `;
        
        document.body.appendChild(emojiElement);
        
        // Remove after animation
        setTimeout(() => {
            emojiElement.remove();
        }, 2000);
    }
    
    /**
     * Show message notification
     */
    showMessageNotification(messageData) {
        // Don't show notification for own messages
        if (messageData.playerId === this.multiplayerModule.roomManager.getPlayerId()) {
            return;
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'chat-notification';
        notification.innerHTML = `
            <strong>${messageData.playerName}:</strong>
            ${messageData.message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            max-width: 250px;
            font-size: 14px;
            z-index: 1500;
            animation: slideIn 0.3s ease;
            border-left: 4px solid #2196F3;
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    /**
     * Convert world position to screen position (placeholder)
     */
    worldToScreenPosition(worldPos) {
        // This would need to integrate with the game's camera and projection system
        // For now, return a default position
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    }
    
    /**
     * Generate unique message ID
     */
    generateMessageId() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * HTML escape for security
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Update communication settings
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        console.log('💬 Communication settings updated:', this.settings);
    }
    
    /**
     * Get quick chat options
     */
    getQuickChatOptions() {
        return [
            'Hello!',
            'Thanks!',
            'Good job!',
            'Need help?',
            'Let\'s work together!',
            'Great harvest!',
            'Follow me!',
            'Wait for me!',
            'Good bye!',
            'Nice farm!'
        ];
    }
    
    /**
     * Send quick chat message
     */
    sendQuickChat(optionIndex) {
        const options = this.getQuickChatOptions();
        if (optionIndex >= 0 && optionIndex < options.length) {
            return this.sendChatMessage(options[optionIndex], 'quick');
        }
        throw new Error('Invalid quick chat option');
    }
    
    /**
     * Destroy communication system
     */
    destroy() {
        this.clearHistory();
        this.onMessageReceived = null;
        this.onEmojiReceived = null;
    }
}

/**
 * Basic Profanity Filter
 */
class ProfanityFilter {
    constructor() {
        // Basic word list - in production this would be more comprehensive
        this.bannedWords = [
            // Add inappropriate words here
            'badword1', 'badword2'
        ];
        
        this.replacement = '***';
    }
    
    filter(text) {
        let filteredText = text;
        
        this.bannedWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filteredText = filteredText.replace(regex, this.replacement);
        });
        
        return filteredText;
    }
    
    containsProfanity(text) {
        return this.bannedWords.some(word => {
            const regex = new RegExp(word, 'gi');
            return regex.test(text);
        });
    }
}

/**
 * Emoji System for reactions
 */
class EmojiSystem {
    constructor() {
        this.availableEmojis = {
            happy: '😊',
            sad: '😢',
            laugh: '😂',
            angry: '😠',
            love: '❤️',
            thumbsUp: '👍',
            thumbsDown: '👎',
            clap: '👏',
            wave: '👋',
            thinking: '🤔',
            surprised: '😮',
            cool: '😎',
            plant: '🌱',
            harvest: '🌾',
            farm: '🚜',
            sun: '☀️',
            rain: '🌧️',
            heart: '💚'
        };
    }
    
    getAvailableEmojis() {
        return this.availableEmojis;
    }
    
    isValidEmoji(emoji) {
        return Object.values(this.availableEmojis).includes(emoji);
    }
    
    getEmojiByName(name) {
        return this.availableEmojis[name] || null;
    }
    
    getRandomEmoji() {
        const emojis = Object.values(this.availableEmojis);
        return emojis[Math.floor(Math.random() * emojis.length)];
    }
}

// Export for use in multiplayer module
window.CommunicationSystem = CommunicationSystem;

// Add CSS for animations
const communicationStyles = `
<style>
@keyframes floatUp {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    50% {
        opacity: 1;
        transform: translateY(-30px) scale(1.2);
    }
    100% {
        opacity: 0;
        transform: translateY(-60px) scale(0.8);
    }
}

.floating-emoji {
    animation: floatUp 2s ease-out forwards;
}

.chat-notification {
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', communicationStyles);