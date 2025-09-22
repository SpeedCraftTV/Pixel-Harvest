/**
 * Breeding System for Enhanced Animals Module
 * Handles animal reproduction, pregnancy, and offspring generation
 */

class BreedingSystem {
    constructor() {
        this.initialized = false;
        this.activeBreedings = new Map(); // Active breeding processes
        this.pregnancies = new Map(); // Active pregnancies
        this.breedingCooldowns = new Map(); // Per-animal breeding cooldowns
    }

    initialize() {
        if (this.initialized) return;
        
        this.initialized = true;
        console.log('Breeding System initialized');
    }

    // Check if two animals can breed
    canBreed(parent1Id, parent2Id) {
        const parent1 = window.animalsModule.getAnimal(parent1Id);
        const parent2 = window.animalsModule.getAnimal(parent2Id);

        if (!parent1 || !parent2) {
            return { canBreed: false, reason: 'One or both animals not found' };
        }

        // Check basic compatibility
        const compatibilityCheck = this.checkBasicCompatibility(parent1, parent2);
        if (!compatibilityCheck.compatible) {
            return { canBreed: false, reason: compatibilityCheck.reason };
        }

        // Check maturity
        const maturityCheck = this.checkMaturity(parent1, parent2);
        if (!maturityCheck.mature) {
            return { canBreed: false, reason: maturityCheck.reason };
        }

        // Check health requirements
        const healthCheck = this.checkHealthRequirements(parent1, parent2);
        if (!healthCheck.healthy) {
            return { canBreed: false, reason: healthCheck.reason };
        }

        // Check breeding cooldowns
        const cooldownCheck = this.checkBreedingCooldowns(parent1, parent2);
        if (!cooldownCheck.ready) {
            return { canBreed: false, reason: cooldownCheck.reason };
        }

        // Check pregnancy status
        const pregnancyCheck = this.checkPregnancyStatus(parent1, parent2);
        if (!pregnancyCheck.available) {
            return { canBreed: false, reason: pregnancyCheck.reason };
        }

        // Calculate genetic compatibility
        const geneticsModule = window.animalsModule.genetics;
        const geneticCompatibility = geneticsModule.areCompatible(parent1.genetics, parent2.genetics, parent1.species);
        if (!geneticCompatibility.compatible) {
            return { canBreed: false, reason: geneticCompatibility.reason };
        }

        // Calculate success rate
        const successRate = this.calculateBreedingSuccessRate(parent1, parent2);

        return {
            canBreed: true,
            successRate,
            estimatedOffspring: this.estimateOffspring(parent1, parent2),
            gestationPeriod: this.getGestationPeriod(parent1.species)
        };
    }

    checkBasicCompatibility(parent1, parent2) {
        // Must be different animals
        if (parent1.animalId === parent2.animalId) {
            return { compatible: false, reason: 'Cannot breed animal with itself' };
        }

        // Must be same species (or compatible species)
        if (!this.areSpeciesCompatible(parent1.species, parent2.species)) {
            return { compatible: false, reason: 'Species not compatible for breeding' };
        }

        // Must be different genders
        if (parent1.gender === parent2.gender) {
            return { compatible: false, reason: 'Both animals are the same gender' };
        }

        return { compatible: true };
    }

    checkMaturity(parent1, parent2) {
        const ageInDays1 = parent1.age / 86400000;
        const ageInDays2 = parent2.age / 86400000;
        
        const maturityAge1 = parent1.breeding.maturityAge;
        const maturityAge2 = parent2.breeding.maturityAge;

        if (ageInDays1 < maturityAge1) {
            return { mature: false, reason: `${parent1.name} is too young to breed (${Math.floor(ageInDays1)}/${maturityAge1} days)` };
        }

        if (ageInDays2 < maturityAge2) {
            return { mature: false, reason: `${parent2.name} is too young to breed (${Math.floor(ageInDays2)}/${maturityAge2} days)` };
        }

        return { mature: true };
    }

