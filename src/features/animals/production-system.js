/**
 * Production System for Enhanced Animals Module
 * Handles animal product generation, quality, and collection
 */

class ProductionSystem {
    constructor() {
        this.initialized = false;
        this.productionRates = new Map(); // Base production rates by species
        this.qualityFactors = new Map(); // Factors affecting product quality
        this.productTypes = new Map(); // Product type definitions
        this.pendingProducts = new Map(); // Products ready for collection per animal
    }

    initialize() {
        if (this.initialized) return;
        
        this.loadProductionRates();
        this.loadQualityFactors();
        this.loadProductTypes();
        this.initialized = true;
        console.log('Production System initialized');
    }

    // Update production for an animal
    updateProduction(animal, deltaTime) {
        // Check if animal is mature enough to produce
        if (!this.isProductionReady(animal)) return;

        // Update production timers
        this.updateProductionTimers(animal, deltaTime);

        // Check if it's time to produce
        if (this.shouldProduce(animal)) {
            this.generateProduct(animal);
        }

        // Apply production bonuses/penalties from medications
        this.applyProductionModifiers(animal);
    }

    isProductionReady(animal) {
        const ageInDays = animal.age / 86400000;
        const species = animal.species.split('_')[0];
        
        // Minimum production ages
        const productionAges = {
            cow: 730, // 2 years for first lactation
            chicken: 150, // 5 months for egg laying
            pig: 365, // 1 year for truffle finding
            sheep: 365, // 1 year for wool production
            goat: 365, // 1 year for milk production
            duck: 180, // 6 months for egg laying
            horse: 1095 // 3 years for work
        };

        const minAge = productionAges[species] || 365;
        return ageInDays >= minAge;
    }

    updateProductionTimers(animal, deltaTime) {
        // Update time since last production
        const lastProduced = new Date(animal.production.lastProduced).getTime();
        const timeSinceProduction = Date.now() - lastProduced;
        
        // Store this for production calculations
        animal.production.timeSinceLastProduction = timeSinceProduction;
    }

    shouldProduce(animal) {
        const species = animal.species.split('_')[0];
        const productionRate = this.getProductionRate(animal);
        const timeSinceProduction = animal.production.timeSinceLastProduction || 0;

        return timeSinceProduction >= productionRate;
    }

    getProductionRate(animal) {
        const species = animal.species.split('_')[0];
        const baseRates = this.productionRates.get(species);
        if (!baseRates) return 86400000; // Default 24 hours

        let rate = baseRates.frequency;

        // Apply genetic modifiers
        const genetics = animal.genetics.traits;
        const productionTrait = this.getProductionTrait(species);
        if (genetics[productionTrait]) {
            // Better genetics = faster production
            rate *= (1 / Math.max(0.5, genetics[productionTrait]));
        }

        // Apply health effects
        if (animal.stats.health < 0.5) {
            rate *= 2; // Sick animals produce slower
        } else if (animal.stats.health > 0.8) {
            rate *= 0.8; // Healthy animals produce faster
        }

        // Apply happiness effects
        if (animal.stats.happiness > 0.8) {
            rate *= 0.9; // Happy animals produce more frequently
        } else if (animal.stats.happiness < 0.4) {
            rate *= 1.5; // Unhappy animals produce slower
        }

        // Apply care quality effects
        const careQuality = this.calculateCareQuality(animal);
        rate *= (2 - careQuality); // Better care = faster production

        // Apply seasonal effects
        if (window.currentSeason) {
            const seasonalModifiers = {
                spring: 0.9, // Spring boost
                summer: 1.0,
                autumn: 1.0,
                winter: 1.2 // Winter slowdown
            };
            rate *= seasonalModifiers[window.currentSeason.type] || 1.0;
        }

        return Math.max(3600000, rate); // Minimum 1 hour between productions
    }

    getProductionTrait(species) {
        const traits = {
            cow: 'milk_production',
            chicken: 'egg_production',
            pig: 'truffle_finding',
            sheep: 'wool_production',
            goat: 'milk_production',
            duck: 'egg_production',
            horse: 'work_efficiency'
        };

        return traits[species] || 'production_efficiency';
    }

    calculateCareQuality(animal) {
        let quality = 0.5; // Base quality

        // Recent feeding
        const lastFed = new Date(animal.care.lastFed).getTime();
        const hoursSinceFeed = (Date.now() - lastFed) / 3600000;
        if (hoursSinceFeed < 12) {
            quality += 0.2;
        } else if (hoursSinceFeed > 24) {
            quality -= 0.2;
        }

        // Cleanliness
        quality += animal.stats.cleanliness * 0.3;

        // Health status
        quality += animal.stats.health * 0.3;

        // Happiness
        quality += animal.stats.happiness * 0.2;

        return Math.max(0.1, Math.min(1.0, quality));
    }

