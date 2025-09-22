/**
 * Enhanced Animals Module - Core System
 * Implements advanced animal care, breeding, genetics, and expanded species
 * Related to Issue #27
 */

class AnimalsModule {
    constructor() {
        this.enabled = false;
        this.animals = new Map(); // Enhanced animal instances
        this.species = new Map(); // Species configurations
        this.diseases = new Map(); // Disease definitions
        this.genetics = new GeneticsSystem();
        this.breeding = new BreedingSystem();
        this.health = new HealthSystem();
        this.care = new CareSystem();
        this.production = new ProductionSystem();
        
        this.initialized = false;
    }

    // Check if the module is enabled
    static isEnabled() {
        return window.gameFeatures?.enhanced_animals?.enabled || false;
    }

    // Initialize the enhanced animals system
    async initialize() {
        if (this.initialized) return;
        
        console.log('Initializing Enhanced Animals Module...');
        
        // Load species configurations
        await this.loadSpeciesConfigurations();
        
        // Load disease definitions
        await this.loadDiseaseDefinitions();
        
        // Initialize subsystems
        this.genetics.initialize();
        this.breeding.initialize();
        this.health.initialize();
        this.care.initialize();
        this.production.initialize();
        
        this.enabled = true;
        this.initialized = true;
        
        console.log('Enhanced Animals Module initialized successfully');
    }

    // Animal Management API
    createAnimal(species, traits = {}) {
        const animalId = this.generateAnimalId();
        const speciesConfig = this.species.get(species);
        
        if (!speciesConfig) {
            throw new Error(`Unknown species: ${species}`);
        }

        const animal = {
            animalId,
            species,
            name: traits.name || this.generateAnimalName(species),
            gender: traits.gender || this.generateGender(speciesConfig),
            age: traits.age || 0,
            genetics: this.genetics.generateGenetics(species, traits.genetics),
            stats: this.initializeStats(speciesConfig),
            care: this.initializeCare(),
            production: this.initializeProduction(speciesConfig),
            breeding: this.initializeBreeding(speciesConfig),
            behavior: this.initializeBehavior(speciesConfig),
            position: traits.position || { x: 0, y: 0, z: 0 },
            createdAt: new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        };

        this.animals.set(animalId, animal);
        return animal;
    }

    getAnimal(animalId) {
        return this.animals.get(animalId);
    }

    getAllAnimals() {
        return Array.from(this.animals.values());
    }

    careForAnimal(animalId, careType, options = {}) {
        return this.care.performCare(animalId, careType, options);
    }

    // Breeding System API
    canBreed(parent1Id, parent2Id) {
        return this.breeding.canBreed(parent1Id, parent2Id);
    }

    breedAnimals(parent1Id, parent2Id) {
        return this.breeding.breed(parent1Id, parent2Id);
    }

    calculateOffspringTraits(parent1, parent2) {
        return this.genetics.calculateOffspring(parent1, parent2);
    }

    // Health System API
    checkHealth(animalId) {
        return this.health.checkHealth(animalId);
    }

    treatDisease(animalId, treatment) {
        return this.health.treatDisease(animalId, treatment);
    }

    applyPreventiveCare(animalId) {
        return this.health.applyPreventiveCare(animalId);
    }

    // Update System
    update(deltaTime) {
        if (!this.enabled) return;

        this.updateAnimalNeeds(deltaTime);
        this.processBreeding(deltaTime);
        this.updateAnimalHealth(deltaTime);
        this.generateProducts(deltaTime);
        this.updateBehavior(deltaTime);
    }

    updateAnimalNeeds(deltaTime) {
        for (const animal of this.animals.values()) {
            this.care.updateNeeds(animal, deltaTime);
        }
    }

    processBreeding(deltaTime) {
        this.breeding.update(deltaTime);
    }

    updateAnimalHealth(deltaTime) {
        for (const animal of this.animals.values()) {
            this.health.updateHealth(animal, deltaTime);
        }
    }

