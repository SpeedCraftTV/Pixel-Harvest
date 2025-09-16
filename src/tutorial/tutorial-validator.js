/**
 * Tutorial Localization Validator
 * Validates completeness and consistency of tutorial translations
 */

class TutorialLocalizationValidator {
    constructor() {
        this.baseLanguage = 'en';
        this.supportedLanguages = ['en', 'fr', 'es', 'de', 'it', 'pt'];
        this.validationResults = new Map();
    }

    /**
     * Validate all tutorial translations
     */
    async validateAllTranslations() {
        console.log('🔍 Starting tutorial localization validation...');
        
        const results = {
            summary: {
                totalLanguages: this.supportedLanguages.length,
                validLanguages: 0,
                warnings: 0,
                errors: 0
            },
            languages: new Map(),
            recommendations: []
        };

        // Load and validate each language
        for (const langCode of this.supportedLanguages) {
            try {
                const langResult = await this.validateLanguage(langCode);
                results.languages.set(langCode, langResult);
                
                if (langResult.isValid) {
                    results.summary.validLanguages++;
                }
                
                results.summary.warnings += langResult.warnings.length;
                results.summary.errors += langResult.errors.length;
                
            } catch (error) {
                console.error(`Failed to validate language ${langCode}:`, error);
                results.languages.set(langCode, {
                    isValid: false,
                    errors: [`Failed to load language file: ${error.message}`],
                    warnings: [],
                    completeness: 0,
                    missingKeys: [],
                    extraKeys: []
                });
                results.summary.errors++;
            }
        }

        // Generate recommendations
        results.recommendations = this.generateRecommendations(results);

        this.validationResults = results;
        this.printValidationReport(results);
        
        return results;
    }