    checkHealthRequirements(parent1, parent2) {
        const minHealth = 0.6; // Minimum 60% health to breed
        const minHappiness = 0.4; // Minimum 40% happiness to breed

        if (parent1.stats.health < minHealth) {
            return { healthy: false, reason: `${parent1.name} is not healthy enough to breed` };
        }

        if (parent2.stats.health < minHealth) {
            return { healthy: false, reason: `${parent2.name} is not healthy enough to breed` };
        }

        if (parent1.stats.happiness < minHappiness) {
            return { healthy: false, reason: `${parent1.name} is not happy enough to breed` };
        }

        if (parent2.stats.happiness < minHappiness) {
            return { healthy: false, reason: `${parent2.name} is not happy enough to breed` };
        }

        return { healthy: true };
    }

    checkBreedingCooldowns(parent1, parent2) {
        const currentTime = Date.now();
        
        // Check if either animal is on breeding cooldown
        const cooldown1 = this.breedingCooldowns.get(parent1.animalId);
        if (cooldown1 && currentTime < cooldown1) {
            const remainingTime = Math.ceil((cooldown1 - currentTime) / 86400000); // Convert to days
            return { ready: false, reason: `${parent1.name} must wait ${remainingTime} more days to breed again` };
        }

        const cooldown2 = this.breedingCooldowns.get(parent2.animalId);
        if (cooldown2 && currentTime < cooldown2) {
            const remainingTime = Math.ceil((cooldown2 - currentTime) / 86400000);
            return { ready: false, reason: `${parent2.name} must wait ${remainingTime} more days to breed again` };
        }

        return { ready: true };
    }

    checkPregnancyStatus(parent1, parent2) {
        // Check if either animal is already pregnant
        if (this.pregnancies.has(parent1.animalId)) {
            return { available: false, reason: `${parent1.name} is already pregnant` };
        }

        if (this.pregnancies.has(parent2.animalId)) {
            return { available: false, reason: `${parent2.name} is already pregnant` };
        }

        return { available: true };
    }

    areSpeciesCompatible(species1, species2) {
        // Same species can always breed
        if (species1 === species2) return true;

        // Define compatible cross-breeding pairs
        const compatiblePairs = [
            ['cow_holstein', 'cow_angus'],
            ['chicken_leghorn', 'chicken_rhode_island'],
            ['pig_yorkshire', 'pig_hampshire'],
            ['sheep_suffolk', 'sheep_merino']
        ];

        return compatiblePairs.some(pair => 
            (pair[0] === species1 && pair[1] === species2) ||
            (pair[1] === species1 && pair[0] === species2)
        );
    }

    calculateBreedingSuccessRate(parent1, parent2) {
        let successRate = 0.7; // Base 70% success rate

        // Health factor (both parents)
        const avgHealth = (parent1.stats.health + parent2.stats.health) / 2;
        successRate *= (0.5 + (avgHealth * 0.5)); // 50-100% based on health

        // Happiness factor
        const avgHappiness = (parent1.stats.happiness + parent2.stats.happiness) / 2;
        successRate *= (0.8 + (avgHappiness * 0.2)); // 80-100% based on happiness

        // Age factor
        const ageFactor = this.calculateAgeFactor(parent1, parent2);
        successRate *= ageFactor;

        // Genetics factor (avoid inbreeding)
        const geneticsModule = window.animalsModule.genetics;
        const inbreedingLevel = geneticsModule.calculateInbreedingLevel(parent1.genetics, parent2.genetics);
        successRate *= Math.max(0.3, 1 - inbreedingLevel);

        // Care quality factor
        const careQuality = this.calculateCareQuality(parent1, parent2);
        successRate *= careQuality;

        // Environmental factor
        const envFactor = this.calculateEnvironmentalFactor();
        successRate *= envFactor;

        return Math.max(0.1, Math.min(0.95, successRate)); // Clamp between 10% and 95%
    }