    generateProducts(deltaTime) {
        for (const animal of this.animals.values()) {
            this.production.updateProduction(animal, deltaTime);
        }
    }

    updateBehavior(deltaTime) {
        for (const animal of this.animals.values()) {
            this.updateAnimalBehavior(animal, deltaTime);
        }
    }

    // Helper methods
    generateAnimalId() {
        return 'animal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateAnimalName(species) {
        const names = {
            cow: ['Bessie', 'Moobert', 'Daisy', 'Ferdinand', 'Clarabelle'],
            chicken: ['Henrietta', 'Clucky', 'Feathers', 'Pecky', 'Scrambles'],
            pig: ['Babe', 'Porky', 'Hamlet', 'Peppa', 'Snorts'],
            sheep: ['Woolly', 'Shaun', 'Dolly', 'Fluffy', 'Baxter'],
            horse: ['Thunder', 'Spirit', 'Star', 'Midnight', 'Blaze'],
            goat: ['Billy', 'Gruff', 'Nan', 'Buck', 'Pepper'],
            duck: ['Quackers', 'Puddles', 'Splash', 'Waddles', 'Donald']
        };
        
        const speciesNames = names[species] || ['Friend'];
        return speciesNames[Math.floor(Math.random() * speciesNames.length)];
    }

    generateGender(speciesConfig) {
        const ratio = speciesConfig.physicalTraits.genderRatio;
        return Math.random() < ratio.female ? 'female' : 'male';
    }

    initializeStats(speciesConfig) {
        return {
            health: 1.0,
            happiness: 0.8,
            hunger: 0.5,
            cleanliness: 0.8,
            energy: 0.9,
            social: 0.6
        };
    }

    initializeCare() {
        return {
            lastFed: new Date().toISOString(),
            foodType: 'basic',
            lastCleaned: new Date().toISOString(),
            lastVetVisit: null,
            vaccinations: [],
            medications: []
        };
    }

    initializeProduction(speciesConfig) {
        const production = speciesConfig.production.primary;
        return {
            type: production.type,
            quality: 'standard',
            rate: production.baseRate,
            lastProduced: new Date().toISOString(),
            totalLifetimeProduction: 0
        };
    }

    initializeBreeding(speciesConfig) {
        return {
            maturityAge: speciesConfig.physicalTraits.maturityAge,
            lastBred: null,
            pregnancyStatus: null,
            breedingValue: 0.5,
            offspring: []
        };
    }

    initializeBehavior(speciesConfig) {
        const personalities = ['friendly', 'shy', 'aggressive', 'calm', 'playful'];
        return {
            personality: personalities[Math.floor(Math.random() * personalities.length)],
            mood: 'content',
            activity: 'idle',
            socialBonds: []
        };
    }

    updateAnimalBehavior(animal, deltaTime) {
        // Update mood based on stats
        if (animal.stats.health < 0.3 || animal.stats.happiness < 0.3) {
            animal.behavior.mood = 'sick';
        } else if (animal.stats.happiness > 0.8 && animal.stats.health > 0.8) {
            animal.behavior.mood = 'happy';
        } else if (animal.stats.hunger > 0.8) {
            animal.behavior.mood = 'hungry';
        } else {
            animal.behavior.mood = 'content';
        }

        // Update activity based on mood and time
        const activities = ['grazing', 'resting', 'socializing', 'exploring'];
        if (animal.stats.energy < 0.3) {
            animal.behavior.activity = 'resting';
        } else if (animal.stats.hunger > 0.7) {
            animal.behavior.activity = 'grazing';
        } else {
            animal.behavior.activity = activities[Math.floor(Math.random() * activities.length)];
        }
    }

    // Species and Disease Loading
    async loadSpeciesConfigurations() {
        // Load from configuration or use built-in defaults
        const speciesConfigs = await this.getSpeciesConfigurations();
        for (const config of speciesConfigs) {
            this.species.set(config.species, config);
        }
    }