    /**
     * Validate a specific language
     */
    async validateLanguage(langCode) {
        const result = {
            language: langCode,
            isValid: true,
            errors: [],
            warnings: [],
            completeness: 0,
            missingKeys: [],
            extraKeys: [],
            tutorialSteps: {
                total: 0,
                translated: 0,
                missing: []
            }
        };

        try {
            // Load the language data
            const response = await fetch(`./data/localization/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const langData = await response.json();
            
            // Get base language for comparison
            let baseData = null;
            if (langCode !== this.baseLanguage) {
                const baseResponse = await fetch(`./data/localization/${this.baseLanguage}.json`);
                baseData = await baseResponse.json();
            }

            // Validate structure
            this.validateStructure(langData, result);
            
            // Validate completeness against base language
            if (baseData && langCode !== this.baseLanguage) {
                this.validateCompleteness(langData, baseData, result);
            }
            
            // Validate tutorial steps specifically
            this.validateTutorialSteps(langData, result);
            
            // Validate metadata
            this.validateMetadata(langData, result);
            
            // Calculate overall validity
            result.isValid = result.errors.length === 0;
            
        } catch (error) {
            result.errors.push(`Failed to validate language: ${error.message}`);
            result.isValid = false;
        }

        return result;
    }

    /**
     * Validate the basic structure of translation data
     */
    validateStructure(langData, result) {
        const requiredSections = ['meta', 'ui', 'tutorial', 'game', 'messages'];
        
        for (const section of requiredSections) {
            if (!langData[section]) {
                result.errors.push(`Missing required section: ${section}`);
            }
        }

        // Validate tutorial structure
        if (langData.tutorial) {
            const requiredTutorialSections = ['ui', 'welcome', 'completion', 'steps'];
            for (const section of requiredTutorialSections) {
                if (!langData.tutorial[section]) {
                    result.errors.push(`Missing tutorial section: ${section}`);
                }
            }
        }
    }

    /**
     * Validate completeness against base language
     */
    validateCompleteness(langData, baseData, result) {
        const langKeys = this.extractAllKeys(langData);
        const baseKeys = this.extractAllKeys(baseData);
        
        // Find missing keys
        result.missingKeys = baseKeys.filter(key => !langKeys.includes(key));
        
        // Find extra keys
        result.extraKeys = langKeys.filter(key => !baseKeys.includes(key));
        
        // Calculate completeness percentage
        const totalBaseKeys = baseKeys.length;
        const translatedKeys = langKeys.filter(key => baseKeys.includes(key)).length;
        result.completeness = totalBaseKeys > 0 ? (translatedKeys / totalBaseKeys) * 100 : 0;
        
        // Add warnings for missing keys
        if (result.missingKeys.length > 0) {
            result.warnings.push(`Missing ${result.missingKeys.length} translations`);
        }
        
        // Add info for extra keys
        if (result.extraKeys.length > 0) {
            result.warnings.push(`Has ${result.extraKeys.length} extra translations`);
        }
        
        // Error if completeness is too low
        if (result.completeness < 95) {
            result.errors.push(`Translation completeness too low: ${result.completeness.toFixed(1)}%`);
        }
    }

    /**
     * Validate tutorial steps specifically
     */
    validateTutorialSteps(langData, result) {
        if (!langData.tutorial || !langData.tutorial.steps) {
            result.errors.push('Missing tutorial steps section');
            return;
        }

        const steps = langData.tutorial.steps;
        const expectedSteps = [
            'welcome', 'character_movement', 'camera_controls', 'farm_plots',
            'planting_seeds', 'plant_growth', 'watering_plants', 'harvesting',
            'inventory_management', 'marketplace_intro', 'selling_crops',
            'buying_seeds', 'changing_plant_types', 'unlocking_plots',
            'objectives_system', 'day_night_cycle', 'weather_system',
            'seasons_system', 'animals_intro', 'daily_quests',
            'equipment_intro', 'game_menu', 'mobile_controls', 'tutorial_complete'
        ];

        result.tutorialSteps.total = expectedSteps.length;
        result.tutorialSteps.translated = 0;

        for (const stepId of expectedSteps) {
            if (steps[stepId]) {
                const step = steps[stepId];
                
                // Check required fields
                if (step.title && step.description) {
                    result.tutorialSteps.translated++;
                } else {
                    result.tutorialSteps.missing.push(stepId);
                    result.warnings.push(`Tutorial step ${stepId} is incomplete`);
                }
                
                // Validate hints if present
                if (step.hints && !Array.isArray(step.hints)) {
                    result.warnings.push(`Tutorial step ${stepId} hints should be an array`);
                }
            } else {
                result.tutorialSteps.missing.push(stepId);
                result.errors.push(`Missing tutorial step: ${stepId}`);
            }
        }
    }

    /**
     * Validate metadata
     */
    validateMetadata(langData, result) {
        if (!langData.meta) {
            result.errors.push('Missing metadata section');
            return;
        }

        const meta = langData.meta;
        const requiredFields = ['language', 'name', 'flag', 'code', 'completion'];
        
        for (const field of requiredFields) {
            if (meta[field] === undefined) {
                result.errors.push(`Missing metadata field: ${field}`);
            }
        }

        // Validate completion percentage
        if (typeof meta.completion === 'number') {
            if (meta.completion < 0 || meta.completion > 100) {
                result.warnings.push('Completion percentage should be between 0 and 100');
            }
        }

        // Validate language code consistency
        if (meta.code && meta.language && meta.code !== meta.language) {
            result.warnings.push('Language code and language field do not match');
        }
    }

    /**
     * Extract all keys from a nested object
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
     * Generate recommendations based on validation results
     */
    generateRecommendations(results) {
        const recommendations = [];
        
        // Check overall completion
        const completionRates = Array.from(results.languages.values())
            .filter(lang => lang.completeness !== undefined)
            .map(lang => lang.completeness);
        
        const avgCompletion = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;
        
        if (avgCompletion < 90) {
            recommendations.push({
                type: 'high',
                message: `Average translation completion is ${avgCompletion.toFixed(1)}%. Consider improving translations.`
            });
        }

        // Check for languages with many missing translations
        for (const [langCode, langResult] of results.languages) {
            if (langResult.missingKeys && langResult.missingKeys.length > 10) {
                recommendations.push({
                    type: 'medium',
                    message: `Language ${langCode} is missing ${langResult.missingKeys.length} translations.`
                });
            }
        }

        // Check for tutorial step completeness
        for (const [langCode, langResult] of results.languages) {
            if (langResult.tutorialSteps && langResult.tutorialSteps.missing.length > 0) {
                recommendations.push({
                    type: 'high',
                    message: `Language ${langCode} is missing ${langResult.tutorialSteps.missing.length} tutorial steps.`
                });
            }
        }

        return recommendations;
    }

    /**
     * Print validation report to console
     */
    printValidationReport(results) {
        console.log('\n🔍 Tutorial Localization Validation Report');
        console.log('═══════════════════════════════════════════');
        
        console.log(`📊 Summary:`);
        console.log(`   Total Languages: ${results.summary.totalLanguages}`);
        console.log(`   Valid Languages: ${results.summary.validLanguages}`);
        console.log(`   Total Warnings: ${results.summary.warnings}`);
        console.log(`   Total Errors: ${results.summary.errors}`);
        
        console.log('\n📋 Language Details:');
        for (const [langCode, langResult] of results.languages) {
            const status = langResult.isValid ? '✅' : '❌';
            const completion = langResult.completeness !== undefined ? ` (${langResult.completeness.toFixed(1)}%)` : '';
            
            console.log(`   ${status} ${langCode.toUpperCase()}${completion}`);
            
            if (langResult.errors.length > 0) {
                console.log(`      Errors: ${langResult.errors.join(', ')}`);
            }
            
            if (langResult.warnings.length > 0) {
                console.log(`      Warnings: ${langResult.warnings.length}`);
            }
            
            if (langResult.tutorialSteps) {
                const stepCompletion = (langResult.tutorialSteps.translated / langResult.tutorialSteps.total) * 100;
                console.log(`      Tutorial Steps: ${langResult.tutorialSteps.translated}/${langResult.tutorialSteps.total} (${stepCompletion.toFixed(1)}%)`);
            }
        }
        
        if (results.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            for (const rec of results.recommendations) {
                const priority = rec.type === 'high' ? '🔴' : rec.type === 'medium' ? '🟡' : '🟢';
                console.log(`   ${priority} ${rec.message}`);
            }
        }
        
        console.log('\n═══════════════════════════════════════════\n');
    }

    /**
     * Get validation results
     */
    getValidationResults() {
        return this.validationResults;
    }

    /**
     * Export validation results as JSON
     */
    exportResults() {
        return JSON.stringify(this.validationResults, (key, value) => {
            if (value instanceof Map) {
                return Object.fromEntries(value);
            }
            return value;
        }, 2);
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.TutorialLocalizationValidator = TutorialLocalizationValidator;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialLocalizationValidator;
}