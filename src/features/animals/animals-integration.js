/**
 * Animals Integration System
 * Integrates the enhanced animals module with the main game
 */

class AnimalsIntegration {
    constructor() {
        this.initialized = false;
        this.gameFeatures = null;
        this.saveDataKey = 'enhancedAnimalsData';
    }

    async initialize() {
        if (this.initialized) return;

        console.log('Initializing Animals Integration...');

        // Check if enhanced animals feature is enabled
        if (!this.isFeatureEnabled()) {
            console.log('Enhanced animals feature is disabled');
            return;
        }

        try {
            // Initialize all subsystems
            await this.initializeSubsystems();
            
            // Integrate with existing game systems
            this.integrateWithGameSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load saved data
            this.loadSavedData();
            
            // Start update loops
            this.startUpdateLoops();
            
            this.initialized = true;
            console.log('Animals Integration initialized successfully');
            
            // Show initialization message
            if (window.showInstruction) {
                window.showInstruction('Enhanced Animals System activated! 🐄🐑🐴', 4000);
            }
            
        } catch (error) {
            console.error('Failed to initialize Animals Integration:', error);
        }
    }

    isFeatureEnabled() {
        // Check feature flags
        this.gameFeatures = window.gameFeatures || window.features;
        return this.gameFeatures?.enhanced_animals?.enabled || 
               this.gameFeatures?.features?.enhanced_animals?.enabled || 
               false;
    }

    async initializeSubsystems() {
        // Initialize core animals module
        if (!window.animalsModule) {
            window.animalsModule = new AnimalsModule();
        }
        await window.animalsModule.initialize();

        // Initialize extended species system
        if (!window.extendedSpeciesSystem) {
            window.extendedSpeciesSystem = new ExtendedSpeciesSystem();
        }
        window.extendedSpeciesSystem.initialize();

        // Initialize UI
        if (!window.animalsUI.initialized) {
            window.animalsUI.initialize();
        }

        // Add extended species to main animals module
        this.integrateExtendedSpecies();
    }

    integrateExtendedSpecies() {
        const extendedSpecies = window.extendedSpeciesSystem.getAllSpecies();
        
        for (const species of extendedSpecies) {
            if (!window.animalsModule.species.has(species.species)) {
                window.animalsModule.species.set(species.species, species);
            }
        }
    }

    integrateWithGameSystems() {
        // Enhance existing updateAnimals function
        this.enhanceUpdateAnimals();
        
        // Integrate with save/load system
        this.integrateSaveLoad();
        
        // Integrate with UI updates
        this.integrateUI();
        
        // Integrate with economy system
        this.integrateEconomy();
        
        // Integrate with weather/season systems
        this.integrateEnvironmental();
    }

    enhanceUpdateAnimals() {
        // Store original updateAnimals function if it exists
        if (window.updateAnimals && !window.originalUpdateAnimals) {
            window.originalUpdateAnimals = window.updateAnimals;
        }

        // Create enhanced updateAnimals function
        window.updateAnimals = (deltaTime) => {
            // Call original function for legacy animals
            if (window.originalUpdateAnimals) {
                window.originalUpdateAnimals(deltaTime);
            }

            // Update enhanced animals system
            if (window.animalsModule?.initialized) {
                window.animalsModule.update(deltaTime);
            }

            // Apply seasonal effects
            this.updateSeasonalEffects();
        };
    }

    integrateSaveLoad() {
        // Store original save function
        if (window.saveGame && !window.originalSaveGame) {
            window.originalSaveGame = window.saveGame;
        }

        // Store original load function  
        if (window.loadGame && !window.originalLoadGame) {
            window.originalLoadGame = window.loadGame;
        }

        // Enhance save function
        window.saveGame = () => {
            // Call original save
            if (window.originalSaveGame) {
                window.originalSaveGame();
            }

            // Save enhanced animals data
            this.saveEnhancedAnimalsData();
        };

        // Enhance load function
        window.loadGame = () => {
            // Call original load
            if (window.originalLoadGame) {
                window.originalLoadGame();
            }

            // Load enhanced animals data
            this.loadEnhancedAnimalsData();
        };
    }