    calculateAgeFactor(parent1, parent2) {
        const species = parent1.species.split('_')[0];
        const optimalAgeRanges = {
            cow: { min: 730, max: 2190 }, // 2-6 years
            chicken: { min: 180, max: 1095 }, // 6 months - 3 years
            pig: { min: 270, max: 1460 }, // 9 months - 4 years
            sheep: { min: 365, max: 1825 }, // 1-5 years
            horse: { min: 1095, max: 5475 }, // 3-15 years
            goat: { min: 365, max: 2190 }, // 1-6 years
            duck: { min: 180, max: 1460 } // 6 months - 4 years
        };

        const range = optimalAgeRanges[species] || { min: 365, max: 1825 };
        
        const age1InDays = parent1.age / 86400000;
        const age2InDays = parent2.age / 86400000;
        
        const factor1 = this.getIndividualAgeFactor(age1InDays, range);
        const factor2 = this.getIndividualAgeFactor(age2InDays, range);
        
        return (factor1 + factor2) / 2;
    }

    getIndividualAgeFactor(age, range) {
        if (age < range.min) {
            return Math.max(0.5, age / range.min); // Young animals have reduced fertility
        } else if (age > range.max) {
            const decline = (age - range.max) / (range.max * 0.5);
            return Math.max(0.2, 1 - decline); // Old animals have reduced fertility
        } else {
            return 1.0; // Optimal age range
        }
    }

    calculateCareQuality(parent1, parent2) {
        // Recent feeding and cleaning improve breeding success
        const currentTime = Date.now();
        const dayInMs = 86400000;
        
        let careScore = 0.7; // Base care score
        
        // Check recent feeding (within 24 hours)
        const lastFed1 = new Date(parent1.care.lastFed).getTime();
        const lastFed2 = new Date(parent2.care.lastFed).getTime();
        
        if (currentTime - lastFed1 < dayInMs) careScore += 0.1;
        if (currentTime - lastFed2 < dayInMs) careScore += 0.1;
        
        // Check recent cleaning (within 48 hours)
        const lastCleaned1 = new Date(parent1.care.lastCleaned).getTime();
        const lastCleaned2 = new Date(parent2.care.lastCleaned).getTime();
        
        if (currentTime - lastCleaned1 < dayInMs * 2) careScore += 0.05;
        if (currentTime - lastCleaned2 < dayInMs * 2) careScore += 0.05;

        return Math.min(1.0, careScore);
    }

    calculateEnvironmentalFactor() {
        let factor = 1.0;

        // Weather effects
        if (window.currentWeather) {
            const weatherFactors = {
                sunny: 1.1,
                rainy: 0.9,
                stormy: 0.7,
                snowy: 0.8,
                windy: 0.95
            };
            factor *= weatherFactors[window.currentWeather.type] || 1.0;
        }

        // Season effects on breeding
        if (window.currentSeason) {
            const seasonFactors = {
                spring: 1.2, // Best breeding season
                summer: 1.0,
                autumn: 0.9,
                winter: 0.7
            };
            factor *= seasonFactors[window.currentSeason.type] || 1.0;
        }

        return factor;
    }

    estimateOffspring(parent1, parent2) {
        const species = parent1.species;
        const offspringCounts = {
            cow: { min: 1, max: 1, typical: 1 },
            chicken: { min: 1, max: 8, typical: 4 },
            pig: { min: 4, max: 12, typical: 8 },
            sheep: { min: 1, max: 3, typical: 2 },
            horse: { min: 1, max: 1, typical: 1 },
            goat: { min: 1, max: 4, typical: 2 },
            duck: { min: 2, max: 12, typical: 6 }
        };

        const baseSpecies = species.split('_')[0];
        const counts = offspringCounts[baseSpecies] || { min: 1, max: 2, typical: 1 };
        
        // Health and genetics can affect litter size
        const avgHealth = (parent1.stats.health + parent2.stats.health) / 2;
        const healthBonus = avgHealth > 0.8 ? 1.2 : (avgHealth < 0.5 ? 0.8 : 1.0);
        
        const estimatedCount = Math.round(counts.typical * healthBonus);
        
        return {
            estimated: Math.max(counts.min, Math.min(counts.max, estimatedCount)),
            range: { min: counts.min, max: counts.max }
        };
    }

    getGestationPeriod(species) {
        const gestationPeriods = {
            cow: 25920000000, // 300 days
            chicken: 1814400000, // 21 days
            pig: 10368000000, // 120 days
            sheep: 12960000000, // 150 days
            horse: 29030400000, // 336 days
            goat: 12960000000, // 150 days
            duck: 2419200000 // 28 days
        };

        const baseSpecies = species.split('_')[0];
        return gestationPeriods[baseSpecies] || 12960000000; // Default 150 days
    }

