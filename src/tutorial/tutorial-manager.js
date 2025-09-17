/**
 * Tutorial Manager
 * Main tutorial system for Pixel-Harvest
 * Manages tutorial progression, state, and integration with game systems
 */

class TutorialManager {
    constructor() {
        this.currentStep = 0;
        this.isActive = false;
        this.tutorialSteps = [];
        this.completedSteps = new Set();
        this.tutorialData = null;
        this.ui = null;
        this.gameInterface = null;
        this.settings = {
            autoAdvance: false,
            showHints: true,
            highlightElements: true,
            pauseGameOnTutorial: false
        };
        
        // Bind methods
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.skipTutorial = this.skipTutorial.bind(this);
        this.restartTutorial = this.restartTutorial.bind(this);
    }

    /**
     * Initialize the tutorial system
     * @param {Object} gameInterface - Reference to main game functions and state
     * @param {Object} tutorialData - Tutorial step definitions
     */
    async initialize(gameInterface, tutorialData) {
        this.gameInterface = gameInterface;
        this.tutorialData = tutorialData;
        this.tutorialSteps = tutorialData.steps || [];
        
        // Initialize UI components
        this.ui = new TutorialUI(this);
        await this.ui.initialize();
        
        // Load tutorial progress from localStorage
        this.loadProgress();
        
        // Check if tutorial should start automatically
        this.checkAutoStart();
        
        console.log('Tutorial Manager initialized with', this.tutorialSteps.length, 'steps');
    }

    /**
     * Check if tutorial should start automatically for new players
     */
    checkAutoStart() {
        const hasPlayedBefore = localStorage.getItem('pixelHarvestHasPlayed');
        const tutorialCompleted = localStorage.getItem('pixelHarvestTutorialCompleted');
        
        if (!hasPlayedBefore && !tutorialCompleted) {
            // Show welcome screen and start tutorial for new players
            setTimeout(() => {
                this.showWelcomeScreen();
            }, 2000); // Give game time to load
        }
    }

    /**
     * Show welcome screen with tutorial options
     */
    showWelcomeScreen() {
        // First show language selection, then the welcome modal
        this.showLanguageSelection();
    }

    /**
     * Show language selection modal
     */
    showLanguageSelection() {
        this.ui.showLanguageSelectionModal({
            onLanguageSelected: () => {
                // After language is selected, show the welcome modal
                this.ui.showWelcomeModal({
                    onStartTutorial: () => this.startTutorial(),
                    onSkipTutorial: () => this.ui.showSkipConfirmation(),
                    onViewSettings: () => this.showTutorialSettings()
                });
            }
        });
    }

    /**
     * Start the tutorial from the beginning or from a specific step
     * @param {number} stepIndex - Optional step index to start from
     */
    startTutorial(stepIndex = 0) {
        if (this.tutorialSteps.length === 0) {
            console.warn('No tutorial steps available');
            return;
        }

        this.isActive = true;
        this.currentStep = stepIndex;
        
        // Pause game if setting is enabled
        if (this.settings.pauseGameOnTutorial && this.gameInterface.pauseGame) {
            this.gameInterface.pauseGame();
        }

        // Initialize tutorial UI
        this.ui.show();
        
        // Start first step
        this.executeCurrentStep();
        
        // Track analytics
        this.trackTutorialEvent('tutorial_started', { step: stepIndex });
        
        console.log('Tutorial started at step', stepIndex);
    }

    /**
     * Execute the current tutorial step
     */
    executeCurrentStep() {
        if (this.currentStep >= this.tutorialSteps.length) {
            this.completeTutorial();
            return;
        }

        const step = this.tutorialSteps[this.currentStep];
        
        // Update UI with current step
        this.ui.updateStep(step, this.currentStep, this.tutorialSteps.length);
        
        // Execute step-specific logic
        this.executeStepLogic(step);
        
        // Mark step as viewed
        this.completedSteps.add(this.currentStep);
        
        // Save progress
        this.saveProgress();
        
        console.log('Executing tutorial step', this.currentStep, ':', step.title);
    }

    /**
     * Execute specific logic for a tutorial step
     * @param {Object} step - Tutorial step data
     */
    executeStepLogic(step) {
        // Highlight target elements
        if (step.highlight && this.settings.highlightElements) {
            this.ui.highlightElements(step.highlight);
        }

        // Execute game actions
        if (step.gameActions) {
            step.gameActions.forEach(action => {
                this.executeGameAction(action);
            });
        }

        // Set up interaction listeners
        if (step.interactions) {
            this.setupInteractionListeners(step.interactions);
        }

        // Auto-advance if enabled and step allows it
        if (step.autoAdvance && this.settings.autoAdvance) {
            setTimeout(() => {
                this.nextStep();
            }, step.autoAdvanceDelay || 3000);
        }
    }