    generateProduct(animal) {
        const species = animal.species.split('_')[0];
        const productType = this.getProductType(species);
        
        if (!productType) return;

        // Calculate quantity
        const quantity = this.calculateProductQuantity(animal, productType);
        
        // Calculate quality
        const quality = this.calculateProductQuality(animal, productType);
        
        // Create product instance
        const product = {
            productId: this.generateProductId(),
            type: productType.id,
            name: productType.name,
            quantity,
            quality,
            animalId: animal.animalId,
            animalName: animal.name,
            producedAt: new Date().toISOString(),
            baseValue: productType.baseValue,
            actualValue: this.calculateProductValue(productType, quality, quantity),
            freshness: 1.0, // Starts at 100% fresh
            spoilage: productType.spoilage || { rate: 0.001, time: 86400000 } // 24 hours default
        };

        // Add to pending products
        const animalProducts = this.pendingProducts.get(animal.animalId) || [];
        animalProducts.push(product);
        this.pendingProducts.set(animal.animalId, animalProducts);

        // Update animal production stats
        animal.production.lastProduced = new Date().toISOString();
        animal.production.totalLifetimeProduction += quantity;

        // Apply production effects on animal
        this.applyProductionEffects(animal, productType, quantity);

        console.log(`${animal.name} produced ${quantity} ${product.name} (${quality} quality)`);

        // Notify game
        this.notifyProduction(animal, product);

        return product;
    }

    calculateProductQuantity(animal, productType) {
        let baseQuantity = productType.baseQuantity || 1;

        // Apply genetic modifiers
        const productionTrait = this.getProductionTrait(animal.species.split('_')[0]);
        const geneticModifier = animal.genetics.traits[productionTrait] || 0.5;
        baseQuantity *= (0.5 + geneticModifier); // 50% to 150% of base

        // Apply health effects
        baseQuantity *= Math.max(0.3, animal.stats.health);

        // Apply care quality effects
        const careQuality = this.calculateCareQuality(animal);
        baseQuantity *= careQuality;

        // Apply production bonuses from medications
        const productionBonus = this.getProductionBonus(animal);
        baseQuantity *= (1 + productionBonus);

        // Apply age effects (peak production in middle age)
        const ageInDays = animal.age / 86400000;
        const ageFactor = this.calculateAgeFactor(ageInDays, animal.species);
        baseQuantity *= ageFactor;

        // Random variation (±20%)
        const variation = 0.8 + (Math.random() * 0.4);
        baseQuantity *= variation;

        return Math.max(0.1, Math.round(baseQuantity * 10) / 10); // Round to 1 decimal
    }

    calculateProductQuality(animal, productType) {
        let quality = 0.5; // Base quality (standard)

        // Genetic quality factors
        const productionTrait = this.getProductionTrait(animal.species.split('_')[0]);
        const geneticQuality = animal.genetics.traits[productionTrait] || 0.5;
        quality += (geneticQuality - 0.5) * 0.4; // ±0.2 from genetics

        // Health significantly affects quality
        quality += (animal.stats.health - 0.5) * 0.6; // ±0.3 from health

        // Happiness affects quality
        quality += (animal.stats.happiness - 0.5) * 0.3; // ±0.15 from happiness

        // Care quality affects product quality
        const careQuality = this.calculateCareQuality(animal);
        quality += (careQuality - 0.5) * 0.4; // ±0.2 from care

        // Disease resistance (healthier animals produce better quality)
        const diseaseResistance = animal.genetics.traits.disease_resistance || 0.5;
        quality += (diseaseResistance - 0.5) * 0.2; // ±0.1 from disease resistance

        // Environmental factors
        quality += this.getEnvironmentalQualityModifier();

        // Feed quality bonus
        quality += this.getFeedQualityBonus(animal);

        // Premium care bonus
        quality += this.getPremiumCareBonus(animal);

        // Clamp quality to valid range
        return Math.max(0.1, Math.min(1.0, quality));
    }

    getEnvironmentalQualityModifier() {
        let modifier = 0;

        // Weather effects
        if (window.currentWeather) {
            const weatherEffects = {
                sunny: 0.05,
                rainy: -0.02,
                stormy: -0.1,
                snowy: -0.05,
                windy: -0.02
            };
            modifier += weatherEffects[window.currentWeather.type] || 0;
        }

        // Season effects
        if (window.currentSeason) {
            const seasonEffects = {
                spring: 0.1, // Perfect conditions
                summer: 0.05,
                autumn: 0.0,
                winter: -0.05 // Harsher conditions
            };
            modifier += seasonEffects[window.currentSeason.type] || 0;
        }

        return modifier;
    }

