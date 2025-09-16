#!/bin/bash

# Tutorial Localization Testing Script
# Tests the internationalization system for completeness and functionality

echo "🌍 Pixel-Harvest Internationalization System Test"
echo "=================================================="

# Check if required files exist
echo "📁 Checking required files..."

REQUIRED_FILES=(
    "data/localization/en.json"
    "data/localization/fr.json" 
    "data/localization/es.json"
    "src/internationalization.js"
    "src/tutorial/tutorial-localization.js"
    "src/tutorial/tutorial-validator.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "📊 Validating JSON files..."

# Validate JSON syntax
for lang in en fr es; do
    if python3 -m json.tool "data/localization/${lang}.json" > /dev/null 2>&1; then
        echo "✅ ${lang}.json has valid JSON syntax"
    else
        echo "❌ ${lang}.json has invalid JSON syntax"
        exit 1
    fi
done

echo ""
echo "🔍 Analyzing translation completeness..."

# Count keys in each language file
EN_KEYS=$(python3 -c "
import json
import sys
def count_keys(obj, prefix=''):
    count = 0
    for key, value in obj.items():
        if isinstance(value, dict):
            count += count_keys(value, f'{prefix}.{key}' if prefix else key)
        else:
            count += 1
    return count

with open('data/localization/en.json', 'r') as f:
    data = json.load(f)
    print(count_keys(data))
")

for lang in fr es; do
    LANG_KEYS=$(python3 -c "
import json
import sys
def count_keys(obj, prefix=''):
    count = 0
    for key, value in obj.items():
        if isinstance(value, dict):
            count += count_keys(value, f'{prefix}.{key}' if prefix else key)
        else:
            count += 1
    return count

with open('data/localization/${lang}.json', 'r') as f:
    data = json.load(f)
    print(count_keys(data))
")
    
    COMPLETION=$(python3 -c "print(round(${LANG_KEYS} / ${EN_KEYS} * 100, 1))")
    echo "📈 ${lang}.json: ${LANG_KEYS}/${EN_KEYS} keys (${COMPLETION}% complete)"
done

echo ""
echo "🎓 Checking tutorial steps..."

# Check tutorial steps in each language
for lang in en fr es; do
    TUTORIAL_STEPS=$(python3 -c "
import json
with open('data/localization/${lang}.json', 'r') as f:
    data = json.load(f)
    steps = data.get('tutorial', {}).get('steps', {})
    print(len(steps))
")
    echo "📚 ${lang}.json: ${TUTORIAL_STEPS} tutorial steps"
done

echo ""
echo "🌐 Checking language metadata..."

for lang in en fr es; do
    METADATA=$(python3 -c "
import json
with open('data/localization/${lang}.json', 'r') as f:
    data = json.load(f)
    meta = data.get('meta', {})
    name = meta.get('name', 'Unknown')
    flag = meta.get('flag', '❓')
    completion = meta.get('completion', 0)
    print(f'{flag} {name} ({completion}%)')
")
    echo "🏷️  ${lang}: ${METADATA}"
done

echo ""
echo "📝 Generating validation report..."

# Create a simple validation report
python3 -c "
import json
import sys

languages = ['en', 'fr', 'es']
report = {}

# Load all language data
data = {}
for lang in languages:
    with open(f'data/localization/{lang}.json', 'r') as f:
        data[lang] = json.load(f)

# Get all keys from English (base language)
def get_all_keys(obj, prefix=''):
    keys = []
    for key, value in obj.items():
        full_key = f'{prefix}.{key}' if prefix else key
        if isinstance(value, dict):
            keys.extend(get_all_keys(value, full_key))
        else:
            keys.append(full_key)
    return keys

en_keys = set(get_all_keys(data['en']))

print('📊 Translation Completeness Report')
print('=' * 50)

for lang in languages:
    if lang == 'en':
        continue
    
    lang_keys = set(get_all_keys(data[lang]))
    missing = en_keys - lang_keys
    extra = lang_keys - en_keys
    completion = (len(lang_keys & en_keys) / len(en_keys)) * 100
    
    print(f'\\n{lang.upper()}:')
    print(f'  Completion: {completion:.1f}%')
    print(f'  Missing keys: {len(missing)}')
    print(f'  Extra keys: {len(extra)}')
    
    if missing and len(missing) <= 5:
        print(f'  Missing: {list(missing)[:5]}')
    
    # Check tutorial steps specifically
    en_tutorial_steps = set(data['en'].get('tutorial', {}).get('steps', {}).keys())
    lang_tutorial_steps = set(data[lang].get('tutorial', {}).get('steps', {}).keys())
    missing_tutorial = en_tutorial_steps - lang_tutorial_steps
    
    print(f'  Tutorial steps: {len(lang_tutorial_steps)}/{len(en_tutorial_steps)}')
    if missing_tutorial:
        print(f'  Missing tutorial steps: {len(missing_tutorial)}')
"

echo ""
echo "✅ Internationalization system validation complete!"
echo ""
echo "🚀 To test the system manually:"
echo "   1. Open index.html in a web browser"
echo "   2. Open browser console (F12)"
echo "   3. Run: window.i18n.validateTranslations()"
echo "   4. Test language switching via the menu"
echo "   5. Start the tutorial to test localized content"
echo ""
echo "📖 For detailed validation, run in browser console:"
echo "   const validator = new TutorialLocalizationValidator();"
echo "   validator.validateAllTranslations().then(console.log);"