    /**
     * Execute a game action for tutorial purposes
     * @param {Object} action - Action definition
     */
    executeGameAction(action) {
        switch (action.type) {
            case 'highlight_ui':
                this.ui.highlightElement(action.selector, action.options);
                break;
            case 'simulate_click':
                if (action.preventActualClick) {
                    // Just show visual feedback without actually clicking
                    this.ui.simulateClick(action.selector);
                } else {
                    // Actually trigger the click
                    const element = document.querySelector(action.selector);
                    if (element) element.click();
                }
                break;
            case 'show_tooltip':
                this.ui.showTooltip(action.content, action.position, action.options);
                break;
            case 'focus_character':
                if (this.gameInterface.focusCharacter) {
                    this.gameInterface.focusCharacter();
                }
                break;
            case 'show_overlay':
                this.ui.showOverlay(action.content, action.options);
                break;
        }
    }

    /**
     * Set up interaction listeners for the current step
     * @param {Array} interactions - Array of interaction definitions
     */
    setupInteractionListeners(interactions) {
        interactions.forEach(interaction => {
            this.setupSingleInteraction(interaction);
        });
    }

    /**
     * Set up a single interaction listener
     * @param {Object} interaction - Interaction definition
     */
    setupSingleInteraction(interaction) {
        const elements = document.querySelectorAll(interaction.selector);
        
        elements.forEach(element => {
            const handler = (event) => {
                // Check if interaction conditions are met
                if (this.checkInteractionConditions(interaction.conditions)) {
                    // Execute interaction callback
                    if (interaction.callback) {
                        interaction.callback(event, element);
                    }
                    
                    // Auto-advance if specified
                    if (interaction.advanceOnComplete) {
                        this.nextStep();
                    }
                    
                    // Remove listener if it's one-time
                    if (interaction.once) {
                        element.removeEventListener(interaction.event, handler);
                    }
                }
            };
            
            element.addEventListener(interaction.event, handler);
            
            // Store handler reference for cleanup
            element._tutorialHandler = handler;
        });
    }

    /**
     * Check if interaction conditions are met
     * @param {Object} conditions - Conditions to check
     * @returns {boolean} - Whether conditions are met
     */
    checkInteractionConditions(conditions) {
        if (!conditions) return true;
        
        // Check game state conditions
        if (conditions.gameState && this.gameInterface.checkGameState) {
            return this.gameInterface.checkGameState(conditions.gameState);
        }
        
        // Check element state conditions
        if (conditions.elementState) {
            return this.checkElementState(conditions.elementState);
        }
        
        return true;
    }

    /**
     * Check element state conditions
     * @param {Object} elementState - Element state conditions
     * @returns {boolean} - Whether element state conditions are met
     */
    checkElementState(elementState) {
        const element = document.querySelector(elementState.selector);
        if (!element) return false;
        
        if (elementState.visible !== undefined) {
            const isVisible = element.offsetParent !== null;
            if (isVisible !== elementState.visible) return false;
        }
        
        if (elementState.hasClass !== undefined) {
            if (!element.classList.contains(elementState.hasClass)) return false;
        }
        
        return true;
    }