    getFeedQualityBonus(animal) {
        const feedType = animal.care.foodType || 'basic';
        const feedBonuses = {
            basic: 0,
            premium_hay: 0.05,
            grain_mix: 0.03,
            organic_feed: 0.1,
            specialty_feed: 0.15
        };

        return feedBonuses[feedType] || 0;
    }

    getPremiumCareBonus(animal) {
        let bonus = 0;

        // Recent vet visit bonus
        if (animal.care.lastVetVisit) {
            const daysSinceVet = (Date.now() - new Date(animal.care.lastVetVisit).getTime()) / 86400000;
            if (daysSinceVet < 30) {
                bonus += 0.05;
            }
        }

        // Vaccination bonus
        if (animal.care.vaccinations && animal.care.vaccinations.length > 0) {
            bonus += 0.03;
        }

        // Social bonding bonus
        if (animal.behavior.socialBonds && animal.behavior.socialBonds.length > 0) {
            bonus += Math.min(0.05, animal.behavior.socialBonds.length * 0.01);
        }

        return bonus;
    }

    calculateAgeFactor(ageInDays, species) {
        const baseSpecies = species.split('_')[0];
        const peakAges = {
            cow: { start: 1095, peak: 2190, decline: 4380 }, // 3-6 years peak, decline after 12
            chicken: { start: 180, peak: 730, decline: 1460 }, // 6 months - 2 years peak
            pig: { start: 365, peak: 1095, decline: 2190 }, // 1-3 years peak
            sheep: { start: 365, peak: 1825, decline: 3650 }, // 1-5 years peak
            goat: { start: 365, peak: 1460, decline: 2920 }, // 1-4 years peak
            duck: { start: 180, peak: 730, decline: 1460 }, // Similar to chicken
            horse: { start: 1460, peak: 3650, decline: 7300 } // 4-10 years peak
        };

        const ages = peakAges[baseSpecies] || { start: 365, peak: 1460, decline: 2920 };

        if (ageInDays < ages.start) {
            // Young animals, ramping up production
            return 0.3 + (ageInDays / ages.start) * 0.7;
        } else if (ageInDays <= ages.peak) {
            // Peak production years
            return 1.0;
        } else if (ageInDays <= ages.decline) {
            // Gradual decline
            const declineProgress = (ageInDays - ages.peak) / (ages.decline - ages.peak);
            return 1.0 - (declineProgress * 0.4); // Decline to 60% of peak
        } else {
            // Old age, significant decline
            const oldAgeProgress = Math.min(1, (ageInDays - ages.decline) / ages.decline);
            return 0.6 - (oldAgeProgress * 0.4); // Further decline to 20% minimum
        }
    }

    getProductionBonus(animal) {
        let bonus = 0;

        // Check for production boost medications
        for (const medication of animal.care.medications) {
            if (medication.type === 'production_boost') {
                const timeElapsed = Date.now() - medication.applied;
                if (timeElapsed < medication.duration) {
                    bonus += medication.boost;
                }
            }
        }

        return bonus;
    }

    calculateProductValue(productType, quality, quantity) {
        let value = productType.baseValue * quantity;

        // Quality multiplier
        const qualityMultipliers = {
            poor: 0.5,      // 0.0 - 0.2
            below_average: 0.7,  // 0.2 - 0.4
            standard: 1.0,  // 0.4 - 0.6
            good: 1.3,      // 0.6 - 0.8
            premium: 1.8,   // 0.8 - 0.9
            exceptional: 2.5 // 0.9 - 1.0
        };

        const qualityTier = this.getQualityTier(quality);
        value *= qualityMultipliers[qualityTier];

        return Math.round(value * 100) / 100; // Round to 2 decimal places
    }

    getQualityTier(quality) {
        if (quality < 0.2) return 'poor';
        if (quality < 0.4) return 'below_average';
        if (quality < 0.6) return 'standard';
        if (quality < 0.8) return 'good';
        if (quality < 0.9) return 'premium';
        return 'exceptional';
    }

