/**
 * Tutorial UI Components
 * Handles all visual aspects of the tutorial system
 */

class TutorialUI {
    constructor(tutorialManager) {
        this.manager = tutorialManager;
        this.container = null;
        this.overlay = null;
        this.highlights = [];
        this.tooltips = [];
        this.modal = null;
        this.isVisible = false;
        
        // Animation settings
        this.animationDuration = 300;
        this.highlightPulseInterval = null;
    }

    /**
     * Initialize the tutorial UI system
     */
    async initialize() {
        this.createTutorialContainer();
        this.createTutorialStyles();
        this.setupEventListeners();
        console.log('Tutorial UI initialized');
    }

    /**
     * Create the main tutorial container
     */
    createTutorialContainer() {
        // Remove existing container if present
        const existing = document.getElementById('tutorialContainer');
        if (existing) {
            existing.remove();
        }

        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'tutorialContainer';
        this.container.className = 'tutorial-container';
        this.container.innerHTML = `
            <div class="tutorial-overlay" id="tutorialOverlay"></div>
            <div class="tutorial-content" id="tutorialContent">
                <div class="tutorial-header">
                    <div class="tutorial-progress">
                        <div class="tutorial-progress-bar">
                            <div class="tutorial-progress-fill" id="tutorialProgressFill"></div>
                        </div>
                        <div class="tutorial-progress-text" id="tutorialProgressText">Step 1 of 10</div>
                    </div>
                    <div class="tutorial-controls">
                        <button class="tutorial-btn tutorial-btn-icon" id="tutorialSettingsBtn" title="Tutorial Settings">
                            ⚙️
                        </button>
                        <button class="tutorial-btn tutorial-btn-icon" id="tutorialCloseBtn" title="Skip Tutorial">
                            ❌
                        </button>
                    </div>
                </div>
                <div class="tutorial-body">
                    <div class="tutorial-step-content" id="tutorialStepContent">
                        <div class="tutorial-icon" id="tutorialIcon">🎮</div>
                        <h3 class="tutorial-title" id="tutorialTitle">Welcome to Pixel-Harvest!</h3>
                        <div class="tutorial-description" id="tutorialDescription">
                            Learn how to grow crops and build your farm in this interactive tutorial.
                        </div>
                        <div class="tutorial-hints" id="tutorialHints"></div>
                    </div>
                </div>
                <div class="tutorial-footer">
                    <div class="tutorial-navigation">
                        <button class="tutorial-btn tutorial-btn-secondary" id="tutorialPrevBtn">
                            ← Previous
                        </button>
                        <button class="tutorial-btn tutorial-btn-secondary" id="tutorialSkipBtn">
                            Skip Step
                        </button>
                        <button class="tutorial-btn tutorial-btn-primary" id="tutorialNextBtn">
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
        this.overlay = document.getElementById('tutorialOverlay');
    }

    /**
     * Create CSS styles for the tutorial system
     */
    createTutorialStyles() {
        const styleId = 'tutorialStyles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .tutorial-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                pointer-events: none;
                font-family: 'Arial', sans-serif;
                display: none;
            }

            .tutorial-container.active {
                display: block;
                animation: tutorialFadeIn 0.3s ease-out;
            }

            .tutorial-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                pointer-events: all;
            }

            .tutorial-content {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                max-width: 600px;
                background: linear-gradient(135deg, #2c3e50, #34495e);
                border: 3px solid #4CAF50;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                pointer-events: all;
                color: white;
                overflow: hidden;
            }

            .tutorial-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border-bottom: 2px solid rgba(255, 255, 255, 0.2);
            }

            .tutorial-progress {
                flex: 1;
                margin-right: 15px;
            }

            .tutorial-progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }

            .tutorial-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #FFD700, #FFA500);
                border-radius: 4px;
                transition: width 0.3s ease;
                width: 10%;
            }

            .tutorial-progress-text {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.9);
                text-align: center;
            }

            .tutorial-controls {
                display: flex;
                gap: 10px;
            }

            .tutorial-btn {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .tutorial-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                border-color: rgba(255, 255, 255, 0.5);
                transform: translateY(-2px);
            }

            .tutorial-btn:active {
                transform: translateY(0);
            }

            .tutorial-btn-icon {
                padding: 8px;
                font-size: 16px;
            }

            .tutorial-btn-primary {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                border-color: #4CAF50;
            }

            .tutorial-btn-primary:hover {
                background: linear-gradient(135deg, #45a049, #3d8b40);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            }

            .tutorial-btn-secondary {
                background: linear-gradient(135deg, #607D8B, #546E7A);
                border-color: #607D8B;
            }

            .tutorial-btn-secondary:hover {
                background: linear-gradient(135deg, #546E7A, #455A64);
            }

            .tutorial-body {
                padding: 25px;
                max-height: 300px;
                overflow-y: auto;
            }

            .tutorial-step-content {
                text-align: center;
            }

            .tutorial-icon {
                font-size: 48px;
                margin-bottom: 15px;
                animation: tutorialIconFloat 2s ease-in-out infinite;
            }

            .tutorial-title {
                font-size: 24px;
                color: #4CAF50;
                margin: 0 0 15px 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }

            .tutorial-description {
                font-size: 16px;
                line-height: 1.6;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 20px;
            }

            .tutorial-hints {
                background: rgba(255, 193, 7, 0.1);
                border: 2px solid rgba(255, 193, 7, 0.3);
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                display: none;
            }

            .tutorial-hints.visible {
                display: block;
                animation: tutorialSlideIn 0.3s ease-out;
            }

            .tutorial-hints-title {
                font-size: 14px;
                font-weight: bold;
                color: #FFC107;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .tutorial-hints-content {
                font-size: 13px;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.4;
            }

            .tutorial-footer {
                padding: 15px 20px;
                background: rgba(255, 255, 255, 0.1);
                border-top: 1px solid rgba(255, 255, 255, 0.2);
            }

            .tutorial-navigation {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
            }

            /* Highlight System */
            .tutorial-highlight {
                position: absolute;
                border: 3px solid #4CAF50;
                border-radius: 8px;
                background: rgba(76, 175, 80, 0.1);
                pointer-events: none;
                z-index: 9999;
                box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
                animation: tutorialHighlightPulse 2s ease-in-out infinite;
            }

            .tutorial-highlight-pointer {
                position: absolute;
                width: 30px;
                height: 30px;
                background: #4CAF50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                z-index: 10000;
                animation: tutorialPointerBounce 1s ease-in-out infinite;
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
            }

            /* Tooltip System */
            .tutorial-tooltip {
                position: absolute;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                border: 2px solid #4CAF50;
                font-size: 14px;
                max-width: 250px;
                z-index: 10001;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                animation: tutorialTooltipSlide 0.3s ease-out;
            }

            .tutorial-tooltip::before {
                content: '';
                position: absolute;
                width: 0;
                height: 0;
                border: 8px solid transparent;
                border-top-color: #4CAF50;
                bottom: -16px;
                left: 50%;
                transform: translateX(-50%);
            }

            .tutorial-tooltip.top::before {
                border-top-color: transparent;
                border-bottom-color: #4CAF50;
                top: -16px;
                bottom: auto;
            }

            /* Modal System */
            .tutorial-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                animation: tutorialFadeIn 0.3s ease-out;
            }

            .tutorial-modal-content {
                background: linear-gradient(135deg, #2c3e50, #34495e);
                border: 3px solid #4CAF50;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                color: white;
                text-align: center;
                position: relative;
                animation: tutorialModalSlide 0.3s ease-out;
            }

            .tutorial-modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }

            .tutorial-modal-close:hover {
                opacity: 1;
            }

            .tutorial-modal-title {
                font-size: 28px;
                color: #4CAF50;
                margin-bottom: 20px;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            }

            .tutorial-modal-description {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
                color: rgba(255, 255, 255, 0.9);
            }

            .tutorial-modal-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            /* Animations */
            @keyframes tutorialFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes tutorialSlideIn {
                from { 
                    opacity: 0; 
                    transform: translateY(-10px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }

            @keyframes tutorialModalSlide {
                from { 
                    opacity: 0; 
                    transform: scale(0.9) translateY(-20px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }

            @keyframes tutorialIconFloat {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }

            @keyframes tutorialHighlightPulse {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
                    transform: scale(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(76, 175, 80, 0.8);
                    transform: scale(1.02);
                }
            }

            @keyframes tutorialPointerBounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }

            @keyframes tutorialTooltipSlide {
                from { 
                    opacity: 0; 
                    transform: translateY(10px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .tutorial-content {
                    bottom: 10px;
                    width: 95%;
                    max-width: none;
                }

                .tutorial-header {
                    padding: 12px 15px;
                }

                .tutorial-body {
                    padding: 20px 15px;
                    max-height: 250px;
                }

                .tutorial-title {
                    font-size: 20px;
                }

                .tutorial-description {
                    font-size: 14px;
                }

                .tutorial-navigation {
                    flex-direction: column;
                    gap: 8px;
                }

                .tutorial-btn {
                    width: 100%;
                    justify-content: center;
                }

                .tutorial-modal-content {
                    padding: 20px;
                    margin: 20px;
                }

                .tutorial-tooltip {
                    max-width: 200px;
                    font-size: 12px;
                }
            }

            /* Accessibility */
            @media (prefers-reduced-motion: reduce) {
                .tutorial-container,
                .tutorial-highlight,
                .tutorial-tooltip,
                .tutorial-modal,
                .tutorial-icon {
                    animation: none !important;
                }
            }

            /* Focus indicators for keyboard navigation */
            .tutorial-btn:focus {
                outline: 3px solid #FFD700;
                outline-offset: 2px;
            }

            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .tutorial-content {
                    border-width: 4px;
                    background: #000;
                }
                
                .tutorial-btn {
                    border-width: 3px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    /**
     * Set up event listeners for tutorial UI
     */
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('tutorialNextBtn').addEventListener('click', () => {
            this.manager.nextStep();
        });

        document.getElementById('tutorialPrevBtn').addEventListener('click', () => {
            this.manager.previousStep();
        });

        document.getElementById('tutorialSkipBtn').addEventListener('click', () => {
            this.manager.skipStep();
        });

        document.getElementById('tutorialCloseBtn').addEventListener('click', () => {
            this.showSkipConfirmation();
        });

        document.getElementById('tutorialSettingsBtn').addEventListener('click', () => {
            this.manager.showTutorialSettings();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isVisible) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'Enter':
                    e.preventDefault();
                    this.manager.nextStep();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.manager.previousStep();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.showSkipConfirmation();
                    break;
            }
        });

        // Overlay click to close
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.showSkipConfirmation();
            }
        });
    }

    /**
     * Show the tutorial UI
     */
    show() {
        this.container.classList.add('active');
        this.isVisible = true;
        
        // Focus management for accessibility
        const firstButton = this.container.querySelector('.tutorial-btn');
        if (firstButton) {
            firstButton.focus();
        }
    }

    /**
     * Hide the tutorial UI
     */
    hide() {
        this.container.classList.remove('active');
        this.isVisible = false;
        this.clearHighlights();
        this.clearTooltips();
        this.closeModal();
    }

    /**
     * Update the tutorial step display
     * @param {Object} step - Tutorial step data
     * @param {number} currentIndex - Current step index
     * @param {number} totalSteps - Total number of steps
     */
    updateStep(step, currentIndex, totalSteps) {
        // Update progress
        const progressFill = document.getElementById('tutorialProgressFill');
        const progressText = document.getElementById('tutorialProgressText');
        const progressPercent = ((currentIndex + 1) / totalSteps) * 100;
        
        progressFill.style.width = `${progressPercent}%`;
        progressText.textContent = `Step ${currentIndex + 1} of ${totalSteps}`;

        // Update content
        document.getElementById('tutorialIcon').textContent = step.icon || '🎮';
        document.getElementById('tutorialTitle').textContent = step.title || 'Tutorial Step';
        document.getElementById('tutorialDescription').innerHTML = step.description || '';

        // Update hints
        const hintsContainer = document.getElementById('tutorialHints');
        if (step.hints && step.hints.length > 0) {
            hintsContainer.innerHTML = `
                <div class="tutorial-hints-title">
                    💡 Hints
                </div>
                <div class="tutorial-hints-content">
                    ${step.hints.map(hint => `• ${hint}`).join('<br>')}
                </div>
            `;
            hintsContainer.classList.add('visible');
        } else {
            hintsContainer.classList.remove('visible');
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('tutorialPrevBtn');
        const nextBtn = document.getElementById('tutorialNextBtn');
        
        prevBtn.disabled = currentIndex === 0;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        
        if (currentIndex === totalSteps - 1) {
            nextBtn.textContent = 'Complete Tutorial';
            nextBtn.classList.add('tutorial-btn-primary');
        } else {
            nextBtn.textContent = 'Next →';
        }

        // Animate content update
        const content = document.getElementById('tutorialStepContent');
        content.style.animation = 'tutorialSlideIn 0.3s ease-out';
    }

    /**
     * Highlight elements on the page
     * @param {Array|string} selectors - CSS selectors to highlight
     */
    highlightElements(selectors) {
        this.clearHighlights();
        
        const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
        
        selectorArray.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.highlightElement(element, { delay: index * 200 });
            });
        });
    }

    /**
     * Highlight a single element
     * @param {Element|string} element - Element or selector to highlight
     * @param {Object} options - Highlight options
     */
    highlightElement(element, options = {}) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        setTimeout(() => {
            const rect = target.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            // Create highlight overlay
            const highlight = document.createElement('div');
            highlight.className = 'tutorial-highlight';
            highlight.style.top = `${rect.top + scrollTop - 10}px`;
            highlight.style.left = `${rect.left + scrollLeft - 10}px`;
            highlight.style.width = `${rect.width + 20}px`;
            highlight.style.height = `${rect.height + 20}px`;

            // Create pointer if specified
            if (options.showPointer !== false) {
                const pointer = document.createElement('div');
                pointer.className = 'tutorial-highlight-pointer';
                pointer.innerHTML = options.pointerIcon || '👆';
                pointer.style.top = `${rect.top + scrollTop - 40}px`;
                pointer.style.left = `${rect.left + scrollLeft + rect.width / 2 - 15}px`;
                
                document.body.appendChild(pointer);
                this.highlights.push(pointer);
            }

            document.body.appendChild(highlight);
            this.highlights.push(highlight);

            // Scroll element into view if needed
            if (options.scrollIntoView !== false) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center',
                    inline: 'center' 
                });
            }
        }, options.delay || 0);
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.highlights.forEach(highlight => {
            if (highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
        });
        this.highlights = [];
    }

    /**
     * Show a tooltip
     * @param {string} content - Tooltip content
     * @param {Object} position - Position configuration
     * @param {Object} options - Tooltip options
     */
    showTooltip(content, position, options = {}) {
        const tooltip = document.createElement('div');
        tooltip.className = `tutorial-tooltip ${position.placement || 'bottom'}`;
        tooltip.innerHTML = content;

        // Position tooltip
        if (position.target) {
            const target = typeof position.target === 'string' 
                ? document.querySelector(position.target) 
                : position.target;
            
            if (target) {
                const rect = target.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

                tooltip.style.top = `${rect.bottom + scrollTop + 10}px`;
                tooltip.style.left = `${rect.left + scrollLeft + rect.width / 2}px`;
                tooltip.style.transform = 'translateX(-50%)';
            }
        } else {
            tooltip.style.top = `${position.y || 0}px`;
            tooltip.style.left = `${position.x || 0}px`;
        }

        document.body.appendChild(tooltip);
        this.tooltips.push(tooltip);

        // Auto-remove after duration
        if (options.duration) {
            setTimeout(() => this.removeTooltip(tooltip), options.duration);
        }

        return tooltip;
    }

    /**
     * Remove a specific tooltip
     * @param {Element} tooltip - Tooltip element to remove
     */
    removeTooltip(tooltip) {
        const index = this.tooltips.indexOf(tooltip);
        if (index > -1) {
            this.tooltips.splice(index, 1);
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }
    }

    /**
     * Clear all tooltips
     */
    clearTooltips() {
        this.tooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
        this.tooltips = [];
    }

    /**
     * Simulate a click visual effect
     * @param {string} selector - Element selector
     */
    simulateClick(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        // Add visual feedback
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            element.style.transform = '';
            setTimeout(() => {
                element.style.transition = '';
            }, 100);
        }, 100);
    }

    /**
     * Show overlay content
     * @param {string} content - HTML content to show
     * @param {Object} options - Display options
     */
    showOverlay(content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-overlay-content';
        overlay.innerHTML = content;
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #4CAF50;
            z-index: 10001;
            max-width: 400px;
            text-align: center;
        `;

        document.body.appendChild(overlay);
        
        // Auto-remove after duration
        if (options.duration) {
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, options.duration);
        }