    /**
     * Advance to the next tutorial step
     */
    nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.cleanupCurrentStep();
            this.currentStep++;
            this.executeCurrentStep();
        } else {
            this.completeTutorial();
        }
    }

    /**
     * Go back to the previous tutorial step
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.cleanupCurrentStep();
            this.currentStep--;
            this.executeCurrentStep();
        }
    }

    /**
     * Skip the current step
     */
    skipStep() {
        this.nextStep();
    }

    /**
     * Skip the entire tutorial
     */
    skipTutorial() {
        this.cleanupCurrentStep();
        this.isActive = false;
        this.ui.hide();
        
        // Resume game if it was paused
        if (this.gameInterface.resumeGame) {
            this.gameInterface.resumeGame();
        }
        
        // Mark as completed
        localStorage.setItem('pixelHarvestTutorialCompleted', 'true');
        localStorage.setItem('pixelHarvestHasPlayed', 'true');
        
        this.trackTutorialEvent('tutorial_skipped', { step: this.currentStep });
        
        console.log('Tutorial skipped');
    }

    /**
     * Complete the tutorial
     */
    completeTutorial() {
        this.cleanupCurrentStep();
        this.isActive = false;
        
        // Show completion screen
        this.ui.showCompletionScreen({
            onRestart: () => this.restartTutorial(),
            onClose: () => this.ui.hide()
        });
        
        // Resume game if it was paused
        if (this.gameInterface.resumeGame) {
            this.gameInterface.resumeGame();
        }
        
        // Mark as completed
        localStorage.setItem('pixelHarvestTutorialCompleted', 'true');
        localStorage.setItem('pixelHarvestHasPlayed', 'true');
        
        // Give tutorial completion reward
        this.giveCompletionReward();
        
        this.trackTutorialEvent('tutorial_completed', { 
            totalSteps: this.tutorialSteps.length,
            completedSteps: this.completedSteps.size 
        });
        
        console.log('Tutorial completed!');
    }

    /**
     * Give reward for completing tutorial
     */
    giveCompletionReward() {
        if (this.gameInterface.giveReward) {
            this.gameInterface.giveReward({
                coins: 100,
                seeds: {
                    carrot: 10,
                    tomato: 5
                },
                experience: 50
            });
        }
    }

    /**
     * Restart the tutorial from the beginning
     */
    restartTutorial() {
        this.currentStep = 0;
        this.completedSteps.clear();
        this.startTutorial();
    }

    /**
     * Clean up the current step (remove listeners, highlights, etc.)
     */
    cleanupCurrentStep() {
        // Remove event listeners
        const elementsWithHandlers = document.querySelectorAll('[data-tutorial-handler]');
        elementsWithHandlers.forEach(element => {
            if (element._tutorialHandler) {
                element.removeEventListener('click', element._tutorialHandler);
                element.removeEventListener('change', element._tutorialHandler);
                element.removeEventListener('input', element._tutorialHandler);
                delete element._tutorialHandler;
                element.removeAttribute('data-tutorial-handler');
            }
        });
        
        // Clear highlights
        this.ui.clearHighlights();
        
        // Clear tooltips
        this.ui.clearTooltips();
    }

    /**
     * Show tutorial settings
     */
    showTutorialSettings() {
        this.ui.showSettingsModal({
            settings: this.settings,
            onSave: (newSettings) => {
                this.settings = { ...this.settings, ...newSettings };
                this.saveSettings();
            }
        });
    }

    /**
     * Get current tutorial progress
     * @returns {Object} - Progress information
     */
    getProgress() {
        return {
            currentStep: this.currentStep,
            totalSteps: this.tutorialSteps.length,
            completedSteps: Array.from(this.completedSteps),
            isActive: this.isActive,
            percentComplete: (this.completedSteps.size / this.tutorialSteps.length) * 100
        };
    }

    /**
     * Save tutorial progress to localStorage
     */
    saveProgress() {
        const progress = {
            currentStep: this.currentStep,
            completedSteps: Array.from(this.completedSteps),
            settings: this.settings
        };
        localStorage.setItem('pixelHarvestTutorialProgress', JSON.stringify(progress));
    }

    /**
     * Load tutorial progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('pixelHarvestTutorialProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.currentStep = progress.currentStep || 0;
                this.completedSteps = new Set(progress.completedSteps || []);
                this.settings = { ...this.settings, ...progress.settings };
            }
        } catch (error) {
            console.warn('Failed to load tutorial progress:', error);
        }
    }

    /**
     * Save tutorial settings to localStorage
     */
    saveSettings() {
        localStorage.setItem('pixelHarvestTutorialSettings', JSON.stringify(this.settings));
    }

    /**
     * Load tutorial settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('pixelHarvestTutorialSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.warn('Failed to load tutorial settings:', error);
        }
    }

    /**
     * Track tutorial analytics events
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackTutorialEvent(eventName, data) {
        // Only track if analytics are enabled
        if (this.gameInterface.trackEvent) {
            this.gameInterface.trackEvent(eventName, {
                tutorial_step: this.currentStep,
                tutorial_active: this.isActive,
                ...data
            });
        }
    }

    /**
     * Check if tutorial is available
     * @returns {boolean} - Whether tutorial is available
     */
    isAvailable() {
        return this.tutorialSteps.length > 0;
    }

    /**
     * Get current step data
     * @returns {Object|null} - Current step data or null
     */
    getCurrentStep() {
        if (this.currentStep < this.tutorialSteps.length) {
            return this.tutorialSteps[this.currentStep];
        }
        return null;
    }

    /**
     * Destroy the tutorial manager and clean up resources
     */
    destroy() {
        this.cleanupCurrentStep();
        if (this.ui) {
            this.ui.destroy();
        }
        this.isActive = false;
        console.log('Tutorial Manager destroyed');
    }
}

// Export for use in main game
if (typeof window !== 'undefined') {
    window.TutorialManager = TutorialManager;
}