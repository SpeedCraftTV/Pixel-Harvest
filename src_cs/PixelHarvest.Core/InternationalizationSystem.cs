using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PixelHarvest.Core
{
    public class LanguageMeta
    {
        public string Code { get; set; } = "";
        public string? Name { get; set; }
    }

    public class InternationalizationSystem
    {
        private readonly string _translationsPath;
        private readonly Dictionary<string, JsonElement> _loadedTranslations = new();
        private readonly Dictionary<string, string> _translationCache = new();
        private string _currentLanguage = "en";
        private readonly string _fallbackLanguage = "en";
        private readonly List<string> _supportedLanguages = new() { "en", "fr", "es", "de", "it", "pt" };

        public InternationalizationSystem(string translationsPath)
        {
            _translationsPath = translationsPath;
        }

        public async Task InitializeAsync()
        {
            await LoadLanguageMetadataAsync();
            await DetermineInitialLanguageAsync();
            await LoadLanguageAsync(_currentLanguage);
        }

        private async Task LoadLanguageMetadataAsync()
        {
            // Attempt to load available translation files
            foreach (var lang in _supportedLanguages)
            {
                var file = Path.Combine(_translationsPath, lang + ".json");
                if (File.Exists(file))
                {
                    try
                    {
                        using var fs = File.OpenRead(file);
                        var doc = await JsonDocument.ParseAsync(fs);
                        _loadedTranslations[lang] = doc.RootElement.Clone();
                    }
                    catch
                    {
                        // ignore errors for metadata pass
                    }
                }
            }
        }

        private Task DetermineInitialLanguageAsync()
        {
            // Desktop/engine environment: default to fallback
            _currentLanguage = _fallbackLanguage;
            return Task.CompletedTask;
        }

        public IEnumerable<LanguageMeta> GetAvailableLanguages()
        {
            return _loadedTranslations.Keys.Select(k => new LanguageMeta { Code = k, Name = null });
        }

        public LanguageMeta GetCurrentLanguage()
        {
            return new LanguageMeta { Code = _currentLanguage };
        }

        public async Task<bool> LoadLanguageAsync(string langCode)
        {
            if (!_supportedLanguages.Contains(langCode)) return false;
            if (_loadedTranslations.ContainsKey(langCode)) return true;

            var file = Path.Combine(_translationsPath, langCode + ".json");
            if (!File.Exists(file)) return false;

            using var fs = File.OpenRead(file);
            var doc = await JsonDocument.ParseAsync(fs);
            _loadedTranslations[langCode] = doc.RootElement.Clone();
            _translationCache.Clear();
            return true;
        }

        public async Task<bool> SetLanguageAsync(string langCode)
        {
            if (langCode == _currentLanguage) return true;
            var ok = await LoadLanguageAsync(langCode);
            if (ok)
            {
                _currentLanguage = langCode;
                _translationCache.Clear();
                return true;
            }
            return false;
        }

        public string T(string key, Dictionary<string, object>? parameters = null)
        {
            parameters ??= new Dictionary<string, object>();
            var cacheKey = $"{_currentLanguage}:{key}:{JsonSerializer.Serialize(parameters)}";
            if (_translationCache.TryGetValue(cacheKey, out var cached)) return cached;

            var translation = GetTranslation(key, _currentLanguage);
            if (translation == null && _currentLanguage != _fallbackLanguage)
            {
                translation = GetTranslation(key, _fallbackLanguage);
            }

            if (translation == null)
            {
                translation = key;
            }

            var result = InterpolateString(translation, parameters);
            _translationCache[cacheKey] = result;
            return result;
        }

        private string? GetTranslation(string key, string langCode)
        {
            if (!_loadedTranslations.TryGetValue(langCode, out var root)) return null;

            var parts = key.Split('.');
            JsonElement current = root;
            foreach (var p in parts)
            {
                if (current.ValueKind == JsonValueKind.Object && current.TryGetProperty(p, out var next))
                {
                    current = next;
                }
                else
                {
                    return null;
                }
            }

            if (current.ValueKind == JsonValueKind.String) return current.GetString();
            // For simplicity, return raw JSON for non-string nodes
            return current.GetRawText();
        }

        private static readonly Regex _paramRegex = new("\\{(\\w+)\\}");

        private string InterpolateString(string template, Dictionary<string, object> parameters)
        {
            return _paramRegex.Replace(template, match =>
            {
                var name = match.Groups[1].Value;
                if (parameters.TryGetValue(name, out var val)) return val?.ToString() ?? string.Empty;
                return match.Value;
            });
        }
    }
}
