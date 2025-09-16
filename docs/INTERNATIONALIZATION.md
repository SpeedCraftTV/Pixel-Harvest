# JSON-Based Internationalization System Documentation

## Overview

The Pixel-Harvest internationalization (i18n) system provides comprehensive multi-language support with a focus on tutorial localization. The system is built around JSON translation files and supports dynamic language switching, fallback mechanisms, and validation tools.

## Architecture

### Core Components

1. **Main I18n System** (`src/internationalization.js`)
   - Dynamic JSON loading
   - Language detection and persistence
   - String interpolation and pluralization
   - Event-driven updates
   - Translation validation

2. **Tutorial Localization** (`src/tutorial/tutorial-localization.js`)
   - Legacy compatibility layer
   - Enhanced tutorial-specific features
   - Integration with main i18n system

3. **Validation System** (`src/tutorial/tutorial-validator.js`)
   - Translation completeness checking
   - Structure validation
   - Automated reporting

### Translation Files Structure

```
data/localization/
├── en.json    # Base language (English)
├── fr.json    # French translations
└── es.json    # Spanish translations
```

Each JSON file contains:

```json
{
  "meta": {
    "language": "en",
    "name": "English",
    "flag": "🇺🇸",
    "code": "en",
    "completion": 100,
    "contributors": ["Pixel-Harvest Team"],
    "lastUpdated": "2024-12-19"
  },
  "ui": {
    "common": { /* Common UI elements */ },
    "game": { /* Game-specific UI */ },
    "menu": { /* Menu items */ },
    "instructions": { /* Platform-specific instructions */ }
  },
  "tutorial": {
    "ui": { /* Tutorial UI elements */ },
    "welcome": { /* Welcome screen */ },
    "completion": { /* Completion screen */ },
    "steps": { /* All tutorial steps */ }
  },
  "game": {
    "plants": { /* Plant names */ },
    "animals": { /* Animal names */ },
    "equipment": { /* Equipment names */ },
    "weather": { /* Weather conditions */ },
    "seasons": { /* Season names */ },
    "objectives": { /* Objective templates */ }
  },
  "messages": {
    "errors": { /* Error messages */ },
    "success": { /* Success messages */ },
    "info": { /* Information messages */ }
  }
}
```

## Usage

### Basic Translation

```javascript
// Get a simple translation
const welcomeText = window.i18n.t('tutorial.welcome.title');

// Get translation with parameters
const stepText = window.i18n.t('tutorial.ui.stepOf', { 
  current: 3, 
  total: 24 
});

// Using the global convenience function
const errorMsg = t('messages.errors.notEnoughCoins');
```

### Language Switching

```javascript
// Change language programmatically
await window.i18n.setLanguage('fr');

// Check current language
const currentLang = window.i18n.getCurrentLanguage();

// Get available languages
const languages = window.i18n.getAvailableLanguages();
```

### Event Handling

```javascript
// Listen for language changes
window.i18n.on('languageChanged', (data) => {
  console.log(`Language changed from ${data.oldLanguage} to ${data.newLanguage}`);
});

// Listen for initialization
window.i18n.on('initialized', (data) => {
  console.log(`I18n system initialized with language: ${data.language}`);
});
```

### HTML Integration

Use `data-translate` attributes for automatic translation:

```html
<button data-translate="ui.common.save">Save</button>
<span data-translate="tutorial.ui.stepOf" 
      data-translate-current="1" 
      data-translate-total="10">Step 1 of 10</span>
```

## Tutorial System Integration

### Tutorial Step Structure

Each tutorial step in the JSON files follows this structure:

```json
{
  "tutorial": {
    "steps": {
      "welcome": {
        "title": "Welcome to Pixel-Harvest!",
        "description": "Welcome to your new farm! You're about to learn...",
        "hints": [
          "You can skip any step by clicking \"Skip Step\"",
          "Use keyboard arrows to navigate between steps"
        ]
      }
    }
  }
}
```

### Getting Localized Tutorial Steps

```javascript
// Get all localized tutorial steps
const steps = window.i18n.getLocalizedTutorialSteps();

// Or via tutorial localization system
const steps = window.TutorialLocalization.getLocalizedSteps();
```

## Validation and Testing

### Automatic Validation