    async loadDiseaseDefinitions() {
        // Load from configuration or use built-in defaults
        const diseases = await this.getDiseaseDefinitions();
        for (const disease of diseases) {
            this.diseases.set(disease.diseaseId, disease);
        }
    }

    async getSpeciesConfigurations() {
        // Return built-in species configurations
        return [
            // Enhanced cow configuration
            {
                species: 'cow_holstein',
                displayName: 'Holstein Cow',
                baseSpecies: 'cow',
                icon: '🐄',
                rarity: 'common',
                unlockRequirements: {
                    level: 1,
                    coins: 100,
                    prerequisites: []
                },
                physicalTraits: {
                    size: 'large',
                    lifespan: 2555, // days
                    maturityAge: 365,
                    genderRatio: { male: 0.1, female: 0.9 }
                },
                careRequirements: {
                    food: {
                        types: ['hay', 'grass', 'grain'],
                        frequency: 21600000, // 6 hours
                        amount: 3,
                        preferences: ['alfalfa_hay', 'corn_silage']
                    },
                    environment: {
                        shelter: 'required',
                        space: 16,
                        companionship: 'preferred',
                        temperature: { min: 5, max: 30 }
                    },
                    health: {
                        vetCheckFrequency: 2592000000, // 30 days
                        commonDiseases: ['mastitis', 'lameness'],
                        vaccinations: ['vaccine_bovine_A']
                    }
                },
                production: {
                    primary: {
                        type: 'milk',
                        baseRate: 2.0,
                        frequency: 43200000, // 12 hours
                        qualityRange: [0.6, 1.4]
                    },
                    secondary: {
                        type: 'fertilizer',
                        rate: 1.0,
                        frequency: 86400000 // 24 hours
                    }
                },
                breeding: {
                    gestationPeriod: 25920000000, // 300 days
                    offspringCount: { min: 1, max: 1 },
                    breedingCooldown: 31536000000, // 365 days
                    fertilityRate: 0.8,
                    inbreedingPenalty: 0.3
                },
                genetics: {
                    traitHeritability: {
                        milk_production: 0.7,
                        disease_resistance: 0.4,
                        growth_rate: 0.6,
                        coat_pattern: 0.9
                    },
                    mutationRate: 0.05,
                    dominanceRules: {
                        coat_pattern: ['solid > spotted > striped']
                    }
                }
            }
            // More species will be added in subsequent phases
        ];
    }

    async getDiseaseDefinitions() {
        return [
            {
                diseaseId: 'mastitis',
                name: 'Mastitis',
                description: 'Udder infection affecting milk production',
                severity: 'moderate',
                affectedSpecies: ['cow', 'goat', 'sheep'],
                symptoms: ['reduced_milk', 'lethargy', 'fever'],
                causes: {
                    poor_hygiene: 0.4,
                    stress: 0.2,
                    overcrowding: 0.3,
                    genetics: 0.1
                },
                prevention: {
                    regular_cleaning: 0.6,
                    vaccination: 0.3,
                    proper_nutrition: 0.4
                },
                treatment: {
                    antibiotics: { effectiveness: 0.8, cost: 50, duration: 7 },
                    natural_remedy: { effectiveness: 0.5, cost: 10, duration: 14 }
                },
                effects: {
                    milk_production: -0.5,
                    animal_happiness: -0.3,
                    contagiousness: 0.2
                },
                recoveryTime: 604800000 // 7 days
            }
        ];
    }

    // Save/Load functionality
    save() {
        return {
            animals: Array.from(this.animals.entries()),
            enabled: this.enabled,
            timestamp: new Date().toISOString()
        };
    }

    load(data) {
        if (data.animals) {
            this.animals = new Map(data.animals);
        }
        this.enabled = data.enabled || false;
    }
}

// Export for global use
window.AnimalsModule = AnimalsModule;