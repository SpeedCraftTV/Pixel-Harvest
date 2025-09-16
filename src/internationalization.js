/**
 * Enhanced Internationalization System for Pixel-Harvest
 * JSON-based localization with dynamic loading and comprehensive tutorial support
 */

class InternationalizationSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.loadedTranslations = new Map();
        this.availableLanguages = new Map();
        this.translationCache = new Map();
        this.isInitialized = false;
        this.loadingPromises = new Map();
        
        // Configuration
        this.config = {
            translationsPath: './data/localization/',
            supportedLanguages: ['en', 'fr', 'es', 'de', 'it', 'pt'],
            autoDetectBrowser: true,
            persistLanguage: true,
            enableFallback: true,
            enablePluralization: true,
            enableInterpolation: true
        };

        // Event listeners
        this.listeners = new Map();
        
        // Bind methods
        this.t = this.t.bind(this);
        this.setLanguage = this.setLanguage.bind(this);
    }

    /**
     * Initialize the internationalization system
     */
    async initialize() {
        console.log('🌍 Initializing Internationalization System...');
        
        try {
            // Load language metadata first
            await this.loadLanguageMetadata();
            
            // Determine initial language
            await this.determineInitialLanguage();
            
            // Load the initial language
            await this.loadLanguage(this.currentLanguage);
            
            // Set up automatic UI updates
            this.setupUIUpdates();
            
            // Update the UI immediately
            this.updateAllUIElements();
            
            this.isInitialized = true;
            this.emit('initialized', { language: this.currentLanguage });
            
            console.log(`✅ Internationalization system initialized with language: ${this.currentLanguage}`);
        } catch (error) {
            console.error('❌ Failed to initialize internationalization system:', error);
            // Fall back to English if initialization fails
            this.currentLanguage = 'en';
            this.isInitialized = true;
        }
    }

    /**
     * Load metadata for all available languages
     */
    async loadLanguageMetadata() {
        for (const langCode of this.config.supportedLanguages) {
            try {
                const langData = await this.loadLanguageFile(langCode);
                if (langData && langData.meta) {
                    this.availableLanguages.set(langCode, langData.meta);
                }
            } catch (error) {
                console.warn(`Failed to load metadata for language: ${langCode}`, error);
            }
        }
    }

    /**
     * Determine the initial language to use
     */
    async determineInitialLanguage() {
        // 1. Check localStorage for saved preference
        if (this.config.persistLanguage) {
            const savedLang = localStorage.getItem('pixelHarvestLanguage');
            if (savedLang && this.config.supportedLanguages.includes(savedLang)) {
                this.currentLanguage = savedLang;
                return;
            }
        }

        // 2. Check browser language if auto-detection is enabled
        if (this.config.autoDetectBrowser) {
            const browserLang = this.detectBrowserLanguage();
            if (browserLang && this.config.supportedLanguages.includes(browserLang)) {
                this.currentLanguage = browserLang;
                return;
            }
        }

        // 3. Fall back to default
        this.currentLanguage = this.fallbackLanguage;
    }

    /**
     * Detect browser language preference
     */
    detectBrowserLanguage() {
        const browsers = [
            navigator.language,
            navigator.languages ? navigator.languages[0] : null,
            navigator.userLanguage,
            navigator.browserLanguage,
            navigator.systemLanguage
        ].filter(Boolean);

        for (const lang of browsers) {
            const langCode = lang.substring(0, 2).toLowerCase();
            if (this.config.supportedLanguages.includes(langCode)) {
                return langCode;
            }
        }
        return null;
    }

    /**
     * Load a language file
     */
    async loadLanguageFile(langCode) {
        if (this.loadingPromises.has(langCode)) {
            return this.loadingPromises.get(langCode);
        }

        const loadPromise = fetch(`${this.config.translationsPath}${langCode}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                this.loadedTranslations.set(langCode, data);
                this.translationCache.clear(); // Clear cache when new language is loaded
                console.log(`📦 Loaded translations for: ${langCode}`);
                return data;
            })
            .catch(error => {
                console.error(`Failed to load language file: ${langCode}.json`, error);
                throw error;
            });

        this.loadingPromises.set(langCode, loadPromise);
        return loadPromise;
    }

    /**
     * Load a specific language
     */
    async loadLanguage(langCode) {
        if (!this.config.supportedLanguages.includes(langCode)) {
            console.warn(`Unsupported language code: ${langCode}`);
            return false;
        }

        try {
            if (!this.loadedTranslations.has(langCode)) {
                await this.loadLanguageFile(langCode);
            }
            return true;
        } catch (error) {
            console.error(`Failed to load language: ${langCode}`, error);
            return false;
        }
    }

    /**
     * Set the current language
     */
    async setLanguage(langCode) {
        if (langCode === this.currentLanguage) {
            return true;
        }

        console.log(`🔄 Changing language from ${this.currentLanguage} to ${langCode}`);

        try {
            const success = await this.loadLanguage(langCode);
            if (success) {
                const oldLanguage = this.currentLanguage;
                this.currentLanguage = langCode;
                
                // Save preference
                if (this.config.persistLanguage) {
                    localStorage.setItem('pixelHarvestLanguage', langCode);
                }

                // Clear translation cache
                this.translationCache.clear();

                // Update all UI elements
                this.updateAllUIElements();

                // Emit language change event
                this.emit('languageChanged', { 
                    oldLanguage, 
                    newLanguage: langCode 
                });

                console.log(`✅ Language changed to: ${langCode}`);
                return true;
            }
        } catch (error) {
            console.error(`Failed to set language: ${langCode}`, error);
        }
        return false;
    }

    /**
     * Get translation for a key with advanced features
     */
    t(key, params = {}) {
        // Create cache key
        const cacheKey = `${this.currentLanguage}:${key}:${JSON.stringify(params)}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        let translation = this.getTranslation(key, this.currentLanguage);

        // Fallback to English if translation not found and fallback enabled
        if (!translation && this.config.enableFallback && this.currentLanguage !== this.fallbackLanguage) {
            translation = this.getTranslation(key, this.fallbackLanguage);
            if (translation) {
                console.warn(`Translation fallback used for key: ${key} (${this.currentLanguage} -> ${this.fallbackLanguage})`);
            }
        }

        // If still no translation, return the key itself
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            translation = key;
        }

        // Apply interpolation if enabled
        if (this.config.enableInterpolation && typeof translation === 'string' && Object.keys(params).length > 0) {
            translation = this.interpolateString(translation, params);
        }

        // Apply pluralization if enabled and count parameter exists
        if (this.config.enablePluralization && params.count !== undefined) {
            translation = this.applyPluralization(translation, params.count, params);
        }

        // Cache the result
        this.translationCache.set(cacheKey, translation);
        return translation;
    }

    /**
     * Get raw translation from loaded data
     */
    getTranslation(key, langCode) {
        const langData = this.loadedTranslations.get(langCode);
        if (!langData) return null;

        const keys = key.split('.');
        let current = langData;

        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k];
            } else {
                return null;
            }
        }

        return current;
    }

    /**
     * Interpolate variables in translation strings
     */
    interpolateString(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Apply pluralization rules (simple English-based for now)
     */
    applyPluralization(translation, count, params) {
        if (typeof translation === 'object' && translation.one && translation.other) {
            return count === 1 ? translation.one : translation.other;
        }
        
        // Simple pluralization for English-like languages
        if (typeof translation === 'string' && count !== 1) {
            // This is a basic implementation - a full system would need proper pluralization rules
            if (translation.includes('{count}')) {
                return this.interpolateString(translation, { ...params, count });
            }
        }
        
        return this.interpolateString(translation, { ...params, count });
    }

    /**
     * Set up automatic UI updates
     */
    setupUIUpdates() {
        // Watch for DOM changes and update new elements with data-translate attributes
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.updateElement(node);
                            const elements = node.querySelectorAll('[data-translate]');
                            elements.forEach(el => this.updateElement(el));
                        }
                    });
                });
            });

            observer.observe(document.body, { 
                childList: true, 
                subtree: true 
            });
        }
    }

    /**
     * Update all UI elements with translations
     */
    updateAllUIElements() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => this.updateElement(element));
        
        // Emit event for other systems to update
        this.emit('uiUpdated', { language: this.currentLanguage });
    }

    /**
     * Update a single element with translation
     */
    updateElement(element) {
        const key = element.getAttribute('data-translate');
        if (!key) return;

        const params = this.getElementParams(element);
        const translation = this.t(key, params);

        if (element.tagName === 'INPUT' && element.type !== 'button' && element.type !== 'submit') {
            element.placeholder = translation;
        } else {
            // Preserve HTML structure if the translation contains HTML
            if (typeof translation === 'string' && translation.includes('<')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        }
    }

    /**
     * Extract parameters from element data attributes
     */
    getElementParams(element) {
        const params = {};
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('data-translate-')) {
                const paramName = attr.name.replace('data-translate-', '');
                params[paramName] = attr.value;
            }
        });
        return params;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return Array.from(this.availableLanguages.entries()).map(([code, meta]) => ({
            code,
            ...meta
        }));
    }

    /**
     * Get current language info
     */
    getCurrentLanguage() {
        return {
            code: this.currentLanguage,
            ...this.availableLanguages.get(this.currentLanguage)
        };
    }

    /**
     * Check if a language is loaded
     */
    isLanguageLoaded(langCode) {
        return this.loadedTranslations.has(langCode);
    }

    /**
     * Preload languages for better performance
     */
    async preloadLanguages(langCodes = null) {
        const languagesToLoad = langCodes || this.config.supportedLanguages;
        const promises = languagesToLoad.map(lang => this.loadLanguage(lang));
        await Promise.allSettled(promises);
    }

    /**
     * Get tutorial steps with current language
     */
    getLocalizedTutorialSteps() {
        const steps = this.t('tutorial.steps');
        if (typeof steps === 'object') {
            return Object.keys(steps).map(stepId => ({
                id: stepId,
                ...steps[stepId]
            }));
        }
        return [];
    }

    /**
     * Event system
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Validation and debugging methods
     */
    validateTranslations() {
        const results = [];
        const languages = Array.from(this.loadedTranslations.keys());
        
        if (languages.length === 0) {
            results.push({ type: 'error', message: 'No languages loaded' });
            return results;
        }

        // Compare all languages against the fallback language
        const fallbackData = this.loadedTranslations.get(this.fallbackLanguage);
        if (!fallbackData) {
            results.push({ type: 'error', message: `Fallback language ${this.fallbackLanguage} not loaded` });
            return results;
        }

        const fallbackKeys = this.extractAllKeys(fallbackData);
        
        languages.forEach(lang => {
            if (lang === this.fallbackLanguage) return;
            
            const langData = this.loadedTranslations.get(lang);
            const langKeys = this.extractAllKeys(langData);
            
            // Find missing keys
            const missingKeys = fallbackKeys.filter(key => !langKeys.includes(key));
            const extraKeys = langKeys.filter(key => !fallbackKeys.includes(key));
            
            if (missingKeys.length > 0) {
                results.push({
                    type: 'warning',
                    language: lang,
                    message: `Missing ${missingKeys.length} translations`,
                    keys: missingKeys
                });
            }
            
            if (extraKeys.length > 0) {
                results.push({
                    type: 'info',
                    language: lang,
                    message: `Extra ${extraKeys.length} translations`,
                    keys: extraKeys
                });
            }
            
            // Calculate completion percentage
            const completion = ((langKeys.length - extraKeys.length) / fallbackKeys.length) * 100;
            results.push({
                type: 'info',
                language: lang,
                message: `Translation completion: ${completion.toFixed(1)}%`
            });
        });

        return results;
    }

    /**
     * Extract all translation keys from an object
     */
    extractAllKeys(obj, prefix = '') {
        const keys = [];
        
        for (const [key, value] of Object.entries(obj)) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                keys.push(...this.extractAllKeys(value, fullKey));
            } else {
                keys.push(fullKey);
            }
        }
        
        return keys;
    }

    /**
     * Debug information
     */
    getDebugInfo() {
        return {
            currentLanguage: this.currentLanguage,
            loadedLanguages: Array.from(this.loadedTranslations.keys()),
            availableLanguages: Array.from(this.availableLanguages.keys()),
            cacheSize: this.translationCache.size,
            isInitialized: this.isInitialized,
            config: this.config
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.translationCache.clear();
        console.log('🗑️ Translation cache cleared');
    }
}

// Create global instance
window.i18n = new InternationalizationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InternationalizationSystem;
}

// Convenience function for global access
window.t = window.i18n.t;

console.log('🌍 Internationalization system loaded');