        return overlay;
    }

    /**
     * Show language selection modal
     * @param {Object} callbacks - Callback functions
     */
    showLanguageSelectionModal(callbacks) {
        // Get available languages from i18n system or fallback
        const languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'it', name: 'Italiano', flag: '🇮🇹' },
            { code: 'pt', name: 'Português', flag: '🇵🇹' }
        ];

        // Get current language
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage()?.code || 'en' : 'en';
        
        // Create language selection content
        const languageButtons = languages.map(lang => `
            <button class="tutorial-language-btn ${lang.code === currentLang ? 'selected' : ''}" 
                    data-lang="${lang.code}"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        width: 100%;
                        margin: 5px 0;
                        padding: 12px 20px;
                        background: ${lang.code === currentLang ? '#4CAF50' : 'rgba(255,255,255,0.1)'};
                        border: 2px solid ${lang.code === currentLang ? '#4CAF50' : 'rgba(255,255,255,0.2)'};
                        border-radius: 8px;
                        color: white;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                <span style="font-size: 24px;">${lang.flag}</span>
                <span style="flex: 1; text-align: left;">${lang.name}</span>
                ${lang.code === currentLang ? '<span style="color: #FFD700;">✓</span>' : ''}
            </button>
        `).join('');

        const modal = this.createModal({
            title: window.i18n ? window.i18n.t('tutorial.welcome.languageSelection.title') : '🌍 Choose Your Language',
            icon: '🌍',
            content: `
                <p style="margin-bottom: 20px; text-align: center;">
                    ${window.i18n ? window.i18n.t('tutorial.welcome.languageSelection.subtitle') : 'Select your preferred language for the game and tutorial:'}
                </p>
                <div style="max-width: 300px; margin: 0 auto;">
                    ${languageButtons}
                </div>
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); text-align: center;">
                    <small style="color: rgba(255,255,255,0.7);">
                        ${window.i18n ? window.i18n.t('tutorial.welcome.languageSelection.continue') : 'Continue with'} 
                        <span id="selectedLanguageName" style="color: #4CAF50; font-weight: bold;">
                            ${languages.find(l => l.code === currentLang)?.name || 'English'}
                        </span>
                    </small>
                </div>
            `,
            buttons: [
                {
                    text: '✅ Continue',
                    className: 'tutorial-btn-primary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onLanguageSelected();
                    }
                }
            ]
        });

        // Add language selection functionality
        modal.querySelectorAll('.tutorial-language-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const langCode = btn.dataset.lang;
                const langName = languages.find(l => l.code === langCode)?.name;
                
                // Remove selection from all buttons
                modal.querySelectorAll('.tutorial-language-btn').forEach(b => {
                    b.classList.remove('selected');
                    b.style.background = 'rgba(255,255,255,0.1)';
                    b.style.borderColor = 'rgba(255,255,255,0.2)';
                    b.querySelector('span:last-child')?.remove();
                });
                
                // Add selection to clicked button
                btn.classList.add('selected');
                btn.style.background = '#4CAF50';
                btn.style.borderColor = '#4CAF50';
                btn.innerHTML += '<span style="color: #FFD700;">✓</span>';
                
                // Update selected language display
                const selectedNameSpan = modal.querySelector('#selectedLanguageName');
                if (selectedNameSpan) {
                    selectedNameSpan.textContent = langName;
                }
                
                // Change language in the system
                if (window.i18n && window.i18n.setLanguage) {
                    try {
                        await window.i18n.setLanguage(langCode);
                        console.log(`Language changed to: ${langCode}`);
                    } catch (error) {
                        console.error('Failed to change language:', error);
                    }
                }
                
                // Update tutorial localization
                if (window.TutorialLocalization && window.TutorialLocalization.setLanguage) {
                    window.TutorialLocalization.setLanguage(langCode);
                }
                
                // Update modal content with new language
                setTimeout(() => {
                    const title = modal.querySelector('.tutorial-modal-title');
                    const subtitle = modal.querySelector('p');
                    const continueText = modal.querySelector('#selectedLanguageName').parentNode;
                    
                    if (title && window.i18n) {
                        title.textContent = window.i18n.t('tutorial.welcome.languageSelection.title');
                    }
                    if (subtitle && window.i18n) {
                        subtitle.textContent = window.i18n.t('tutorial.welcome.languageSelection.subtitle');
                    }
                    if (continueText && window.i18n) {
                        continueText.innerHTML = `
                            ${window.i18n.t('tutorial.welcome.languageSelection.continue')} 
                            <span id="selectedLanguageName" style="color: #4CAF50; font-weight: bold;">
                                ${langName}
                            </span>
                        `;
                    }
                }, 100);
            });
        });

        return modal;
    }

    /**
     * Show welcome modal
     * @param {Object} callbacks - Callback functions
     */
    showWelcomeModal(callbacks) {
        // Get translations - fallback to English if i18n not available
        const t = (key, fallback) => window.i18n ? window.i18n.t(key) : fallback;
        
        const modal = this.createModal({
            title: t('tutorial.welcome.title', '🌱 Welcome to Pixel-Harvest!'),
            icon: '🎮',
            content: `
                <p>${t('tutorial.welcome.description', 'Ready to start your farming adventure? This interactive tutorial will teach you everything you need to know!')}</p>
                <p>${t('tutorial.welcome.learnAbout', "You'll learn how to:")}</p>
                <ul style="text-align: left; margin: 15px 0;">
                    <li>🌱 ${t('tutorial.welcome.features.0', 'Plant and harvest crops')}</li>
                    <li>💧 ${t('tutorial.welcome.features.1', 'Water your plants')}</li>
                    <li>🐄 ${t('tutorial.welcome.features.2', 'Manage farm animals')}</li>
                    <li>💰 ${t('tutorial.welcome.features.3', 'Buy and sell in the marketplace')}</li>
                    <li>🎯 ${t('tutorial.welcome.features.4', 'Complete quests and objectives')}</li>
                </ul>
            `,
            buttons: [
                {
                    text: t('tutorial.welcome.startTutorial', '🚀 Start Tutorial'),
                    className: 'tutorial-btn-primary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onStartTutorial();
                    }
                },
                {
                    text: t('tutorial.welcome.settings', '⚙️ Settings'),
                    className: 'tutorial-btn-secondary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onViewSettings();
                    }
                },
                {
                    text: t('tutorial.welcome.skipTutorial', '⏭️ Skip Tutorial'),
                    className: 'tutorial-btn-secondary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onSkipTutorial();
                    }
                }
            ]
        });

        return modal;
    }

    /**
     * Show tutorial completion screen
     * @param {Object} callbacks - Callback functions
     */
    showCompletionScreen(callbacks) {
        const modal = this.createModal({
            title: '🎉 Tutorial Complete!',
            icon: '🏆',
            content: `
                <p>Congratulations! You've completed the Pixel-Harvest tutorial!</p>
                <p>You've earned:</p>
                <div style="background: rgba(255, 193, 7, 0.1); padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <div style="font-size: 18px; margin-bottom: 10px;">🎁 Tutorial Rewards:</div>
                    <div>💰 100 Coins</div>
                    <div>🥕 10 Carrot Seeds</div>
                    <div>🍅 5 Tomato Seeds</div>
                    <div>⭐ 50 Experience Points</div>
                </div>
                <p>Now you're ready to build your farming empire! Good luck!</p>
            `,
            buttons: [
                {
                    text: '🌟 Start Playing!',
                    className: 'tutorial-btn-primary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onClose();
                    }
                },
                {
                    text: '🔄 Restart Tutorial',
                    className: 'tutorial-btn-secondary',
                    onClick: () => {
                        this.closeModal();
                        callbacks.onRestart();
                    }
                }
            ]
        });

        return modal;
    }

    /**
     * Show skip confirmation modal
     */
    showSkipConfirmation() {
        const modal = this.createModal({
            title: '⏭️ Skip Tutorial?',
            icon: '❓',
            content: `
                <p>Are you sure you want to skip the tutorial?</p>
                <p>You can always restart it later from the game menu.</p>
            `,
            buttons: [
                {
                    text: '✅ Yes, Skip Tutorial',
                    className: 'tutorial-btn-primary',
                    onClick: () => {
                        this.closeModal();
                        this.manager.skipTutorial();
                    }
                },
                {
                    text: '❌ Continue Tutorial',
                    className: 'tutorial-btn-secondary',
                    onClick: () => {
                        this.closeModal();
                    }
                }
            ]
        });

        return modal;
    }

    /**
     * Show tutorial settings modal
     * @param {Object} config - Settings configuration
     */
    showSettingsModal(config) {
        const modal = this.createModal({
            title: '⚙️ Tutorial Settings',
            icon: '🔧',
            content: `
                <div style="text-align: left;">
                    <label style="display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;">
                        <input type="checkbox" ${config.settings.autoAdvance ? 'checked' : ''} 
                               style="margin-right: 10px;" id="autoAdvanceCheckbox">
                        Auto-advance steps (when possible)
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;">
                        <input type="checkbox" ${config.settings.showHints ? 'checked' : ''} 
                               style="margin-right: 10px;" id="showHintsCheckbox">
                        Show helpful hints
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;">
                        <input type="checkbox" ${config.settings.highlightElements ? 'checked' : ''} 
                               style="margin-right: 10px;" id="highlightElementsCheckbox">
                        Highlight interactive elements
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 15px; cursor: pointer;">
                        <input type="checkbox" ${config.settings.pauseGameOnTutorial ? 'checked' : ''} 
                               style="margin-right: 10px;" id="pauseGameCheckbox">
                        Pause game during tutorial
                    </label>
                </div>
            `,
            buttons: [
                {
                    text: '💾 Save Settings',
                    className: 'tutorial-btn-primary',
                    onClick: () => {
                        const newSettings = {
                            autoAdvance: document.getElementById('autoAdvanceCheckbox').checked,
                            showHints: document.getElementById('showHintsCheckbox').checked,
                            highlightElements: document.getElementById('highlightElementsCheckbox').checked,
                            pauseGameOnTutorial: document.getElementById('pauseGameCheckbox').checked
                        };
                        
                        this.closeModal();
                        config.onSave(newSettings);
                    }
                },
                {
                    text: '❌ Cancel',
                    className: 'tutorial-btn-secondary',
                    onClick: () => {
                        this.closeModal();
                    }
                }
            ]
        });

        return modal;
    }

    /**
     * Create a generic modal
     * @param {Object} config - Modal configuration
     */
    createModal(config) {
        this.closeModal(); // Close existing modal

        this.modal = document.createElement('div');
        this.modal.className = 'tutorial-modal';
        
        const buttonsHtml = config.buttons.map(button => 
            `<button class="tutorial-btn ${button.className || 'tutorial-btn-secondary'}" 
                     data-action="${button.text}">
                ${button.text}
            </button>`
        ).join('');

        this.modal.innerHTML = `
            <div class="tutorial-modal-content">
                <button class="tutorial-modal-close">×</button>
                <div style="font-size: 48px; margin-bottom: 15px;">${config.icon || '🎮'}</div>
                <h2 class="tutorial-modal-title">${config.title}</h2>
                <div class="tutorial-modal-description">${config.content}</div>
                <div class="tutorial-modal-buttons">
                    ${buttonsHtml}
                </div>
            </div>
        `;

        // Add event listeners
        config.buttons.forEach((button, index) => {
            const buttonElement = this.modal.querySelectorAll('.tutorial-btn')[index];
            buttonElement.addEventListener('click', button.onClick);
        });

        this.modal.querySelector('.tutorial-modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.body.appendChild(this.modal);
        
        // Focus first button for accessibility
        const firstButton = this.modal.querySelector('.tutorial-btn');
        if (firstButton) {
            firstButton.focus();
        }

        return this.modal;
    }

    /**
     * Close the current modal
     */
    closeModal() {
        if (this.modal && this.modal.parentNode) {
            this.modal.parentNode.removeChild(this.modal);
            this.modal = null;
        }
    }

    /**
     * Destroy the tutorial UI and clean up resources
     */
    destroy() {
        this.clearHighlights();
        this.clearTooltips();
        this.closeModal();
        
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        
        const styles = document.getElementById('tutorialStyles');
        if (styles) {
            styles.remove();
        }
        
        console.log('Tutorial UI destroyed');
    }
}

// Export for use in tutorial manager
if (typeof window !== 'undefined') {
    window.TutorialUI = TutorialUI;
}