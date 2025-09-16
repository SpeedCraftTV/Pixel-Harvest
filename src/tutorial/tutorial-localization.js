/**
 * Tutorial Localization
 * Multi-language support for the tutorial system
 */

const TutorialLocalization = {
    // Current language
    currentLanguage: 'en',
    
    // Available languages
    languages: {
        en: {
            name: 'English',
            flag: '🇺🇸',
            code: 'en'
        },
        fr: {
            name: 'Français',
            flag: '🇫🇷',
            code: 'fr'
        },
        es: {
            name: 'Español',
            flag: '🇪🇸',
            code: 'es'
        }
    },

    // Translation strings organized by language
    translations: {
        en: {
            // Tutorial UI
            ui: {
                welcome: 'Welcome',
                next: 'Next →',
                previous: '← Previous',
                skip: 'Skip Step',
                close: 'Skip Tutorial',
                settings: 'Tutorial Settings',
                complete: 'Complete Tutorial',
                restart: 'Restart Tutorial',
                startPlaying: '🌟 Start Playing!',
                stepOf: 'Step {current} of {total}',
                hints: 'Hints',
                tutorialComplete: 'Tutorial Complete!',
                congratulations: 'Congratulations!',
                progress: 'Progress',
                menu: 'Menu'
            },

            // Welcome modal
            welcome: {
                title: '🌱 Welcome to Pixel-Harvest!',
                subtitle: 'Ready to start your farming adventure?',
                description: 'This interactive tutorial will teach you everything you need to know!',
                learnAbout: 'You\'ll learn how to:',
                features: [
                    '🌱 Plant and harvest crops',
                    '💧 Water your plants',
                    '🐄 Manage farm animals',
                    '💰 Buy and sell in the marketplace',
                    '🎯 Complete quests and objectives'
                ],
                startTutorial: '🚀 Start Tutorial',
                settings: '⚙️ Settings',
                skipTutorial: '⏭️ Skip Tutorial'
            },

            // Completion screen
            completion: {
                title: '🎉 Tutorial Complete!',
                subtitle: 'Congratulations! You\'ve completed the Pixel-Harvest tutorial!',
                rewardsTitle: '🎁 Tutorial Rewards:',
                rewards: [
                    '💰 100 Coins',
                    '🥕 10 Carrot Seeds',
                    '🍅 5 Tomato Seeds',
                    '⭐ 50 Experience Points'
                ],
                encouragement: 'Now you\'re ready to build your farming empire! Good luck!',
                startPlaying: '🌟 Start Playing!',
                restartTutorial: '🔄 Restart Tutorial'
            },

            // Skip confirmation
            skipConfirmation: {
                title: '⏭️ Skip Tutorial?',
                message: 'Are you sure you want to skip the tutorial?',
                note: 'You can always restart it later from the game menu.',
                confirmSkip: '✅ Yes, Skip Tutorial',
                continueTutorial: '❌ Continue Tutorial'
            },

            // Settings modal
            settings: {
                title: '⚙️ Tutorial Settings',
                autoAdvance: 'Auto-advance steps (when possible)',
                showHints: 'Show helpful hints',
                highlightElements: 'Highlight interactive elements',
                pauseGame: 'Pause game during tutorial',
                saveSettings: '💾 Save Settings',
                cancel: '❌ Cancel'
            },

            // Step-specific content
            steps: {
                welcome: {
                    title: 'Welcome to Pixel-Harvest!',
                    description: 'Welcome to your new farm! You\'re about to learn how to grow crops, manage animals, and build a thriving agricultural business.',
                    hints: [
                        'You can skip any step by clicking "Skip Step"',
                        'Use keyboard arrows to navigate between steps',
                        'Press ESC to exit the tutorial at any time'
                    ]
                },
                movement: {
                    title: 'Moving Your Character',
                    description: 'Let\'s start by learning how to move around your farm!',
                    desktop: 'Desktop: Use ZQSD keys or arrow keys to move',
                    mobile: 'Mobile: Use the virtual joystick in the bottom-left corner',
                    instruction: 'Try moving your character around now. Notice how the camera follows you!',
                    hints: [
                        'The character position is shown in the top-right corner',
                        'You can drag the mouse to rotate the camera view',
                        'Scroll wheel zooms in and out'
                    ]
                }
                // ... more step translations would go here
            },

            // Common game terms
            terms: {
                coins: 'Coins',
                seeds: 'Seeds',
                plants: 'Plants',
                inventory: 'Inventory',
                marketplace: 'Marketplace',
                objectives: 'Objectives',
                animals: 'Farm Animals',
                quests: 'Daily Quests',
                weather: 'Weather',
                seasons: 'Seasons',
                equipment: 'Equipment'
            }
        },

        fr: {
            // Tutorial UI
            ui: {
                welcome: 'Bienvenue',
                next: 'Suivant →',
                previous: '← Précédent',
                skip: 'Passer l\'étape',
                close: 'Ignorer le tutoriel',
                settings: 'Paramètres du tutoriel',
                complete: 'Terminer le tutoriel',
                restart: 'Redémarrer le tutoriel',
                startPlaying: '🌟 Commencer à jouer !',
                stepOf: 'Étape {current} sur {total}',
                hints: 'Conseils',
                tutorialComplete: 'Tutoriel terminé !',
                congratulations: 'Félicitations !',
                progress: 'Progression',
                menu: 'Menu'
            },

            // Welcome modal
            welcome: {
                title: '🌱 Bienvenue dans Pixel-Harvest !',
                subtitle: 'Prêt à commencer votre aventure agricole ?',
                description: 'Ce tutoriel interactif vous apprendra tout ce que vous devez savoir !',
                learnAbout: 'Vous apprendrez à :',
                features: [
                    '🌱 Planter et récolter des cultures',
                    '💧 Arroser vos plantes',
                    '🐄 Gérer les animaux de la ferme',
                    '💰 Acheter et vendre au marché',
                    '🎯 Compléter des quêtes et objectifs'
                ],
                startTutorial: '🚀 Commencer le tutoriel',
                settings: '⚙️ Paramètres',
                skipTutorial: '⏭️ Ignorer le tutoriel'
            },

            // Completion screen
            completion: {
                title: '🎉 Tutoriel terminé !',
                subtitle: 'Félicitations ! Vous avez terminé le tutoriel Pixel-Harvest !',
                rewardsTitle: '🎁 Récompenses du tutoriel :',
                rewards: [
                    '💰 100 Pièces',
                    '🥕 10 Graines de carotte',
                    '🍅 5 Graines de tomate',
                    '⭐ 50 Points d\'expérience'
                ],
                encouragement: 'Maintenant vous êtes prêt à construire votre empire agricole ! Bonne chance !',
                startPlaying: '🌟 Commencer à jouer !',
                restartTutorial: '🔄 Redémarrer le tutoriel'
            },

            // Skip confirmation
            skipConfirmation: {
                title: '⏭️ Ignorer le tutoriel ?',
                message: 'Êtes-vous sûr de vouloir ignorer le tutoriel ?',
                note: 'Vous pouvez toujours le redémarrer plus tard depuis le menu du jeu.',
                confirmSkip: '✅ Oui, ignorer le tutoriel',
                continueTutorial: '❌ Continuer le tutoriel'
            },

            // Settings modal
            settings: {
                title: '⚙️ Paramètres du tutoriel',
                autoAdvance: 'Avancer automatiquement les étapes (quand possible)',
                showHints: 'Afficher les conseils utiles',
                highlightElements: 'Surligner les éléments interactifs',
                pauseGame: 'Mettre en pause le jeu pendant le tutoriel',
                saveSettings: '💾 Sauvegarder les paramètres',
                cancel: '❌ Annuler'
            },

            // Common game terms
            terms: {
                coins: 'Pièces',
                seeds: 'Graines',
                plants: 'Plantes',
                inventory: 'Inventaire',
                marketplace: 'Marché',
                objectives: 'Objectifs',
                animals: 'Animaux de ferme',
                quests: 'Quêtes quotidiennes',
                weather: 'Météo',
                seasons: 'Saisons',
                equipment: 'Équipement'
            }
        },

        es: {
            // Tutorial UI
            ui: {
                welcome: 'Bienvenido',
                next: 'Siguiente →',
                previous: '← Anterior',
                skip: 'Saltar paso',
                close: 'Saltar tutorial',
                settings: 'Configuración del tutorial',
                complete: 'Completar tutorial',
                restart: 'Reiniciar tutorial',
                startPlaying: '🌟 ¡Empezar a jugar!',
                stepOf: 'Paso {current} de {total}',
                hints: 'Consejos',
                tutorialComplete: '¡Tutorial completado!',
                congratulations: '¡Felicitaciones!',
                progress: 'Progreso',
                menu: 'Menú'
            },

            // Welcome modal
            welcome: {
                title: '🌱 ¡Bienvenido a Pixel-Harvest!',
                subtitle: '¿Listo para comenzar tu aventura agrícola?',
                description: '¡Este tutorial interactivo te enseñará todo lo que necesitas saber!',
                learnAbout: 'Aprenderás cómo:',
                features: [
                    '🌱 Plantar y cosechar cultivos',
                    '💧 Regar tus plantas',
                    '🐄 Manejar animales de granja',
                    '💰 Comprar y vender en el mercado',
                    '🎯 Completar misiones y objetivos'
                ],
                startTutorial: '🚀 Comenzar tutorial',
                settings: '⚙️ Configuración',
                skipTutorial: '⏭️ Saltar tutorial'
            },

            // Completion screen
            completion: {
                title: '🎉 ¡Tutorial completado!',
                subtitle: '¡Felicitaciones! ¡Has completado el tutorial de Pixel-Harvest!',
                rewardsTitle: '🎁 Recompensas del tutorial:',
                rewards: [
                    '💰 100 Monedas',
                    '🥕 10 Semillas de zanahoria',
                    '🍅 5 Semillas de tomate',
                    '⭐ 50 Puntos de experiencia'
                ],
                encouragement: '¡Ahora estás listo para construir tu imperio agrícola! ¡Buena suerte!',
                startPlaying: '🌟 ¡Empezar a jugar!',
                restartTutorial: '🔄 Reiniciar tutorial'
            },

            // Skip confirmation
            skipConfirmation: {
                title: '⏭️ ¿Saltar tutorial?',
                message: '¿Estás seguro de que quieres saltar el tutorial?',
                note: 'Siempre puedes reiniciarlo más tarde desde el menú del juego.',
                confirmSkip: '✅ Sí, saltar tutorial',
                continueTutorial: '❌ Continuar tutorial'
            },

            // Settings modal
            settings: {
                title: '⚙️ Configuración del tutorial',
                autoAdvance: 'Avanzar pasos automáticamente (cuando sea posible)',
                showHints: 'Mostrar consejos útiles',
                highlightElements: 'Resaltar elementos interactivos',
                pauseGame: 'Pausar juego durante el tutorial',
                saveSettings: '💾 Guardar configuración',
                cancel: '❌ Cancelar'
            },

            // Common game terms
            terms: {
                coins: 'Monedas',
                seeds: 'Semillas',
                plants: 'Plantas',
                inventory: 'Inventario',
                marketplace: 'Mercado',
                objectives: 'Objetivos',
                animals: 'Animales de granja',
                quests: 'Misiones diarias',
                weather: 'Clima',
                seasons: 'Estaciones',
                equipment: 'Equipamiento'
            }
        }
    },

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'ui.welcome')
     * @param {Object} params - Parameters for string interpolation
     * @returns {string} - Translated string
     */
    t(key, params = {}) {
        // Use the main translation loader if available and loaded
        if (window.translationLoader && window.translationLoader.isLoaded()) {
            const translation = window.translationLoader.t(key);
            
            // Handle string interpolation for tutorial-specific parameters
            if (typeof translation === 'string' && Object.keys(params).length > 0) {
                return translation.replace(/\{(\w+)\}/g, (match, param) => {
                    return params[param] || match;
                });
            }
            
            return translation;
        }
        
        // Fallback to local tutorial translations
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Fallback to English if translation not found
                translation = this.translations.en;
                for (const fallbackKey of keys) {
                    if (translation && typeof translation === 'object' && fallbackKey in translation) {
                        translation = translation[fallbackKey];
                    } else {
                        console.warn(`Translation not found for key: ${key}`);
                        return key; // Return the key itself as fallback
                    }
                }
                break;
            }
        }
        
        // Handle string interpolation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            return translation.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] || match;
            });
        }
        
        return translation || key;
    },

    /**
     * Set the current language
     * @param {string} languageCode - Language code (e.g., 'en', 'fr', 'es')
     */
    setLanguage(languageCode) {
        if (this.translations[languageCode]) {
            this.currentLanguage = languageCode;
            this.updateUI();
            localStorage.setItem('pixelHarvestLanguage', languageCode);
            console.log(`Tutorial language changed to: ${languageCode}`);
            
            // Sync with main translation loader if available (but prevent recursion)
            if (window.translationLoader && window.translationLoader.isLoaded() && 
                window.translationLoader.getCurrentLanguage() !== languageCode) {
                window.translationLoader.setLanguage(languageCode);
            }
        } else {
            console.warn(`Language not supported: ${languageCode}`);
        }
    },

    /**
     * Get the current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    },

    /**
     * Get available languages
     * @returns {Object} - Available languages object
     */
    getAvailableLanguages() {
        return this.languages;
    },

    /**
     * Load language preference from localStorage
     */
    loadLanguagePreference() {
        const saved = localStorage.getItem('pixelHarvestLanguage');
        if (saved && this.translations[saved]) {
            this.currentLanguage = saved;
        } else {
            // Try to detect browser language
            const browserLang = navigator.language.substring(0, 2);
            if (this.translations[browserLang]) {
                this.currentLanguage = browserLang;
            }
        }
        
        // Sync with main translation loader if available
        if (window.translationLoader && window.translationLoader.isLoaded()) {
            this.currentLanguage = window.translationLoader.getCurrentLanguage();
        }
    },

    /**
     * Update UI elements with current language
     */
    updateUI() {
        // Update elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update tutorial steps if tutorial is active
        if (window.tutorialManager && window.tutorialManager.isActive) {
            window.tutorialManager.ui.updateLanguage();
        }
    },

    /**
     * Get localized tutorial steps
     * @returns {Object} - Localized tutorial steps
     */
    getLocalizedSteps() {
        const baseSteps = window.TutorialSteps ? window.TutorialSteps.steps : [];
        const currentTranslations = this.translations[this.currentLanguage];
        
        return baseSteps.map(step => {
            // Try to get localized content for this step
            const localizedStep = { ...step };
            
            // Check if we have specific translations for this step
            if (currentTranslations.steps && currentTranslations.steps[step.id]) {
                const stepTranslations = currentTranslations.steps[step.id];
                
                if (stepTranslations.title) {
                    localizedStep.title = stepTranslations.title;
                }
                
                if (stepTranslations.description) {
                    localizedStep.description = stepTranslations.description;
                }
                
                if (stepTranslations.hints) {
                    localizedStep.hints = stepTranslations.hints;
                }
            }
            
            return localizedStep;
        });
    },

    /**
     * Format numbers according to current locale
     * @param {number} number - Number to format
     * @param {Object} options - Formatting options
     * @returns {string} - Formatted number
     */
    formatNumber(number, options = {}) {
        const locale = this.getLocaleCode();
        return new Intl.NumberFormat(locale, options).format(number);
    },

    /**
     * Format currency according to current locale
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: 'USD')
     * @returns {string} - Formatted currency
     */
    formatCurrency(amount, currency = 'USD') {
        const locale = this.getLocaleCode();
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Get the locale code for the current language
     * @returns {string} - Locale code
     */
    getLocaleCode() {
        const localeMap = {
            en: 'en-US',
            fr: 'fr-FR',
            es: 'es-ES'
        };
        return localeMap[this.currentLanguage] || 'en-US';
    },

    /**
     * Initialize the localization system
     */
    initialize() {
        this.loadLanguagePreference();
        this.updateUI();
        
        // Listen for language changes from game settings
        document.addEventListener('languageChanged', (event) => {
            this.setLanguage(event.detail.language);
        });
        
        console.log(`Tutorial localization initialized with language: ${this.currentLanguage}`);
    }
};

// Export for use in tutorial system
if (typeof window !== 'undefined') {
    window.TutorialLocalization = TutorialLocalization;
}