    integrateUI() {
        // Store original updateAnimalsUI function
        if (window.updateAnimalsUI && !window.originalUpdateAnimalsUI) {
            window.originalUpdateAnimalsUI = window.updateAnimalsUI;
        }

        // Enhance updateAnimalsUI function
        window.updateAnimalsUI = () => {
            // Call original function
            if (window.originalUpdateAnimalsUI) {
                window.originalUpdateAnimalsUI();
            }

            // Update enhanced animals UI
            if (window.animalsUI?.initialized) {
                window.animalsUI.updateAnimalsGrid();
            }

            // Update animal counts in mobile nav
            this.updateMobileNavBadge();
        };

        // Store original buyAnimal function
        if (window.buyAnimal && !window.originalBuyAnimal) {
            window.originalBuyAnimal = window.buyAnimal;
        }

        // Enhance buyAnimal function to work with both systems
        window.buyAnimal = (animalType, cost) => {
            // Check if this is an enhanced species
            const enhancedSpecies = window.extendedSpeciesSystem?.getExtendedSpecies(animalType);
            
            if (enhancedSpecies) {
                // Handle enhanced animal purchase
                this.buyEnhancedAnimal(animalType, cost);
            } else {
                // Use original function for legacy animals
                if (window.originalBuyAnimal) {
                    window.originalBuyAnimal(animalType, cost);
                }
            }
        };
    }

    integrateEconomy() {
        // Integrate product sales with existing marketplace
        this.integrateProductSales();
        
        // Integrate costs with existing economy
        this.integrateCosts();
    }

    integrateEnvironmental() {
        // Apply seasonal effects to enhanced animals
        if (window.currentSeason && window.extendedSpeciesSystem) {
            const allAnimals = window.animalsModule?.getAllAnimals() || [];
            
            for (const animal of allAnimals) {
                window.extendedSpeciesSystem.applySeasonalEffects(animal, window.currentSeason.type);
            }
        }
    }

    setupEventListeners() {
        // Listen for season changes
        document.addEventListener('seasonChange', (event) => {
            this.handleSeasonChange(event.detail);
        });

        // Listen for weather changes
        document.addEventListener('weatherChange', (event) => {
            this.handleWeatherChange(event.detail);
        });

        // Listen for game events
        document.addEventListener('gameLoaded', () => {
            this.handleGameLoaded();
        });

        // Listen for UI panel toggles
        document.addEventListener('click', (event) => {
            if (event.target.closest('[data-panel="animals"]')) {
                this.handleAnimalsPanelToggle();
            }
        });
    }

    startUpdateLoops() {
        // Main animals update loop (every second)
        setInterval(() => {
            if (window.animalsModule?.initialized) {
                const deltaTime = 1000; // 1 second
                window.animalsModule.update(deltaTime);
            }
        }, 1000);

        // UI update loop (every 5 seconds)
        setInterval(() => {
            if (window.animalsUI?.initialized) {
                window.animalsUI.updateAnimalsGrid();
                if (window.animalsUI.selectedAnimal) {
                    window.animalsUI.updateAnimalDetails();
                }
            }
        }, 5000);

        // Seasonal update loop (every minute)
        setInterval(() => {
            this.updateSeasonalEffects();
        }, 60000);
    }

    updateSeasonalEffects() {
        if (!window.currentSeason || !window.extendedSpeciesSystem || !window.animalsModule) return;

        const allAnimals = window.animalsModule.getAllAnimals();
        
        for (const animal of allAnimals) {
            window.extendedSpeciesSystem.applySeasonalEffects(animal, window.currentSeason.type);
        }
    }