    // Initiate breeding process
    breed(parent1Id, parent2Id) {
        const breedingCheck = this.canBreed(parent1Id, parent2Id);
        if (!breedingCheck.canBreed) {
            throw new Error(`Cannot breed: ${breedingCheck.reason}`);
        }

        const parent1 = window.animalsModule.getAnimal(parent1Id);
        const parent2 = window.animalsModule.getAnimal(parent2Id);

        // Determine which parent will be pregnant (female)
        const pregnantParent = parent1.gender === 'female' ? parent1 : parent2;
        const otherParent = pregnantParent === parent1 ? parent2 : parent1;

        // Roll for breeding success
        const successRate = breedingCheck.successRate;
        const breedingSuccessful = Math.random() < successRate;

        if (!breedingSuccessful) {
            // Breeding failed, but still apply cooldowns
            this.applyBreedingCooldowns(parent1, parent2);
            return {
                success: false,
                reason: 'Breeding attempt was unsuccessful',
                nextAttempt: this.getNextBreedingTime(parent1)
            };
        }

        // Create pregnancy
        const gestationPeriod = this.getGestationPeriod(parent1.species);
        const pregnancy = {
            pregnancyId: this.generatePregnancyId(),
            mother: pregnantParent,
            father: otherParent,
            species: parent1.species,
            conceptionTime: Date.now(),
            dueTime: Date.now() + gestationPeriod,
            estimatedOffspring: this.estimateOffspring(parent1, parent2),
            genetics: null // Will be calculated at birth
        };

        // Store pregnancy
        this.pregnancies.set(pregnantParent.animalId, pregnancy);

        // Update animal breeding status
        pregnantParent.breeding.pregnancyStatus = pregnancy.pregnancyId;
        pregnantParent.breeding.lastBred = new Date().toISOString();
        otherParent.breeding.lastBred = new Date().toISOString();

        // Apply breeding cooldowns
        this.applyBreedingCooldowns(parent1, parent2);

        // Update animal stats (pregnancy effects)
        this.applyPregnancyEffects(pregnantParent);

        return {
            success: true,
            pregnancy,
            mother: pregnantParent.name,
            father: otherParent.name,
            dueDate: new Date(pregnancy.dueTime).toLocaleDateString(),
            estimatedOffspring: pregnancy.estimatedOffspring.estimated
        };
    }

    applyBreedingCooldowns(parent1, parent2) {
        const currentTime = Date.now();
        const species = parent1.species.split('_')[0];
        
        // Species-specific cooldowns
        const cooldownPeriods = {
            cow: 31536000000, // 365 days
            chicken: 2592000000, // 30 days
            pig: 15552000000, // 180 days
            sheep: 15552000000, // 180 days
            horse: 31536000000, // 365 days
            goat: 15552000000, // 180 days
            duck: 2592000000 // 30 days
        };

        const cooldownPeriod = cooldownPeriods[species] || 15552000000; // Default 180 days
        
        this.breedingCooldowns.set(parent1.animalId, currentTime + cooldownPeriod);
        this.breedingCooldowns.set(parent2.animalId, currentTime + cooldownPeriod);
    }

    applyPregnancyEffects(animal) {
        // Pregnancy affects animal stats
        animal.stats.hunger += 0.1; // Increased appetite
        animal.stats.energy -= 0.1; // Reduced energy
        animal.behavior.activity = 'resting'; // More rest needed
    }

    getNextBreedingTime(animal) {
        const cooldown = this.breedingCooldowns.get(animal.animalId);
        return cooldown ? new Date(cooldown) : new Date();
    }

