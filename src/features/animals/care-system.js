/**
 * Care System for Enhanced Animals Module
 * Handles animal needs, feeding, cleaning, and care mechanics
 */

class CareSystem {
    constructor() {
        this.initialized = false;
        this.feedTypes = new Map();
        this.careActions = new Map();
        this.environmentEffects = new Map();
    }

    initialize() {
        if (this.initialized) return;
        
        this.loadFeedTypes();
        this.loadCareActions();
        this.loadEnvironmentEffects();
        this.initialized = true;
        console.log('Care System initialized');
    }

    // Perform care action on an animal
    performCare(animalId, careType, options = {}) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) {
            throw new Error(`Animal not found: ${animalId}`);
        }

        const careAction = this.careActions.get(careType);
        if (!careAction) {
            throw new Error(`Unknown care type: ${careType}`);
        }

        // Check if care can be performed
        const canPerform = this.canPerformCare(animal, careAction, options);
        if (!canPerform.allowed) {
            return { success: false, reason: canPerform.reason };
        }

        // Apply care effects
        const result = this.applyCareEffects(animal, careAction, options);
        
        // Update care history
        this.updateCareHistory(animal, careType, options);
        
        return result;
    }

    canPerformCare(animal, careAction, options) {
        // Check cooldown
        if (careAction.cooldown) {
            const lastCare = this.getLastCareTime(animal, careAction.type);
            if (lastCare && (Date.now() - lastCare) < careAction.cooldown) {
                return { allowed: false, reason: 'Care action on cooldown' };
            }
        }

        // Check requirements
        if (careAction.requirements) {
            for (const req of careAction.requirements) {
                if (!this.checkRequirement(animal, req, options)) {
                    return { allowed: false, reason: `Requirement not met: ${req.description}` };
                }
            }
        }

        // Check costs
        if (careAction.cost && options.checkCost !== false) {
            const canAfford = this.checkCost(careAction.cost, options);
            if (!canAfford) {
                return { allowed: false, reason: 'Insufficient resources' };
            }
        }

        return { allowed: true };
    }

    applyCareEffects(animal, careAction, options) {
        const effects = careAction.effects;
        const results = {
            success: true,
            effects: [],
            messages: []
        };

        // Apply stat changes
        if (effects.stats) {
            for (const [stat, change] of Object.entries(effects.stats)) {
                const oldValue = animal.stats[stat];
                const effectiveness = this.calculateEffectiveness(animal, careAction, options);
                const actualChange = change * effectiveness;
                
                animal.stats[stat] = Math.max(0, Math.min(1, oldValue + actualChange));
                
                results.effects.push({
                    type: 'stat',
                    stat,
                    oldValue,
                    newValue: animal.stats[stat],
                    change: actualChange
                });
            }
        }

        // Apply special effects
        if (effects.special) {
            for (const specialEffect of effects.special) {
                this.applySpecialEffect(animal, specialEffect, options, results);
            }
        }

        // Apply costs
        if (careAction.cost) {
            this.applyCosts(careAction.cost, options);
            results.messages.push(`Spent ${JSON.stringify(careAction.cost)}`);
        }

        // Generate care message
        const careMessage = this.generateCareMessage(animal, careAction, results);
        results.messages.push(careMessage);

        return results;
    }

    calculateEffectiveness(animal, careAction, options) {
        let effectiveness = 1.0;

        // Animal mood affects effectiveness
        const moodModifiers = {
            happy: 1.2,
            content: 1.0,
            sad: 0.8,
            sick: 0.6,
            angry: 0.5
        };
        effectiveness *= moodModifiers[animal.behavior.mood] || 1.0;

        // Food quality affects feeding effectiveness
        if (careAction.type === 'feed' && options.foodType) {
            const foodQuality = this.getFoodQuality(options.foodType, animal.species);
            effectiveness *= foodQuality;
        }

        // Animal's personality affects care responsiveness
        const personalityModifiers = {
            friendly: 1.1,
            shy: 0.9,
            aggressive: 0.8,
            calm: 1.0,
            playful: 1.05
        };
        effectiveness *= personalityModifiers[animal.behavior.personality] || 1.0;

        // Environmental factors
        effectiveness *= this.getEnvironmentalEffectiveness(animal);

        return Math.max(0.3, Math.min(2.0, effectiveness)); // Clamp between 30% and 200%
    }

    getEnvironmentalEffectiveness(animal) {
        let effectiveness = 1.0;

        // Weather effects
        if (window.currentWeather) {
            const weatherEffects = {
                sunny: 1.0,
                rainy: 0.9,
                stormy: 0.7,
                snowy: 0.8,
                windy: 0.95
            };
            effectiveness *= weatherEffects[window.currentWeather.type] || 1.0;
        }

        // Season effects
        if (window.currentSeason) {
            const seasonEffects = {
                spring: 1.1,
                summer: 1.0,
                autumn: 1.0,
                winter: 0.9
            };
            effectiveness *= seasonEffects[window.currentSeason.type] || 1.0;
        }

        return effectiveness;
    }

    getFoodQuality(foodType, species) {
        const feed = this.feedTypes.get(foodType);
        if (!feed) return 0.5;

        // Check species preferences
        const speciesPrefs = feed.speciesPreferences || {};
        const preference = speciesPrefs[species.split('_')[0]] || speciesPrefs.default || 1.0;

        return feed.quality * preference;
    }

    applySpecialEffect(animal, effect, options, results) {
        switch (effect.type) {
            case 'heal_disease':
                this.healDisease(animal, effect, results);
                break;
            case 'prevent_disease':
                this.preventDisease(animal, effect, results);
                break;
            case 'boost_production':
                this.boostProduction(animal, effect, results);
                break;
            case 'improve_mood':
                this.improveMood(animal, effect, results);
                break;
            case 'social_bonding':
                this.improveSocialBonding(animal, effect, options, results);
                break;
            default:
                console.warn(`Unknown special effect: ${effect.type}`);
        }
    }

    healDisease(animal, effect, results) {
        // Find active diseases
        const activeDiseases = animal.care.medications.filter(med => med.type === 'disease_treatment');
        
        if (activeDiseases.length > 0) {
            // Remove one disease
            const removedDisease = activeDiseases[0];
            animal.care.medications = animal.care.medications.filter(med => med !== removedDisease);
            
            results.effects.push({
                type: 'disease_healed',
                disease: removedDisease.disease,
                treatment: effect.treatment
            });
        }
    }

    preventDisease(animal, effect, results) {
        // Add disease resistance buff
        animal.care.medications.push({
            type: 'disease_prevention',
            effect: effect.prevention,
            duration: effect.duration || 604800000, // 7 days default
            applied: Date.now()
        });

        results.effects.push({
            type: 'disease_prevention',
            prevention: effect.prevention,
            duration: effect.duration
        });
    }

    boostProduction(animal, effect, results) {
        // Temporarily boost production rate
        const existingBoost = animal.care.medications.find(med => med.type === 'production_boost');
        if (existingBoost) {
            existingBoost.duration += effect.duration;
            existingBoost.boost = Math.max(existingBoost.boost, effect.boost);
        } else {
            animal.care.medications.push({
                type: 'production_boost',
                boost: effect.boost,
                duration: effect.duration || 86400000, // 24 hours default
                applied: Date.now()
            });
        }

        results.effects.push({
            type: 'production_boost',
            boost: effect.boost,
            duration: effect.duration
        });
    }

    improveMood(animal, effect, results) {
        // Improve animal mood for a period
        animal.care.medications.push({
            type: 'mood_enhancement',
            moodBonus: effect.moodBonus,
            duration: effect.duration || 43200000, // 12 hours default
            applied: Date.now()
        });

        results.effects.push({
            type: 'mood_improvement',
            bonus: effect.moodBonus,
            duration: effect.duration
        });
    }

    improveSocialBonding(animal, effect, options, results) {
        // Improve social bonds with nearby animals
        const nearbyAnimals = this.findNearbyAnimals(animal, options.range || 5);
        
        for (const nearbyAnimal of nearbyAnimals) {
            if (!animal.behavior.socialBonds.includes(nearbyAnimal.animalId)) {
                animal.behavior.socialBonds.push(nearbyAnimal.animalId);
            }
            if (!nearbyAnimal.behavior.socialBonds.includes(animal.animalId)) {
                nearbyAnimal.behavior.socialBonds.push(animal.animalId);
            }
        }

        results.effects.push({
            type: 'social_bonding',
            bondsFormed: nearbyAnimals.length
        });
    }

    findNearbyAnimals(animal, range) {
        const allAnimals = window.animalsModule.getAllAnimals();
        return allAnimals.filter(other => {
            if (other.animalId === animal.animalId) return false;
            
            const distance = Math.sqrt(
                Math.pow(animal.position.x - other.position.x, 2) +
                Math.pow(animal.position.z - other.position.z, 2)
            );
            
            return distance <= range;
        });
    }

    updateCareHistory(animal, careType, options) {
        const timestamp = new Date().toISOString();
        
        switch (careType) {
            case 'feed':
                animal.care.lastFed = timestamp;
                animal.care.foodType = options.foodType || 'basic';
                break;
            case 'clean':
                animal.care.lastCleaned = timestamp;
                break;
            case 'pet':
                // No specific tracking needed
                break;
            case 'veterinary':
                animal.care.lastVetVisit = timestamp;
                if (options.vaccination) {
                    animal.care.vaccinations.push({
                        vaccine: options.vaccination,
                        date: timestamp
                    });
                }
                break;
        }

        animal.lastUpdate = timestamp;
    }

    // Update animal needs over time
    updateNeeds(animal, deltaTime) {
        const ageInDays = animal.age / 86400000; // Convert ms to days
        const species = animal.species.split('_')[0];
        
        // Calculate decay rates based on species and age
        const decayRates = this.calculateDecayRates(animal, deltaTime);
        
        // Apply stat decay
        animal.stats.hunger += decayRates.hunger;
        animal.stats.cleanliness -= decayRates.cleanliness;
        animal.stats.energy -= decayRates.energy;
        animal.stats.social -= decayRates.social;
        
        // Clamp values
        animal.stats.hunger = Math.max(0, Math.min(1, animal.stats.hunger));
        animal.stats.cleanliness = Math.max(0, Math.min(1, animal.stats.cleanliness));
        animal.stats.energy = Math.max(0, Math.min(1, animal.stats.energy));
        animal.stats.social = Math.max(0, Math.min(1, animal.stats.social));
        
        // Update health based on care quality
        this.updateHealthFromCare(animal, deltaTime);
        
        // Update happiness based on all other stats
        this.updateHappiness(animal);
        
        // Process active medications/effects
        this.processActiveMedications(animal, deltaTime);
        
        // Age the animal
        animal.age += deltaTime;
        
        animal.lastUpdate = new Date().toISOString();
    }

    calculateDecayRates(animal, deltaTime) {
        const baseRates = {
            hunger: 0.00001, // Increases over time
            cleanliness: 0.000005, // Decreases over time
            energy: 0.000003, // Decreases over time
            social: 0.000002 // Decreases over time
        };

        // Adjust for age (babies need more care)
        const ageInDays = animal.age / 86400000;
        const ageFactor = ageInDays < 30 ? 1.5 : 1.0; // Babies need 50% more care

        // Adjust for personality
        const personalityFactors = {
            friendly: { social: 0.8 },
            shy: { social: 1.2 },
            aggressive: { social: 1.3, energy: 1.1 },
            calm: { energy: 0.9 },
            playful: { energy: 1.2, social: 0.9 }
        };
        
        const personalityMods = personalityFactors[animal.behavior.personality] || {};

        // Apply environmental effects
        const envFactor = this.getEnvironmentalDecayFactor(animal);

        const rates = {};
        for (const [stat, baseRate] of Object.entries(baseRates)) {
            rates[stat] = baseRate * ageFactor * (personalityMods[stat] || 1.0) * envFactor * deltaTime;
        }

        return rates;
    }

    getEnvironmentalDecayFactor(animal) {
        let factor = 1.0;

        // Weather effects on decay
        if (window.currentWeather) {
            const weatherFactors = {
                sunny: 1.0,
                rainy: 1.1, // Animals get dirty faster
                stormy: 1.3, // High stress environment
                snowy: 1.2, // Cold stress
                windy: 1.1
            };
            factor *= weatherFactors[window.currentWeather.type] || 1.0;
        }

        // Overcrowding effects
        const nearbyAnimals = this.findNearbyAnimals(animal, 3);
        if (nearbyAnimals.length > 2) {
            factor *= 1.2; // 20% faster decay when overcrowded
        }

        return factor;
    }

    updateHealthFromCare(animal, deltaTime) {
        let healthChange = 0;

        // Good care improves health
        if (animal.stats.hunger < 0.3 && animal.stats.cleanliness > 0.7) {
            healthChange += 0.000001 * deltaTime; // Slow health improvement
        }

        // Poor care degrades health
        if (animal.stats.hunger > 0.8 || animal.stats.cleanliness < 0.2) {
            healthChange -= 0.000003 * deltaTime; // Faster health degradation
        }

        // Age effects on health
        const ageInDays = animal.age / 86400000;
        const speciesLifespan = this.getSpeciesLifespan(animal.species);
        const ageRatio = ageInDays / speciesLifespan;
        
        if (ageRatio > 0.8) {
            healthChange -= 0.000002 * deltaTime * (ageRatio - 0.8) * 5; // Health decline in old age
        }

        animal.stats.health = Math.max(0, Math.min(1, animal.stats.health + healthChange));
    }

    updateHappiness(animal) {
        // Happiness is influenced by all other stats
        const statWeights = {
            health: 0.3,
            hunger: -0.2, // High hunger reduces happiness
            cleanliness: 0.2,
            energy: 0.1,
            social: 0.2
        };

        let happiness = 0;
        for (const [stat, weight] of Object.entries(statWeights)) {
            const statValue = stat === 'hunger' ? (1 - animal.stats[stat]) : animal.stats[stat];
            happiness += statValue * Math.abs(weight);
        }

        // Social bonding bonus
        const socialBonds = animal.behavior.socialBonds.length;
        happiness += Math.min(0.1, socialBonds * 0.02); // Up to 10% bonus for social bonds

        // Apply personality modifiers
        const personalityMods = {
            friendly: 1.1,
            shy: 0.9,
            aggressive: 0.8,
            calm: 1.0,
            playful: 1.2
        };
        
        happiness *= personalityMods[animal.behavior.personality] || 1.0;

        animal.stats.happiness = Math.max(0, Math.min(1, happiness));
    }

    processActiveMedications(animal, deltaTime) {
        const currentTime = Date.now();
        
        animal.care.medications = animal.care.medications.filter(medication => {
            const timeElapsed = currentTime - medication.applied;
            
            if (timeElapsed >= medication.duration) {
                // Medication expired
                return false;
            }

            // Apply ongoing effects
            switch (medication.type) {
                case 'mood_enhancement':
                    // Mood bonus is applied when calculating happiness
                    break;
                case 'production_boost':
                    // Production boost is applied in production system
                    break;
                case 'disease_prevention':
                    // Disease prevention is checked during disease progression
                    break;
            }

            return true; // Keep active medication
        });
    }

    getSpeciesLifespan(species) {
        const lifespans = {
            cow: 2555, // ~7 years
            chicken: 2190, // ~6 years  
            pig: 2920, // ~8 years
            sheep: 2555, // ~7 years
            horse: 10950, // ~30 years
            goat: 2920, // ~8 years
            duck: 2555 // ~7 years
        };

        const baseSpecies = species.split('_')[0];
        return lifespans[baseSpecies] || 2555;
    }

    checkRequirement(animal, requirement, options) {
        switch (requirement.type) {
            case 'stat_min':
                return animal.stats[requirement.stat] >= requirement.value;
            case 'stat_max':
                return animal.stats[requirement.stat] <= requirement.value;
            case 'age_min':
                return (animal.age / 86400000) >= requirement.value;
            case 'age_max':
                return (animal.age / 86400000) <= requirement.value;
            case 'has_item':
                return options.items && options.items[requirement.item] >= requirement.amount;
            default:
                return true;
        }
    }

    checkCost(cost, options) {
        if (cost.coins && (!window.coins || window.coins < cost.coins)) {
            return false;
        }
        
        if (cost.items) {
            for (const [item, amount] of Object.entries(cost.items)) {
                if (!options.items || !options.items[item] || options.items[item] < amount) {
                    return false;
                }
            }
        }
        
        return true;
    }

    applyCosts(cost, options) {
        if (cost.coins) {
            window.coins = (window.coins || 0) - cost.coins;
        }
        
        if (cost.items && options.items) {
            for (const [item, amount] of Object.entries(cost.items)) {
                options.items[item] = (options.items[item] || 0) - amount;
            }
        }
    }

    getLastCareTime(animal, careType) {
        switch (careType) {
            case 'feed':
                return new Date(animal.care.lastFed).getTime();
            case 'clean':
                return new Date(animal.care.lastCleaned).getTime();
            case 'veterinary':
                return animal.care.lastVetVisit ? new Date(animal.care.lastVetVisit).getTime() : null;
            default:
                return null;
        }
    }

    generateCareMessage(animal, careAction, results) {
        const animalName = animal.name || 'the animal';
        const moodEmojis = {
            happy: '😊',
            content: '😌',
            sad: '😢',
            sick: '🤒',
            angry: '😠',
            hungry: '🤤'
        };
        
        const moodEmoji = moodEmojis[animal.behavior.mood] || '🐄';
        
        switch (careAction.type) {
            case 'feed':
                return `${animalName} ${moodEmoji} enjoyed the meal! Hunger reduced.`;
            case 'clean':
                return `${animalName} ${moodEmoji} feels much cleaner and happier!`;
            case 'pet':
                return `${animalName} ${moodEmoji} loved the attention and affection!`;
            case 'veterinary':
                return `${animalName} ${moodEmoji} received professional veterinary care.`;
            default:
                return `${animalName} ${moodEmoji} received care.`;
        }
    }

    // Load predefined feed types
    loadFeedTypes() {
        const feedTypes = [
            {
                id: 'basic',
                name: 'Basic Feed',
                quality: 0.5,
                cost: { coins: 1 },
                speciesPreferences: {
                    default: 1.0
                }
            },
            {
                id: 'premium_hay',
                name: 'Premium Hay',
                quality: 0.8,
                cost: { coins: 3 },
                speciesPreferences: {
                    cow: 1.2,
                    sheep: 1.1,
                    horse: 1.3,
                    default: 0.9
                }
            },
            {
                id: 'grain_mix',
                name: 'Grain Mix',
                quality: 0.7,
                cost: { coins: 2 },
                speciesPreferences: {
                    chicken: 1.3,
                    pig: 1.2,
                    duck: 1.2,
                    default: 0.8
                }
            },
            {
                id: 'organic_feed',
                name: 'Organic Feed',
                quality: 0.9,
                cost: { coins: 5 },
                speciesPreferences: {
                    default: 1.1
                }
            }
        ];

        for (const feed of feedTypes) {
            this.feedTypes.set(feed.id, feed);
        }
    }

    // Load care actions
    loadCareActions() {
        const actions = [
            {
                type: 'feed',
                name: 'Feed Animal',
                description: 'Provide food to reduce hunger',
                cooldown: 14400000, // 4 hours
                cost: { coins: 1 },
                effects: {
                    stats: {
                        hunger: -0.4,
                        happiness: 0.1,
                        energy: 0.1
                    }
                }
            },
            {
                type: 'clean',
                name: 'Clean Animal',
                description: 'Clean the animal to improve hygiene',
                cooldown: 21600000, // 6 hours
                cost: { coins: 1 },
                effects: {
                    stats: {
                        cleanliness: 0.5,
                        happiness: 0.15,
                        health: 0.05
                    }
                }
            },
            {
                type: 'pet',
                name: 'Pet Animal',
                description: 'Show affection to improve mood',
                cooldown: 3600000, // 1 hour
                cost: {},
                effects: {
                    stats: {
                        happiness: 0.2,
                        social: 0.1
                    },
                    special: [
                        {
                            type: 'social_bonding',
                            range: 3
                        }
                    ]
                }
            },
            {
                type: 'veterinary',
                name: 'Veterinary Care',
                description: 'Professional health checkup and treatment',
                cooldown: 86400000, // 24 hours
                cost: { coins: 10 },
                effects: {
                    stats: {
                        health: 0.3,
                        happiness: -0.1 // Animals don't love vet visits
                    },
                    special: [
                        {
                            type: 'prevent_disease',
                            prevention: 'general',
                            duration: 604800000 // 7 days
                        }
                    ]
                }
            }
        ];

        for (const action of actions) {
            this.careActions.set(action.type, action);
        }
    }

    loadEnvironmentEffects() {
        // Environmental effects will be expanded in later phases
        this.environmentEffects.set('shelter', {
            provides: ['protection', 'comfort'],
            effects: {
                happiness: 0.1,
                health: 0.05
            }
        });
    }
}

// Export for global use
window.CareSystem = CareSystem;