```javascript
// Validate all translations
const validator = new TutorialLocalizationValidator();
const results = await validator.validateAllTranslations();

// Check specific language
const langResult = await validator.validateLanguage('fr');
```

### Using the Test Script

```bash
# Run comprehensive validation
./test-i18n.sh
```

### Browser Console Testing

```javascript
// Quick validation
window.i18n.validateTranslations();

// Debug information
console.log(window.i18n.getDebugInfo());

// Clear translation cache
window.i18n.clearCache();
```

## Configuration

### I18n System Configuration

```javascript
window.i18n.config = {
  translationsPath: './data/localization/',
  supportedLanguages: ['en', 'fr', 'es'],
  autoDetectBrowser: true,
  persistLanguage: true,
  enableFallback: true,
  enablePluralization: true,
  enableInterpolation: true
};
```

### Tutorial Integration Settings

```javascript
// Enable/disable main i18n integration
window.TutorialLocalization.setI18nIntegration(true);
```

## Adding New Languages

1. **Create Translation File**
   ```bash
   cp data/localization/en.json data/localization/de.json
   ```

2. **Update Metadata**
   ```json
   {
     "meta": {
       "language": "de",
       "name": "Deutsch", 
       "flag": "🇩🇪",
       "code": "de",
       "completion": 0
     }
   }
   ```

3. **Translate Content**
   - Translate all text values
   - Keep structure identical to English
   - Update completion percentage

4. **Add Language Support**
   ```javascript
   // Add to supported languages
   window.i18n.config.supportedLanguages.push('de');
   ```

5. **Update UI**
   ```html
   <!-- Add to language selector -->
   <option value="de">🇩🇪 Deutsch</option>
   ```

6. **Validate**
   ```bash
   ./test-i18n.sh
   ```

## Advanced Features

### String Interpolation

```javascript
// In JSON
"welcome_message": "Welcome {name} to {gameName}!"

// In code
const msg = t('welcome_message', { 
  name: 'Player', 
  gameName: 'Pixel-Harvest' 
});
```

### Pluralization

```javascript
// In JSON (simple)
"items_count": "You have {count} items"

// In JSON (complex)
"items_count": {
  "one": "You have 1 item",
  "other": "You have {count} items"
}

// In code
const msg = t('items_count', { count: 5 });
```

### Fallback Handling

The system automatically falls back to English if:
- A translation key is missing
- A language file fails to load
- An interpolation parameter is missing

### Performance Optimization

- **Translation Caching**: Translations are cached after first use
- **Lazy Loading**: Language files loaded on demand
- **Preloading**: Critical languages can be preloaded
- **MutationObserver**: Automatic DOM updates for new elements

## Troubleshooting

### Common Issues

1. **Translation Not Found**
   ```javascript
   // Check if key exists
   const translation = window.i18n.getTranslation('tutorial.welcome.title', 'en');
   if (!translation) {
     console.warn('Translation key not found');
   }
   ```

2. **Language Not Loading**
   ```javascript
   // Check network requests in browser dev tools
   // Verify JSON file syntax
   // Check browser console for errors
   ```

3. **UI Not Updating**
   ```javascript
   // Manually trigger update
   window.i18n.updateAllUIElements();
   
   // Check for data-translate attributes
   // Verify event listeners are attached
   ```

### Debug Mode

Enable debug logging:

```javascript
window.i18n.config.debug = true;
```

## Best Practices

1. **Translation Keys**
   - Use descriptive, hierarchical keys
   - Follow consistent naming conventions
   - Group related translations

2. **Content Guidelines**
   - Keep text concise but clear
   - Consider cultural differences
   - Use appropriate tone for target audience

3. **Testing**
   - Test all languages regularly
   - Validate translation completeness
   - Check UI layout with different text lengths

4. **Maintenance**
   - Keep completion percentages updated
   - Document translation changes
   - Regular validation runs

## Contributing

When adding or modifying translations:

1. Update all supported languages
2. Run validation tests
3. Update completion percentages
4. Test in browser
5. Document changes

For new features:

1. Extend JSON structure consistently
2. Update validation rules
3. Add documentation
4. Write tests

## Support

The internationalization system provides comprehensive logging and debugging tools. Check the browser console for detailed information about translation loading, errors, and validation results.