    generatePregnancyId() {
        return 'pregnancy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Update breeding system (called from main update loop)
    update(deltaTime) {
        this.updatePregnancies(deltaTime);
        this.cleanupExpiredCooldowns();
    }

    updatePregnancies(deltaTime) {
        const currentTime = Date.now();
        const completedPregnancies = [];

        for (const [animalId, pregnancy] of this.pregnancies.entries()) {
            // Check if pregnancy is due
            if (currentTime >= pregnancy.dueTime) {
                completedPregnancies.push(pregnancy);
            } else {
                // Update pregnancy effects
                this.updatePregnancyEffects(pregnancy, deltaTime);
            }
        }

        // Process completed pregnancies
        for (const pregnancy of completedPregnancies) {
            this.deliverOffspring(pregnancy);
        }
    }

    updatePregnancyEffects(pregnancy, deltaTime) {
        const mother = pregnancy.mother;
        const pregnancyProgress = (Date.now() - pregnancy.conceptionTime) / (pregnancy.dueTime - pregnancy.conceptionTime);

        // Progressive effects during pregnancy
        if (pregnancyProgress > 0.5) {
            // Later pregnancy effects
            mother.stats.hunger = Math.min(1.0, mother.stats.hunger + 0.00001 * deltaTime);
            mother.stats.energy = Math.max(0.0, mother.stats.energy - 0.000005 * deltaTime);
        }

        // Movement restrictions in late pregnancy
        if (pregnancyProgress > 0.8) {
            mother.behavior.activity = 'resting';
        }
    }

    deliverOffspring(pregnancy) {
        const mother = pregnancy.mother;
        const father = pregnancy.father;
        
        console.log(`${mother.name} is giving birth!`);

        // Calculate actual number of offspring
        const estimatedCount = pregnancy.estimatedOffspring.estimated;
        const minCount = pregnancy.estimatedOffspring.range.min;
        const maxCount = pregnancy.estimatedOffspring.range.max;
        
        // Some variation in actual count
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
        const actualCount = Math.max(minCount, Math.min(maxCount, estimatedCount + variation));

        const offspring = [];

        // Generate each offspring
        for (let i = 0; i < actualCount; i++) {
            const baby = this.createOffspring(mother, father, i);
            offspring.push(baby);
        }

        // Update mother's status
        mother.breeding.pregnancyStatus = null;
        mother.breeding.offspring.push(...offspring.map(baby => baby.animalId));
        
        // Remove pregnancy
        this.pregnancies.delete(mother.animalId);
        
        // Apply post-birth effects
        this.applyPostBirthEffects(mother);

        // Trigger birth event
        this.triggerBirthEvent(mother, father, offspring);

        return offspring;
    }

    createOffspring(mother, father, index) {
        const geneticsModule = window.animalsModule.genetics;
        
        // Generate offspring genetics
        const offspringGenetics = geneticsModule.generateGenetics(mother.species, {
            father: father,
            mother: mother
        });

        // Determine gender
        const speciesConfig = window.animalsModule.species.get(mother.species);
        const genderRatio = speciesConfig?.physicalTraits?.genderRatio || { female: 0.5, male: 0.5 };
        const gender = Math.random() < genderRatio.female ? 'female' : 'male';

        // Generate name
        const baseName = window.animalsModule.generateAnimalName(mother.species.split('_')[0]);
        const name = offspring.length > 1 ? `${baseName} Jr.${index + 1}` : `${baseName} Jr.`;

        // Create baby animal
        const baby = window.animalsModule.createAnimal(mother.species, {
            name,
            gender,
            age: 0, // Newborn
            genetics: offspringGenetics,
            position: { 
                x: mother.position.x + (Math.random() - 0.5) * 2, 
                y: mother.position.y, 
                z: mother.position.z + (Math.random() - 0.5) * 2 
            }
        });

        // Apply baby-specific modifications
        baby.stats.energy = 0.3; // Babies are tired
        baby.stats.hunger = 0.8; // Babies are hungry
        baby.behavior.personality = this.inheritPersonality(mother, father);
        baby.behavior.mood = 'content';
        baby.behavior.activity = 'resting';

        // Special care requirements for babies
        baby.care.needsSpecialCare = true;
        baby.care.weaningAge = this.getWeaningAge(baby.species);

        return baby;
    }

    inheritPersonality(mother, father) {
        const personalities = [mother.behavior.personality, father.behavior.personality];
        
        // 70% chance to inherit from a parent, 30% chance for mutation
        if (Math.random() < 0.7) {
            return personalities[Math.floor(Math.random() * personalities.length)];
        } else {
            const allPersonalities = ['friendly', 'shy', 'aggressive', 'calm', 'playful'];
            return allPersonalities[Math.floor(Math.random() * allPersonalities.length)];
        }
    }

    getWeaningAge(species) {
        const weaningAges = {
            cow: 180, // 6 months
            chicken: 42, // 6 weeks
            pig: 56, // 8 weeks
            sheep: 120, // 4 months
            horse: 180, // 6 months
            goat: 90, // 3 months
            duck: 56 // 8 weeks
        };

        const baseSpecies = species.split('_')[0];
        return weaningAges[baseSpecies] || 90; // Default 3 months
    }

    applyPostBirthEffects(mother) {
        // Mother is tired after birth
        mother.stats.energy = Math.max(0.2, mother.stats.energy - 0.3);
        mother.stats.happiness += 0.2; // Happy about babies
        mother.stats.health -= 0.1; // Birth stress
        
        // Temporary reduced production
        mother.care.medications.push({
            type: 'post_birth_recovery',
            productionPenalty: 0.5,
            duration: 604800000, // 7 days
            applied: Date.now()
        });
    }

    triggerBirthEvent(mother, father, offspring) {
        // Create birth notification
        const birthEvent = {
            type: 'animal_birth',
            timestamp: new Date().toISOString(),
            mother: mother.name,
            father: father.name,
            offspring: offspring.map(baby => ({
                name: baby.name,
                gender: baby.gender,
                id: baby.animalId
            })),
            message: `${mother.name} gave birth to ${offspring.length} ${offspring.length === 1 ? 'baby' : 'babies'}!`
        };

        // Notify the game
        if (window.showInstruction) {
            window.showInstruction(birthEvent.message, 5000);
        }

        console.log('Birth event:', birthEvent);
        
        // Trigger UI update
        if (window.updateAnimalsUI) {
            window.updateAnimalsUI();
        }
    }

    cleanupExpiredCooldowns() {
        const currentTime = Date.now();
        
        for (const [animalId, cooldownTime] of this.breedingCooldowns.entries()) {
            if (currentTime >= cooldownTime) {
                this.breedingCooldowns.delete(animalId);
            }
        }
    }

    // Get breeding status for an animal
    getBreedingStatus(animalId) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) return null;