    applyProductionEffects(animal, productType, quantity) {
        // Production takes energy
        const energyCost = productType.energyCost || 0.05;
        animal.stats.energy = Math.max(0, animal.stats.energy - energyCost);

        // Large productions cause more fatigue
        if (quantity > productType.baseQuantity * 1.5) {
            animal.stats.energy = Math.max(0, animal.stats.energy - 0.05);
        }

        // Some productions affect hunger (milk, eggs require nutrients)
        if (productType.id === 'milk' || productType.id === 'eggs') {
            animal.stats.hunger = Math.min(1, animal.stats.hunger + 0.1);
        }

        // Successful production can improve mood slightly
        animal.stats.happiness = Math.min(1, animal.stats.happiness + 0.02);
    }

    notifyProduction(animal, product) {
        // Create production notification
        const message = `${animal.name} produced ${product.quantity} ${product.name}!`;
        
        if (window.showInstruction) {
            window.showInstruction(message, 3000);
        }

        // Update UI if available
        if (window.updateAnimalsUI) {
            window.updateAnimalsUI();
        }

        // Log for debugging
        console.log('Production event:', {
            animal: animal.name,
            product: product.name,
            quantity: product.quantity,
            quality: this.getQualityTier(product.quality),
            value: product.actualValue
        });
    }

    applyProductionModifiers(animal) {
        // Handle temporary production modifiers from breeding, illness, etc.
        for (let i = animal.care.medications.length - 1; i >= 0; i--) {
            const medication = animal.care.medications[i];
            const timeElapsed = Date.now() - medication.applied;
            
            if (timeElapsed >= medication.duration) {
                // Remove expired medication
                animal.care.medications.splice(i, 1);
            }
        }
    }

    // Collect products from an animal
    collectProducts(animalId) {
        const products = this.pendingProducts.get(animalId) || [];
        if (products.length === 0) {
            return { success: false, reason: 'No products available for collection' };
        }

        // Calculate total value and update freshness
        let totalValue = 0;
        const collectedProducts = [];

        for (const product of products) {
            // Update freshness based on time since production
            this.updateProductFreshness(product);
            
            // Apply freshness to value
            const freshnessMultiplier = Math.max(0.1, product.freshness);
            const adjustedValue = product.actualValue * freshnessMultiplier;
            
            totalValue += adjustedValue;
            collectedProducts.push({
                ...product,
                adjustedValue,
                freshnessMultiplier
            });
        }

        // Clear pending products for this animal
        this.pendingProducts.delete(animalId);

        // Add to player inventory/coins
        this.addToPlayerInventory(collectedProducts, totalValue);

        return {
            success: true,
            products: collectedProducts,
            totalValue,
            count: collectedProducts.length
        };
    }

    updateProductFreshness(product) {
        const timeSinceProduction = Date.now() - new Date(product.producedAt).getTime();
        const spoilageRate = product.spoilage.rate;
        
        // Calculate freshness decay
        const decay = (timeSinceProduction * spoilageRate) / product.spoilage.time;
        product.freshness = Math.max(0, 1 - decay);
    }

    addToPlayerInventory(products, totalValue) {
        // Add coins to player
        if (window.coins !== undefined) {
            window.coins += totalValue;
        }

        // Group products by type for inventory
        const productCounts = {};
        for (const product of products) {
            productCounts[product.type] = (productCounts[product.type] || 0) + product.quantity;
        }

        // Add to legacy animal products for compatibility
        if (window.animals) {
            for (const [productType, count] of Object.entries(productCounts)) {
                const legacyMapping = {
                    milk: 'milk',
                    eggs: 'eggs',
                    truffles: 'truffles',
                    wool: 'wool'
                };
                
                const legacyType = legacyMapping[productType];
                if (legacyType) {
                    for (const [animalType, animalData] of Object.entries(window.animals)) {
                        if (animalData[legacyType] !== undefined) {
                            animalData[legacyType] = (animalData[legacyType] || 0) + count;
                        }
                    }
                }
            }
        }

        // Trigger UI updates
        if (window.updateUI) {
            window.updateUI();
        }
        if (window.updateAnimalsUI) {
            window.updateAnimalsUI();
        }
    }

    // Get all pending products for collection
    getAllPendingProducts() {
        const allProducts = [];
        
        for (const [animalId, products] of this.pendingProducts.entries()) {
            for (const product of products) {
                this.updateProductFreshness(product);
                allProducts.push(product);
            }
        }

        return allProducts;
    }

