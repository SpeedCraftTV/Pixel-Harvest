/**
 * Translation Loader for Pixel-Harvest
 * Loads JSON translation files and provides the same API as the original inline translations
 */

class TranslationLoader {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.loaded = false;
        this.loadPromise = null;
    }

    /**
     * Initialize the translation loader
     * @param {string} language - Initial language (defaults to saved preference or browser language)
     */
    async initialize(language = null) {
        // Load language preference
        if (!language) {
            language = this.loadLanguagePreference();
        }
        
        this.currentLanguage = language;
        
        // Load translations
        await this.loadTranslations();
        
        // Update UI after loading
        if (typeof updateAllUI === 'function') {
            updateAllUI();
        }
        
        console.log(`Translations loaded for language: ${this.currentLanguage}`);
        return this.translations;
    }

    /**
     * Load translations for current language
     */
    async loadTranslations() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this._loadTranslationsInternal();
        await this.loadPromise;
        this.loadPromise = null;
    }

    async _loadTranslationsInternal() {
        try {
            // Load the current language
            await this._loadLanguage(this.currentLanguage);
            
            // Load fallback language if different
            if (this.currentLanguage !== this.fallbackLanguage) {
                await this._loadLanguage(this.fallbackLanguage);
            }
            
            this.loaded = true;
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to minimal English translations
            this._loadFallbackTranslations();
        }
    }

    /**
     * Load translations for a specific language
     * @param {string} language - Language code
     */
    async _loadLanguage(language) {
        try {
            const response = await fetch(`src/i18n/${language}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const translations = await response.json();
            this.translations[language] = translations;
            
            // Cache to localStorage for faster subsequent loads
            localStorage.setItem(`pixelHarvest_translations_${language}`, JSON.stringify(translations));
        } catch (error) {
            console.warn(`Failed to load ${language} translations from server:`, error);
            
            // Try to load from localStorage cache
            const cached = localStorage.getItem(`pixelHarvest_translations_${language}`);
            if (cached) {
                try {
                    this.translations[language] = JSON.parse(cached);
                    console.log(`Loaded ${language} translations from cache`);
                } catch (parseError) {
                    console.error(`Failed to parse cached translations for ${language}:`, parseError);
                    throw error;
                }
            } else {
                throw error;
            }
        }
    }

    /**
     * Fallback translations for file:// usage
     */
    _loadFallbackTranslations() {
        this.translations.en = {
            score: 'Score',
            instructions: {
                move: '🌱 Move with ZQSD or arrow keys',
                action: '⚡ SPACE to plant/harvest at closest plot',
                water: '💧 E to water plants',
                camera: '📹 C to toggle camera mode',
                growth: '🌿 Plants grow automatically (3 stages)',
                unlock: '🔒 Unlock plots by getting close and pressing SPACE',
                cycle: '🌙 Watch the day/night cycle!',
                drag: '🖱️ Drag to rotate camera view',
                zoom: '🔍 Scroll wheel to zoom in/out'
            },
            menu: {
                main: 'Menu',
                controls: 'Controls',
                newGame: 'New Game',
                language: 'Language',
                uiMode: 'UI Mode',
                settings: 'Settings',
                tutorial: 'Tutorial'
            },
            plants: {
                title: 'Plant Types:',
                coins: 'Coins'
            },
            inventory: {
                title: 'Inventory:'
            },
            marketplace: {
                title: 'Marketplace:'
            },
            objectives: {
                title: 'Objectives:'
            },
            weather: {
                title: 'Weather'
            },
            season: {
                title: 'Season'
            },
            animals: {
                title: 'Farm Animals'
            },
            quests: {
                title: 'Daily Quests'
            },
            time: {
                day: 'Day',
                night: 'Night'
            }
        };
        this.loaded = true;
        console.log('Loaded fallback English translations for file:// usage');
    }

    /**
     * Get translation for a key with fallback support
     * @param {string} key - Translation key (e.g., 'ui.welcome')
     * @param {...any} args - Arguments for string interpolation
     * @returns {string} - Translated string
     */
    t(key, ...args) {
        if (!this.loaded) {
            console.warn('Translations not yet loaded, returning key:', key);
            return key;
        }

        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        // Navigate through nested keys
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if translation not found
                value = this.translations[this.fallbackLanguage];
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        console.warn(`Translation not found for key: ${key}`);
                        return key; // Return key if not found
                    }
                }
                break;
            }
        }

        // Handle string interpolation with numbered placeholders
        if (typeof value === 'string' && args.length > 0) {
            return value.replace(/\{(\d+)\}/g, (match, index) => {
                const argIndex = parseInt(index);
                return args[argIndex] !== undefined ? args[argIndex] : match;
            });
        }
        
        return value || key;
    }

    /**
     * Set the current language
     * @param {string} languageCode - Language code (e.g., 'en', 'fr', 'es')
     */
    async setLanguage(languageCode) {
        if (!this.translations[languageCode]) {
            try {
                await this._loadLanguage(languageCode);
            } catch (error) {
                console.error(`Failed to load language ${languageCode}:`, error);
                return false;
            }
        }
        
        this.currentLanguage = languageCode;
        localStorage.setItem('pixelHarvestLanguage', languageCode);
        
        // Update UI
        if (typeof updateAllUI === 'function') {
            updateAllUI();
        }
        
        // Trigger language change event for tutorial system (but prevent recursion)
        if (window.TutorialLocalization && 
            window.TutorialLocalization.getCurrentLanguage() !== languageCode) {
            window.TutorialLocalization.setLanguage(languageCode);
        }
        
        console.log(`Language changed to: ${languageCode}`);
        return true;
    }

    /**
     * Get the current language
     * @returns {string} - Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Load language preference from localStorage
     * @returns {string} - Preferred language code
     */
    loadLanguagePreference() {
        const saved = localStorage.getItem('pixelHarvestLanguage');
        if (saved && ['en', 'fr', 'es'].includes(saved)) {
            return saved;
        }
        
        // Try to detect browser language
        const browserLang = navigator.language.substring(0, 2);
        if (['en', 'fr', 'es'].includes(browserLang)) {
            return browserLang;
        }
        
        return 'en'; // Default fallback
    }

    /**
     * Check if translations are loaded
     * @returns {boolean}
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * Get available languages
     * @returns {Array<string>}
     */
    getAvailableLanguages() {
        return ['en', 'fr', 'es'];
    }

    /**
     * Preload all available language files
     */
    async preloadAllLanguages() {
        const languages = this.getAvailableLanguages();
        const promises = languages.map(lang => {
            if (!this.translations[lang]) {
                return this._loadLanguage(lang).catch(error => {
                    console.warn(`Failed to preload ${lang}:`, error);
                });
            }
            return Promise.resolve();
        });
        
        await Promise.all(promises);
        console.log('All available languages preloaded');
    }
}

// Create global instance
window.translationLoader = new TranslationLoader();

// Expose t function globally for compatibility
window.t = (...args) => window.translationLoader.t(...args);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslationLoader;
}