        const status = {
            canBreed: false,
            isPregnant: false,
            cooldownRemaining: 0,
            nextBreedingDate: null,
            pregnancyProgress: 0,
            dueDate: null
        };

        // Check pregnancy
        const pregnancy = this.pregnancies.get(animalId);
        if (pregnancy) {
            status.isPregnant = true;
            status.pregnancyProgress = (Date.now() - pregnancy.conceptionTime) / (pregnancy.dueTime - pregnancy.conceptionTime);
            status.dueDate = new Date(pregnancy.dueTime);
        }

        // Check cooldown
        const cooldown = this.breedingCooldowns.get(animalId);
        if (cooldown) {
            const remaining = cooldown - Date.now();
            if (remaining > 0) {
                status.cooldownRemaining = remaining;
                status.nextBreedingDate = new Date(cooldown);
            }
        }

        // Check if can breed now
        if (!status.isPregnant && status.cooldownRemaining <= 0) {
            const ageInDays = animal.age / 86400000;
            if (ageInDays >= animal.breeding.maturityAge && 
                animal.stats.health >= 0.6 && 
                animal.stats.happiness >= 0.4) {
                status.canBreed = true;
            }
        }

        return status;
    }

    // Get all pregnancies
    getAllPregnancies() {
        return Array.from(this.pregnancies.values());
    }

    // Save/Load breeding system state
    save() {
        return {
            activeBreedings: Array.from(this.activeBreedings.entries()),
            pregnancies: Array.from(this.pregnancies.entries()),
            breedingCooldowns: Array.from(this.breedingCooldowns.entries())
        };
    }

    load(data) {
        if (data.activeBreedings) {
            this.activeBreedings = new Map(data.activeBreedings);
        }
        if (data.pregnancies) {
            this.pregnancies = new Map(data.pregnancies);
        }
        if (data.breedingCooldowns) {
            this.breedingCooldowns = new Map(data.breedingCooldowns);
        }
    }
}

// Export for global use
window.BreedingSystem = BreedingSystem;