/**
 * Tutorial Localization
 * Enhanced multi-language support for the tutorial system
 * Now integrated with JSON-based internationalization system
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
        },
        de: {
            name: 'Deutsch',
            flag: '🇩🇪',
            code: 'de'
        },
        it: {
            name: 'Italiano',
            flag: '🇮🇹',
            code: 'it'
        },
        pt: {
            name: 'Português',
            flag: '🇵🇹',
            code: 'pt'
        }
    },

    // Integration with main i18n system
    i18nIntegration: {
        enabled: false,
        fallbackMode: true
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
                    description: 'Welcome to your new farm! You\'re about to learn how to grow crops, manage animals, and build a thriving agricultural business. This tutorial will guide you through all the essential game mechanics step by step.',
                    hints: [
                        'You can skip any step by clicking "Skip Step"',
                        'Use keyboard arrows to navigate between steps',
                        'Press ESC to exit the tutorial at any time'
                    ]
                },
                character_movement: {
                    title: 'Moving Your Character',
                    description: 'Let\'s start by learning how to move around your farm! Desktop: Use ZQSD keys or arrow keys to move. Mobile: Use the virtual joystick in the bottom-left corner. Try moving your character around now. Notice how the camera follows you!',
                    hints: [
                        'The character position is shown in the top-right corner',
                        'You can drag the mouse to rotate the camera view',
                        'Scroll wheel zooms in and out'
                    ]
                },
                planting_basics: {
                    title: 'Planting Your First Crop',
                    description: 'Now let\'s plant your first seeds! Desktop: Get close to a plot and press SPACE to plant. Mobile: Get close to a plot and tap the green plant button.',
                    hints: [
                        'You need to be close to a plot to plant',
                        'Each plant type has different growth times',
                        'Make sure you have seeds in your inventory'
                    ]
                },
                watering_plants: {
                    title: 'Watering Your Plants',
                    description: 'Plants need water to grow! Desktop: Press E near plants to water them. Mobile: Tap the blue water button near plants.',
                    hints: [
                        'Watered plants grow faster',
                        'Rain will automatically water your plants',
                        'You can see if plants need water by their appearance'
                    ]
                },
                harvesting_crops: {
                    title: 'Harvesting Your Crops',
                    description: 'When plants are fully grown, you can harvest them! Desktop: Press SPACE near mature plants. Mobile: Tap the green button near mature plants.',
                    hints: [
                        'Mature plants have a golden glow',
                        'Harvested crops go to your inventory',
                        'You can sell crops at the marketplace'
                    ]
                },
                managing_inventory: {
                    title: 'Managing Your Inventory',
                    description: 'Your inventory shows all your crops, seeds, and equipment. Desktop: Check the inventory panel on the left. Mobile: Tap the inventory button in the bottom menu.',
                    hints: [
                        'Seeds are needed for planting',
                        'Crops can be sold for coins',
                        'Equipment helps automate your farm'
                    ]
                },
                using_marketplace: {
                    title: 'Using the Marketplace',
                    description: 'The marketplace is where you buy seeds and sell crops! Desktop: Check the marketplace panel on the right. Mobile: Tap the market button in the bottom menu.',
                    hints: [
                        'Sell crops to earn coins',
                        'Buy seeds to plant more crops',
                        'Prices change based on supply and demand'
                    ]
                }
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

            // Step-specific content
            steps: {
                welcome: {
                    title: 'Bienvenue dans Pixel-Harvest !',
                    description: 'Bienvenue dans votre nouvelle ferme ! Vous allez apprendre à cultiver des récoltes, gérer des animaux et construire une entreprise agricole prospère. Ce tutoriel vous guidera à travers toutes les mécaniques essentielles du jeu étape par étape.',
                    hints: [
                        'Vous pouvez passer n\'importe quelle étape en cliquant sur "Passer l\'étape"',
                        'Utilisez les flèches du clavier pour naviguer entre les étapes',
                        'Appuyez sur ESC pour quitter le tutoriel à tout moment'
                    ]
                },
                character_movement: {
                    title: 'Déplacer votre personnage',
                    description: 'Commençons par apprendre à vous déplacer dans votre ferme ! Bureau : Utilisez les touches ZQSD ou les flèches pour vous déplacer. Mobile : Utilisez le joystick virtuel dans le coin inférieur gauche. Essayez de déplacer votre personnage maintenant. Remarquez comme la caméra vous suit !',
                    hints: [
                        'La position du personnage est affichée dans le coin supérieur droit',
                        'Vous pouvez faire glisser la souris pour faire pivoter la vue de la caméra',
                        'La molette de la souris permet de zoomer'
                    ]
                },
                planting_basics: {
                    title: 'Planter votre première récolte',
                    description: 'Maintenant plantons vos premières graines ! Bureau : Approchez-vous d\'une parcelle et appuyez sur ESPACE pour planter. Mobile : Approchez-vous d\'une parcelle et appuyez sur le bouton vert de plantation.',
                    hints: [
                        'Vous devez être proche d\'une parcelle pour planter',
                        'Chaque type de plante a des temps de croissance différents',
                        'Assurez-vous d\'avoir des graines dans votre inventaire'
                    ]
                },
                watering_plants: {
                    title: 'Arroser vos plantes',
                    description: 'Les plantes ont besoin d\'eau pour pousser ! Bureau : Appuyez sur E près des plantes pour les arroser. Mobile : Appuyez sur le bouton bleu d\'arrosage près des plantes.',
                    hints: [
                        'Les plantes arrosées poussent plus vite',
                        'La pluie arrosera automatiquement vos plantes',
                        'Vous pouvez voir si les plantes ont besoin d\'eau par leur apparence'
                    ]
                },
                harvesting_crops: {
                    title: 'Récolter vos cultures',
                    description: 'Quand les plantes sont complètement développées, vous pouvez les récolter ! Bureau : Appuyez sur ESPACE près des plantes matures. Mobile : Appuyez sur le bouton vert près des plantes matures.',
                    hints: [
                        'Les plantes matures ont une lueur dorée',
                        'Les récoltes vont dans votre inventaire',
                        'Vous pouvez vendre les récoltes au marché'
                    ]
                },
                managing_inventory: {
                    title: 'Gérer votre inventaire',
                    description: 'Votre inventaire montre toutes vos récoltes, graines et équipements. Bureau : Vérifiez le panneau d\'inventaire à gauche. Mobile : Appuyez sur le bouton d\'inventaire dans le menu du bas.',
                    hints: [
                        'Les graines sont nécessaires pour planter',
                        'Les récoltes peuvent être vendues contre des pièces',
                        'L\'équipement aide à automatiser votre ferme'
                    ]
                },
                using_marketplace: {
                    title: 'Utiliser le marché',
                    description: 'Le marché est l\'endroit où vous achetez des graines et vendez des récoltes ! Bureau : Vérifiez le panneau du marché à droite. Mobile : Appuyez sur le bouton marché dans le menu du bas.',
                    hints: [
                        'Vendez les récoltes pour gagner des pièces',
                        'Achetez des graines pour planter plus de récoltes',
                        'Les prix changent selon l\'offre et la demande'
                    ]
                }
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

            // Step-specific content
            steps: {
                welcome: {
                    title: '¡Bienvenido a Pixel-Harvest!',
                    description: '¡Bienvenido a tu nueva granja! Vas a aprender cómo cultivar cosechas, manejar animales y construir un próspero negocio agrícola. Este tutorial te guiará paso a paso por todas las mecánicas esenciales del juego.',
                    hints: [
                        'Puedes saltar cualquier paso haciendo clic en "Saltar paso"',
                        'Usa las flechas del teclado para navegar entre pasos',
                        'Presiona ESC para salir del tutorial en cualquier momento'
                    ]
                },
                character_movement: {
                    title: 'Mover tu personaje',
                    description: '¡Empecemos aprendiendo cómo moverte por tu granja! Escritorio: Usa las teclas ZQSD o las flechas para moverte. Móvil: Usa el joystick virtual en la esquina inferior izquierda. ¡Prueba a mover tu personaje ahora. Observa cómo la cámara te sigue!',
                    hints: [
                        'La posición del personaje se muestra en la esquina superior derecha',
                        'Puedes arrastrar el ratón para rotar la vista de la cámara',
                        'La rueda del ratón permite hacer zoom'
                    ]
                },
                planting_basics: {
                    title: 'Plantar tu primera cosecha',
                    description: '¡Ahora plantemos tus primeras semillas! Escritorio: Acércate a una parcela y presiona ESPACIO para plantar. Móvil: Acércate a una parcela y toca el botón verde de plantar.',
                    hints: [
                        'Necesitas estar cerca de una parcela para plantar',
                        'Cada tipo de planta tiene diferentes tiempos de crecimiento',
                        'Asegúrate de tener semillas en tu inventario'
                    ]
                },
                watering_plants: {
                    title: 'Regar tus plantas',
                    description: '¡Las plantas necesitan agua para crecer! Escritorio: Presiona E cerca de las plantas para regarlas. Móvil: Toca el botón azul de regar cerca de las plantas.',
                    hints: [
                        'Las plantas regadas crecen más rápido',
                        'La lluvia regará automáticamente tus plantas',
                        'Puedes ver si las plantas necesitan agua por su apariencia'
                    ]
                },
                harvesting_crops: {
                    title: 'Cosechar tus cultivos',
                    description: '¡Cuando las plantas están completamente desarrolladas, puedes cosecharlas! Escritorio: Presiona ESPACIO cerca de plantas maduras. Móvil: Toca el botón verde cerca de plantas maduras.',
                    hints: [
                        'Las plantas maduras tienen un brillo dorado',
                        'Los cultivos cosechados van a tu inventario',
                        'Puedes vender cultivos en el mercado'
                    ]
                },
                managing_inventory: {
                    title: 'Gestionar tu inventario',
                    description: 'Tu inventario muestra todos tus cultivos, semillas y equipamiento. Escritorio: Revisa el panel de inventario a la izquierda. Móvil: Toca el botón de inventario en el menú inferior.',
                    hints: [
                        'Las semillas son necesarias para plantar',
                        'Los cultivos se pueden vender por monedas',
                        'El equipamiento ayuda a automatizar tu granja'
                    ]
                },
                using_marketplace: {
                    title: 'Usar el mercado',
                    description: '¡El mercado es donde compras semillas y vendes cultivos! Escritorio: Revisa el panel del mercado a la derecha. Móvil: Toca el botón de mercado en el menú inferior.',
                    hints: [
                        'Vende cultivos para ganar monedas',
                        'Compra semillas para plantar más cultivos',
                        'Los precios cambian según la oferta y demanda'
                    ]
                }
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
        // Try to use main i18n system first if available and enabled
        if (this.i18nIntegration.enabled && window.i18n && window.i18n.isInitialized) {
            try {
                const translation = window.i18n.t(`tutorial.${key}`, params);
                if (translation && translation !== `tutorial.${key}`) {
                    return translation;
                }
            } catch (error) {
                console.warn('Failed to get translation from main i18n system:', error);
            }
        }

        // Fallback to legacy translation system
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
        if (this.translations[languageCode] || this.i18nIntegration.enabled) {
            const oldLanguage = this.currentLanguage;
            this.currentLanguage = languageCode;
            
            // Sync with main i18n system if available
            if (this.i18nIntegration.enabled && window.i18n && window.i18n.setLanguage) {
                window.i18n.setLanguage(languageCode).catch(error => {
                    console.warn('Failed to sync language with main i18n system:', error);
                });
            }
            
            this.updateUI();
            localStorage.setItem('pixelHarvestLanguage', languageCode);
            console.log(`Tutorial language changed from ${oldLanguage} to: ${languageCode}`);
            
            // Emit event for other systems
            document.dispatchEvent(new CustomEvent('tutorialLanguageChanged', {
                detail: { oldLanguage, newLanguage: languageCode }
            }));
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
     * Load language preference from localStorage and sync with main i18n system
     */
    loadLanguagePreference() {
        // First try to get language from main i18n system if available
        if (this.i18nIntegration.enabled && window.i18n && window.i18n.getCurrentLanguage) {
            try {
                const currentLang = window.i18n.getCurrentLanguage();
                if (currentLang && currentLang.code) {
                    this.currentLanguage = currentLang.code;
                    return;
                }
            } catch (error) {
                console.warn('Failed to sync language from main i18n system:', error);
            }
        }

        // Fallback to localStorage and browser detection
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
     * Get localized tutorial steps using the enhanced system
     * @returns {Object} - Localized tutorial steps
     */
    getLocalizedSteps() {
        // Try to get steps from main i18n system first
        if (this.i18nIntegration.enabled && window.i18n && window.i18n.isInitialized) {
            try {
                const steps = window.i18n.getLocalizedTutorialSteps();
                if (steps && steps.length > 0) {
                    return steps;
                }
            } catch (error) {
                console.warn('Failed to get localized steps from main i18n system:', error);
            }
        }

        // Fallback to legacy system
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
        // Check if main i18n system is available
        if (window.i18n) {
            this.i18nIntegration.enabled = true;
            console.log('🔗 Tutorial localization integrated with main i18n system');
            
            // Listen for language changes from main system
            if (window.i18n.on) {
                window.i18n.on('languageChanged', (data) => {
                    if (data.newLanguage !== this.currentLanguage) {
                        this.currentLanguage = data.newLanguage;
                        this.updateUI();
                    }
                });
            }
        } else {
            console.log('📚 Tutorial localization running in standalone mode');
        }

        this.loadLanguagePreference();
        this.updateUI();
        
        // Listen for language changes from game settings
        document.addEventListener('languageChanged', (event) => {
            this.setLanguage(event.detail.language);
        });
        
        // Listen for main i18n system initialization
        document.addEventListener('i18nInitialized', () => {
            if (window.i18n && !this.i18nIntegration.enabled) {
                this.i18nIntegration.enabled = true;
                console.log('🔗 Tutorial localization connected to main i18n system');
                this.updateUI();
            }
        });
        
        console.log(`Tutorial localization initialized with language: ${this.currentLanguage}`);
    },

    /**
     * Enable or disable integration with main i18n system
     * @param {boolean} enabled - Whether to enable integration
     */
    setI18nIntegration(enabled) {
        this.i18nIntegration.enabled = enabled;
        console.log(`Tutorial i18n integration ${enabled ? 'enabled' : 'disabled'}`);
        this.updateUI();
    }
};

// Export for use in tutorial system
if (typeof window !== 'undefined') {
    window.TutorialLocalization = TutorialLocalization;
}