    updateMobileNavBadge() {
        const badge = document.getElementById('animalsBadge');
        if (!badge) return;

        let totalAnimals = 0;

        // Count legacy animals
        if (window.animals) {
            for (const animalData of Object.values(window.animals)) {
                totalAnimals += animalData.count || 0;
            }
        }

        // Count enhanced animals
        if (window.animalsModule?.initialized) {
            totalAnimals += window.animalsModule.getAllAnimals().length;
        }

        if (totalAnimals > 0) {
            badge.textContent = totalAnimals;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    buyEnhancedAnimal(species, cost) {
        if (!window.animalsModule?.initialized) {
            console.error('Enhanced animals system not initialized');
            return;
        }

        // Check if player can afford it
        if ((window.coins || 0) < cost) {
            if (window.showInstruction) {
                window.showInstruction(`Not enough coins! Need ${cost} coins.`, 3000);
            }
            return;
        }

        try {
            // Create the animal
            const animal = window.animalsModule.createAnimal(species);
            
            // Deduct cost
            window.coins = (window.coins || 0) - cost;
            
            // Update objectives if they exist
            if (window.objectives) {
                window.objectives.equipmentBought = (window.objectives.equipmentBought || 0) + 1;
            }
            
            // Update UI
            if (window.updateUI) {
                window.updateUI();
            }
            
            if (window.updateAnimalsUI) {
                window.updateAnimalsUI();
            }
            
            // Save game
            if (window.saveGame) {
                window.saveGame();
            }
            
            // Show success message
            if (window.showInstruction) {
                window.showInstruction(`${animal.name} added to your farm!`, 3000);
            }
            
        } catch (error) {
            console.error('Error buying enhanced animal:', error);
            if (window.showInstruction) {
                window.showInstruction(`Error: ${error.message}`, 3000);
            }
        }
    }

    integrateProductSales() {
        // Add enhanced animal products to marketplace
        if (window.marketplace) {
            this.addEnhancedProductsToMarketplace();
        }
    }

    addEnhancedProductsToMarketplace() {
        // This would add enhanced animal products to the marketplace
        const enhancedProducts = [
            { id: 'premium_milk', name: 'Premium Milk', basePrice: 8 },
            { id: 'wool', name: 'Wool', basePrice: 15 },
            { id: 'duck_eggs', name: 'Duck Eggs', basePrice: 3 },
            { id: 'honey', name: 'Honey', basePrice: 12 },
            { id: 'work_hours', name: 'Work Services', basePrice: 10 }
        ];

        // Add to existing marketplace if available
        if (window.marketplaceItems) {
            window.marketplaceItems.push(...enhancedProducts);
        }
    }

    integrateCosts() {
        // Integrate care costs with existing economy
        const originalPerformCare = window.animalsModule?.care?.performCare;
        
        if (originalPerformCare) {
            window.animalsModule.care.performCare = (animalId, careType, options = {}) => {
                // Check and apply costs through main economy system
                const result = originalPerformCare.call(window.animalsModule.care, animalId, careType, options);
                
                // Update main UI after care actions
                if (result.success && window.updateUI) {
                    window.updateUI();
                }
                
                return result;
            };
        }
    }

    handleSeasonChange(seasonData) {
        console.log('Handling season change:', seasonData);
        
        // Apply seasonal effects to all enhanced animals
        if (window.animalsModule?.initialized && window.extendedSpeciesSystem) {
            const allAnimals = window.animalsModule.getAllAnimals();
            
            for (const animal of allAnimals) {
                window.extendedSpeciesSystem.applySeasonalEffects(animal, seasonData.type);
            }
        }
        
        // Show seasonal message for animals
        if (window.showInstruction && seasonData.name) {
            const seasonalMessages = {
                spring: 'Animals are excited for breeding season! 🌸',
                summer: 'Animals need extra water in the heat ☀️',
                autumn: 'Time for wool shearing and harvest! 🍂',
                winter: 'Animals need extra shelter and care ❄️'
            };
            
            const message = seasonalMessages[seasonData.type];
            if (message) {
                window.showInstruction(message, 4000);
            }
        }
    }

    handleWeatherChange(weatherData) {
        console.log('Handling weather change:', weatherData);
        
        // Apply weather effects to animal care and production
        if (window.animalsModule?.initialized) {
            const allAnimals = window.animalsModule.getAllAnimals();
            
            for (const animal of allAnimals) {
                this.applyWeatherEffects(animal, weatherData);
            }
        }
    }

    applyWeatherEffects(animal, weather) {
        const weatherEffects = {
            stormy: {
                stress: 0.1,
                shelter_importance: 'critical'
            },
            rainy: {
                cleanliness_decay: 1.5,
                disease_risk: 1.2
            },
            sunny: {
                happiness_boost: 0.05,
                production_bonus: 1.1
            },
            snowy: {
                energy_drain: 1.3,
                feed_increase: 1.2
            }
        };

        const effects = weatherEffects[weather.type];
        if (!effects) return;

        // Apply weather effects
        if (effects.stress) {
            animal.stats.happiness = Math.max(0, animal.stats.happiness - effects.stress);
        }

        if (effects.happiness_boost) {
            animal.stats.happiness = Math.min(1, animal.stats.happiness + effects.happiness_boost);
        }

        // Weather effects are also applied in the care and production systems
    }

    handleGameLoaded() {
        console.log('Game loaded, checking enhanced animals data');
        this.loadEnhancedAnimalsData();
    }

    handleAnimalsPanelToggle() {
        // Show enhanced interface when animals panel is opened
        if (window.animalsUI?.initialized) {
            window.animalsUI.toggleEnhancedInterface();
        }
    }

    saveEnhancedAnimalsData() {
        if (!window.animalsModule?.initialized) return;

        const data = {
            animalsModule: window.animalsModule.save(),
            breedingSystem: window.animalsModule.breeding?.save(),
            healthSystem: window.animalsModule.health?.save(),
            productionSystem: window.animalsModule.production?.save(),
            extendedSpeciesSystem: window.extendedSpeciesSystem?.save(),
            timestamp: new Date().toISOString()
        };

        // Save to localStorage
        try {
            localStorage.setItem(this.saveDataKey, JSON.stringify(data));
            console.log('Enhanced animals data saved');
        } catch (error) {
            console.error('Failed to save enhanced animals data:', error);
        }
    }

    loadEnhancedAnimalsData() {
        try {
            const savedData = localStorage.getItem(this.saveDataKey);
            if (!savedData) return;

            const data = JSON.parse(savedData);
            console.log('Loading enhanced animals data...');

            // Load main animals module data
            if (data.animalsModule && window.animalsModule?.initialized) {
                window.animalsModule.load(data.animalsModule);
            }

            // Load subsystem data
            if (data.breedingSystem && window.animalsModule?.breeding) {
                window.animalsModule.breeding.load(data.breedingSystem);
            }

            if (data.healthSystem && window.animalsModule?.health) {
                window.animalsModule.health.load(data.healthSystem);
            }

            if (data.productionSystem && window.animalsModule?.production) {
                window.animalsModule.production.load(data.productionSystem);
            }

            if (data.extendedSpeciesSystem && window.extendedSpeciesSystem) {
                window.extendedSpeciesSystem.load(data.extendedSpeciesSystem);
            }

            console.log('Enhanced animals data loaded successfully');
            
            // Update UI after loading
            if (window.animalsUI?.initialized) {
                window.animalsUI.updateAnimalsGrid();
            }
            
        } catch (error) {
            console.error('Failed to load enhanced animals data:', error);
        }
    }

    loadSavedData() {
        // Load data on initialization
        this.loadEnhancedAnimalsData();
    }

    // Add enhanced animals to existing animal purchase UI
    enhanceAnimalPurchaseUI() {
        const animalsPanel = document.getElementById('animalsPanel');
        if (!animalsPanel) return;

        // Add enhanced species to purchase options
        const extendedSpecies = window.extendedSpeciesSystem?.getAllSpecies() || [];
        
        for (const species of extendedSpecies) {
            // Check if species is unlocked
            const unlockStatus = window.extendedSpeciesSystem.isSpeciesUnlocked(
                species.species, 
                window.playerLevel || 1, 
                window.coins || 0, 
                []
            );

            if (unlockStatus.unlocked) {
                this.addSpeciesToPurchaseUI(species);
            }
        }
    }

    addSpeciesToPurchaseUI(species) {
        // This would add the species to the purchase UI
        // Implementation depends on existing UI structure
        console.log(`Adding ${species.displayName} to purchase UI`);
    }

    // Reset enhanced animals system (for new game)
    resetEnhancedAnimals() {
        // Clear saved data
        localStorage.removeItem(this.saveDataKey);
        
        // Reset all subsystems
        if (window.animalsModule?.initialized) {
            window.animalsModule.animals.clear();
        }
        
        if (window.animalsModule?.breeding) {
            window.animalsModule.breeding.pregnancies.clear();
            window.animalsModule.breeding.breedingCooldowns.clear();
        }
        
        if (window.animalsModule?.health) {
            window.animalsModule.health.activeDiseases.clear();
            window.animalsModule.health.healthHistory.clear();
        }
        
        if (window.animalsModule?.production) {
            window.animalsModule.production.pendingProducts.clear();
        }
        
        console.log('Enhanced animals system reset');
    }

    // Get system status for debugging
    getSystemStatus() {
        return {
            initialized: this.initialized,
            featureEnabled: this.isFeatureEnabled(),
            animalsModuleReady: window.animalsModule?.initialized || false,
            extendedSpeciesReady: window.extendedSpeciesSystem?.initialized || false,
            uiReady: window.animalsUI?.initialized || false,
            animalCount: window.animalsModule?.getAllAnimals()?.length || 0,
            pregnancyCount: window.animalsModule?.breeding?.getAllPregnancies()?.length || 0,
            activeDiseasesCount: Array.from(window.animalsModule?.health?.activeDiseases?.values() || []).flat().length
        };
    }
}

// Create global instance and auto-initialize
window.animalsIntegration = new AnimalsIntegration();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.animalsIntegration.initialize();
    });
} else {
    // DOM is already ready
    window.animalsIntegration.initialize();
}

// Export for module use
window.AnimalsIntegration = AnimalsIntegration;