    // Get production statistics for an animal
    getProductionStats(animalId) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) return null;

        const pendingProducts = this.pendingProducts.get(animalId) || [];
        const nextProductionTime = this.getNextProductionTime(animal);

        return {
            animalId,
            name: animal.name,
            species: animal.species,
            totalLifetimeProduction: animal.production.totalLifetimeProduction,
            currentProductionRate: this.getProductionRate(animal),
            nextProduction: nextProductionTime,
            pendingProducts: pendingProducts.length,
            currentQuality: this.calculateProductQuality(animal, this.getProductType(animal.species.split('_')[0])),
            productionEfficiency: this.calculateProductionEfficiency(animal)
        };
    }

    getNextProductionTime(animal) {
        const lastProduced = new Date(animal.production.lastProduced).getTime();
        const productionRate = this.getProductionRate(animal);
        return new Date(lastProduced + productionRate);
    }

    calculateProductionEfficiency(animal) {
        // Efficiency based on health, happiness, and genetics
        const health = animal.stats.health;
        const happiness = animal.stats.happiness;
        const productionTrait = animal.genetics.traits[this.getProductionTrait(animal.species.split('_')[0])] || 0.5;
        const careQuality = this.calculateCareQuality(animal);

        return (health * 0.3 + happiness * 0.2 + productionTrait * 0.3 + careQuality * 0.2);
    }

    getProductType(species) {
        return this.productTypes.get(species);
    }

    generateProductId() {
        return 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadProductionRates() {
        const rates = [
            {
                species: 'cow',
                frequency: 43200000, // 12 hours
                baseQuantity: 2.0
            },
            {
                species: 'chicken',
                frequency: 86400000, // 24 hours
                baseQuantity: 1.0
            },
            {
                species: 'pig',
                frequency: 172800000, // 48 hours
                baseQuantity: 1.0
            },
            {
                species: 'sheep',
                frequency: 2592000000, // 30 days (wool)
                baseQuantity: 3.0
            },
            {
                species: 'goat',
                frequency: 43200000, // 12 hours
                baseQuantity: 1.5
            },
            {
                species: 'duck',
                frequency: 86400000, // 24 hours
                baseQuantity: 1.0
            },
            {
                species: 'horse',
                frequency: 86400000, // 24 hours (work)
                baseQuantity: 1.0
            }
        ];

        for (const rate of rates) {
            this.productionRates.set(rate.species, rate);
        }
    }

    loadQualityFactors() {
        // Quality factors are calculated dynamically based on animal stats
        this.qualityFactors.set('health', 0.4);
        this.qualityFactors.set('happiness', 0.3);
        this.qualityFactors.set('genetics', 0.2);
        this.qualityFactors.set('care', 0.1);
    }

    loadProductTypes() {
        const products = [
            {
                id: 'milk',
                name: 'Milk',
                species: 'cow',
                baseValue: 5,
                baseQuantity: 2.0,
                energyCost: 0.05,
                spoilage: { rate: 0.002, time: 86400000 } // Spoils in 24 hours
            },
            {
                id: 'eggs',
                name: 'Eggs',
                species: 'chicken',
                baseValue: 2,
                baseQuantity: 1.0,
                energyCost: 0.03,
                spoilage: { rate: 0.001, time: 172800000 } // Spoils in 48 hours
            },
            {
                id: 'truffles',
                name: 'Truffles',
                species: 'pig',
                baseValue: 8,
                baseQuantity: 1.0,
                energyCost: 0.08,
                spoilage: { rate: 0.0005, time: 259200000 } // Spoils in 72 hours
            },
            {
                id: 'wool',
                name: 'Wool',
                species: 'sheep',
                baseValue: 15,
                baseQuantity: 3.0,
                energyCost: 0.02,
                spoilage: { rate: 0, time: Infinity } // Doesn't spoil
            },
            {
                id: 'goat_milk',
                name: 'Goat Milk',
                species: 'goat',
                baseValue: 6,
                baseQuantity: 1.5,
                energyCost: 0.04,
                spoilage: { rate: 0.002, time: 86400000 }
            },
            {
                id: 'duck_eggs',
                name: 'Duck Eggs',
                species: 'duck',
                baseValue: 3,
                baseQuantity: 1.0,
                energyCost: 0.03,
                spoilage: { rate: 0.001, time: 172800000 }
            },
            {
                id: 'work_hours',
                name: 'Work Hours',
                species: 'horse',
                baseValue: 10,
                baseQuantity: 8.0,
                energyCost: 0.1,
                spoilage: { rate: 0, time: Infinity } // Service doesn't spoil
            }
        ];

        for (const product of products) {
            this.productTypes.set(product.species, product);
        }
    }

    // Save/Load production system state
    save() {
        return {
            pendingProducts: Array.from(this.pendingProducts.entries())
        };
    }

    load(data) {
        if (data.pendingProducts) {
            this.pendingProducts = new Map(data.pendingProducts);
        }
    }
}

// Export for global use
window.ProductionSystem = ProductionSystem;