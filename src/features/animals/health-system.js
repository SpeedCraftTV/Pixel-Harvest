/**
 * Health System for Enhanced Animals Module
 * Handles diseases, treatments, and health management
 */

class HealthSystem {
    constructor() {
        this.initialized = false;
        this.diseases = new Map(); // Disease definitions
        this.treatments = new Map(); // Treatment options
        this.activeDiseases = new Map(); // Active disease instances per animal
        this.healthHistory = new Map(); // Health tracking per animal
    }

    initialize() {
        if (this.initialized) return;
        
        this.loadDiseases();
        this.loadTreatments();
        this.initialized = true;
        console.log('Health System initialized');
    }

    // Check animal health and update disease progression
    updateHealth(animal, deltaTime) {
        // Update existing diseases
        this.updateActiveDiseases(animal, deltaTime);
        
        // Check for new disease onset
        this.checkForNewDiseases(animal, deltaTime);
        
        // Update health history
        this.updateHealthHistory(animal);
        
        // Apply age-related health changes
        this.applyAgeRelatedEffects(animal, deltaTime);
        
        // Process medications and treatments
        this.processActiveTreatments(animal, deltaTime);
    }

    checkHealth(animalId) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) {
            throw new Error(`Animal not found: ${animalId}`);
        }

        const healthReport = {
            animalId,
            name: animal.name,
            overallHealth: animal.stats.health,
            activeDiseases: [],
            healthRisks: [],
            recommendations: [],
            nextVetVisit: this.calculateNextVetVisit(animal),
            immunizations: animal.care.vaccinations || []
        };

        // Check active diseases
        const diseases = this.activeDiseases.get(animalId) || [];
        for (const disease of diseases) {
            healthReport.activeDiseases.push({
                name: disease.name,
                severity: disease.severity,
                stage: disease.stage,
                duration: Date.now() - disease.onsetTime,
                symptoms: disease.symptoms,
                treatment: disease.currentTreatment
            });
        }

        // Assess health risks
        healthReport.healthRisks = this.assessHealthRisks(animal);
        
        // Generate recommendations
        healthReport.recommendations = this.generateHealthRecommendations(animal, healthReport);

        return healthReport;
    }

    treatDisease(animalId, treatment) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) {
            throw new Error(`Animal not found: ${animalId}`);
        }

        const treatmentDef = this.treatments.get(treatment);
        if (!treatmentDef) {
            throw new Error(`Unknown treatment: ${treatment}`);
        }

        // Check if treatment can be applied
        const canTreat = this.canApplyTreatment(animal, treatmentDef);
        if (!canTreat.allowed) {
            return { success: false, reason: canTreat.reason };
        }

        // Apply treatment
        const result = this.applyTreatment(animal, treatmentDef);
        
        return result;
    }

    applyPreventiveCare(animalId) {
        const animal = window.animalsModule.getAnimal(animalId);
        if (!animal) {
            throw new Error(`Animal not found: ${animalId}`);
        }

        const preventiveCare = {
            vaccination: this.applyVaccination(animal),
            healthBooster: this.applyHealthBooster(animal),
            diseaseScreening: this.performDiseaseScreening(animal)
        };

        // Update vet visit record
        animal.care.lastVetVisit = new Date().toISOString();

        return {
            success: true,
            care: preventiveCare,
            message: `${animal.name} received comprehensive preventive care`
        };
    }

    updateActiveDiseases(animal, deltaTime) {
        const animalDiseases = this.activeDiseases.get(animal.animalId) || [];
        const updatedDiseases = [];

        for (const diseaseInstance of animalDiseases) {
            const updated = this.progressDisease(diseaseInstance, animal, deltaTime);
            if (updated) {
                updatedDiseases.push(updated);
            }
        }

        if (updatedDiseases.length > 0) {
            this.activeDiseases.set(animal.animalId, updatedDiseases);
        } else {
            this.activeDiseases.delete(animal.animalId);
        }
    }

    progressDisease(diseaseInstance, animal, deltaTime) {
        const diseaseDef = this.diseases.get(diseaseInstance.diseaseId);
        if (!diseaseDef) return null;

        // Update disease duration
        diseaseInstance.duration = Date.now() - diseaseInstance.onsetTime;

        // Check if disease should recover
        if (diseaseInstance.duration >= diseaseDef.recoveryTime) {
            this.recoverFromDisease(animal, diseaseInstance);
            return null; // Disease recovered
        }

        // Apply disease effects
        this.applyDiseaseEffects(animal, diseaseInstance, diseaseDef, deltaTime);

        // Progress disease stage
        this.updateDiseaseStage(diseaseInstance, diseaseDef);

        // Check for treatment effects
        if (diseaseInstance.currentTreatment) {
            this.applyTreatmentEffects(diseaseInstance, animal, deltaTime);
        }

        return diseaseInstance;
    }

    applyDiseaseEffects(animal, diseaseInstance, diseaseDef, deltaTime) {
        const effects = diseaseDef.effects;
        const severity = this.getDiseaseSeverityMultiplier(diseaseInstance);

        // Apply stat effects
        for (const [effect, value] of Object.entries(effects)) {
            switch (effect) {
                case 'health':
                    animal.stats.health = Math.max(0, animal.stats.health + (value * severity * deltaTime * 0.000001));
                    break;
                case 'happiness':
                    animal.stats.happiness = Math.max(0, animal.stats.happiness + (value * severity * deltaTime * 0.000001));
                    break;
                case 'energy':
                    animal.stats.energy = Math.max(0, animal.stats.energy + (value * severity * deltaTime * 0.000001));
                    break;
                case 'milk_production':
                case 'egg_production':
                case 'truffle_finding':
                    // Production effects are handled by production system
                    break;
                case 'contagiousness':
                    this.checkForContagion(animal, diseaseInstance, value * severity);
                    break;
            }
        }

        // Update symptoms
        diseaseInstance.symptoms = this.generateSymptoms(diseaseDef, diseaseInstance);
    }

    getDiseaseSeverityMultiplier(diseaseInstance) {
        const severityMultipliers = {
            mild: 0.5,
            moderate: 1.0,
            severe: 1.5,
            critical: 2.0
        };

        return severityMultipliers[diseaseInstance.severity] || 1.0;
    }

    updateDiseaseStage(diseaseInstance, diseaseDef) {
        const duration = diseaseInstance.duration;
        const totalDuration = diseaseDef.recoveryTime;
        const progress = duration / totalDuration;

        if (progress < 0.25) {
            diseaseInstance.stage = 'onset';
        } else if (progress < 0.75) {
            diseaseInstance.stage = 'active';
        } else {
            diseaseInstance.stage = 'recovery';
        }
    }

    generateSymptoms(diseaseDef, diseaseInstance) {
        const baseSymptoms = diseaseDef.symptoms || [];
        const stageSymptoms = {
            onset: ['lethargy', 'mild_discomfort'],
            active: baseSymptoms,
            recovery: ['improving', 'restlessness']
        };

        return stageSymptoms[diseaseInstance.stage] || baseSymptoms;
    }

    checkForContagion(sourceAnimal, diseaseInstance, contagiousness) {
        if (contagiousness <= 0) return;

        // Find nearby animals
        const careSystem = window.animalsModule.care;
        const nearbyAnimals = careSystem.findNearbyAnimals(sourceAnimal, 5);

        for (const nearbyAnimal of nearbyAnimals) {
            // Check if already has this disease
            const nearbyDiseases = this.activeDiseases.get(nearbyAnimal.animalId) || [];
            const hasDisease = nearbyDiseases.some(d => d.diseaseId === diseaseInstance.diseaseId);
            
            if (!hasDisease) {
                // Roll for contagion
                const transmissionRate = contagiousness * 0.001; // Very low base rate
                const resistance = nearbyAnimal.genetics.traits.disease_resistance || 0.5;
                const actualRate = transmissionRate * (1 - resistance);
                
                if (Math.random() < actualRate) {
                    this.infectAnimal(nearbyAnimal, diseaseInstance.diseaseId, 'mild');
                    console.log(`${nearbyAnimal.name} contracted ${diseaseInstance.name} from ${sourceAnimal.name}`);
                }
            }
        }
    }

    checkForNewDiseases(animal, deltaTime) {
        // Random disease onset based on various factors
        const baseRiskRate = 0.0001; // Very low base rate per millisecond
        
        // Calculate risk factors
        const riskFactors = this.calculateDiseaseRiskFactors(animal);
        const totalRisk = baseRiskRate * riskFactors.total * deltaTime;

        if (Math.random() < totalRisk) {
            // Select a disease to potentially contract
            const possibleDiseases = this.getPossibleDiseases(animal);
            if (possibleDiseases.length > 0) {
                const disease = possibleDiseases[Math.floor(Math.random() * possibleDiseases.length)];
                const severity = this.determineDiseaseInitialSeverity(animal, disease);
                this.infectAnimal(animal, disease.diseaseId, severity);
            }
        }
    }

    calculateDiseaseRiskFactors(animal) {
        let total = 1.0;
        const factors = {};

        // Poor health increases risk
        if (animal.stats.health < 0.5) {
            factors.poor_health = 2.0;
            total *= 2.0;
        }

        // Poor cleanliness increases risk
        if (animal.stats.cleanliness < 0.3) {
            factors.poor_hygiene = 1.5;
            total *= 1.5;
        }

        // Stress/unhappiness increases risk
        if (animal.stats.happiness < 0.4) {
            factors.stress = 1.3;
            total *= 1.3;
        }

        // Age factors
        const ageInDays = animal.age / 86400000;
        if (ageInDays < 30) { // Very young
            factors.young_age = 1.4;
            total *= 1.4;
        } else if (ageInDays > (this.getSpeciesLifespan(animal.species) * 0.8)) { // Old age
            factors.old_age = 1.6;
            total *= 1.6;
        }

        // Genetic resistance
        const resistance = animal.genetics.traits.disease_resistance || 0.5;
        factors.genetic_resistance = 1 - resistance;
        total *= (1 - (resistance * 0.5)); // Max 50% resistance

        // Environmental factors
        if (window.currentWeather?.type === 'stormy') {
            factors.bad_weather = 1.2;
            total *= 1.2;
        }

        factors.total = total;
        return factors;
    }

    getPossibleDiseases(animal) {
        const species = animal.species.split('_')[0];
        const possibleDiseases = [];

        for (const [diseaseId, disease] of this.diseases.entries()) {
            if (disease.affectedSpecies.includes(species)) {
                // Check if animal already has this disease
                const existingDiseases = this.activeDiseases.get(animal.animalId) || [];
                const hasDisease = existingDiseases.some(d => d.diseaseId === diseaseId);
                
                if (!hasDisease) {
                    possibleDiseases.push(disease);
                }
            }
        }

        return possibleDiseases;
    }

    determineDiseaseInitialSeverity(animal, disease) {
        const resistance = animal.genetics.traits.disease_resistance || 0.5;
        const healthStatus = animal.stats.health;
        
        // Better health and resistance lead to milder cases
        const severityScore = (1 - resistance) + (1 - healthStatus);
        
        if (severityScore < 0.5) return 'mild';
        if (severityScore < 1.0) return 'moderate';
        if (severityScore < 1.5) return 'severe';
        return 'critical';
    }

    infectAnimal(animal, diseaseId, severity) {
        const disease = this.diseases.get(diseaseId);
        if (!disease) return;

        const diseaseInstance = {
            diseaseId,
            name: disease.name,
            severity,
            stage: 'onset',
            onsetTime: Date.now(),
            duration: 0,
            symptoms: [],
            currentTreatment: null,
            treatmentHistory: []
        };

        // Add to active diseases
        const animalDiseases = this.activeDiseases.get(animal.animalId) || [];
        animalDiseases.push(diseaseInstance);
        this.activeDiseases.set(animal.animalId, animalDiseases);

        // Notify about disease
        if (window.showInstruction) {
            window.showInstruction(`${animal.name} has contracted ${disease.name}`, 4000);
        }

        console.log(`${animal.name} infected with ${disease.name} (${severity})`);
    }

    recoverFromDisease(animal, diseaseInstance) {
        // Apply recovery effects
        animal.stats.health = Math.min(1.0, animal.stats.health + 0.1);
        animal.stats.happiness = Math.min(1.0, animal.stats.happiness + 0.05);

        // Add immunity
        animal.care.medications.push({
            type: 'disease_immunity',
            disease: diseaseInstance.diseaseId,
            strength: 0.8,
            duration: 15552000000, // 180 days
            applied: Date.now()
        });

        console.log(`${animal.name} recovered from ${diseaseInstance.name}`);
        
        if (window.showInstruction) {
            window.showInstruction(`${animal.name} recovered from ${diseaseInstance.name}!`, 3000);
        }
    }

    canApplyTreatment(animal, treatment) {
        // Check if animal has compatible diseases
        const animalDiseases = this.activeDiseases.get(animal.animalId) || [];
        const compatibleDiseases = animalDiseases.filter(d => 
            treatment.treatedDiseases.includes(d.diseaseId) || 
            treatment.treatedDiseases.includes('all')
        );

        if (compatibleDiseases.length === 0 && treatment.treatedDiseases[0] !== 'preventive') {
            return { allowed: false, reason: 'No compatible diseases to treat' };
        }

        // Check treatment requirements
        if (treatment.requirements) {
            for (const req of treatment.requirements) {
                if (!this.checkTreatmentRequirement(animal, req)) {
                    return { allowed: false, reason: `Requirement not met: ${req.description}` };
                }
            }
        }

        // Check costs
        if (treatment.cost) {
            // This would integrate with the game's economy system
            if (treatment.cost.coins && (!window.coins || window.coins < treatment.cost.coins)) {
                return { allowed: false, reason: 'Insufficient coins' };
            }
        }

        return { allowed: true };
    }

    applyTreatment(animal, treatment) {
        const results = {
            success: true,
            treated: [],
            effects: [],
            cost: treatment.cost
        };

        // Apply treatment to relevant diseases
        const animalDiseases = this.activeDiseases.get(animal.animalId) || [];
        
        for (const diseaseInstance of animalDiseases) {
            if (treatment.treatedDiseases.includes(diseaseInstance.diseaseId) || 
                treatment.treatedDiseases.includes('all')) {
                
                this.applyTreatmentToDisease(diseaseInstance, treatment);
                results.treated.push(diseaseInstance.name);
            }
        }

        // Apply direct stat effects
        if (treatment.effects.stats) {
            for (const [stat, change] of Object.entries(treatment.effects.stats)) {
                const oldValue = animal.stats[stat];
                animal.stats[stat] = Math.max(0, Math.min(1, oldValue + change));
                
                results.effects.push({
                    stat,
                    oldValue,
                    newValue: animal.stats[stat],
                    change
                });
            }
        }

        // Apply preventive effects
        if (treatment.effects.prevention) {
            animal.care.medications.push({
                type: 'disease_prevention',
                prevention: treatment.effects.prevention,
                duration: treatment.duration || 604800000, // 7 days default
                applied: Date.now()
            });
        }

        // Apply costs
        if (treatment.cost?.coins) {
            window.coins = (window.coins || 0) - treatment.cost.coins;
        }

        return results;
    }

    applyTreatmentToDisease(diseaseInstance, treatment) {
        diseaseInstance.currentTreatment = {
            treatmentId: treatment.id,
            startTime: Date.now(),
            duration: treatment.duration,
            effectiveness: treatment.effectiveness
        };

        diseaseInstance.treatmentHistory.push({
            treatment: treatment.id,
            appliedAt: Date.now(),
            effectiveness: treatment.effectiveness
        });
    }

    applyTreatmentEffects(diseaseInstance, animal, deltaTime) {
        const treatment = diseaseInstance.currentTreatment;
        if (!treatment) return;

        // Check if treatment duration is complete
        const elapsed = Date.now() - treatment.startTime;
        if (elapsed >= treatment.duration) {
            diseaseInstance.currentTreatment = null;
            return;
        }

        // Apply healing effects
        const healingRate = treatment.effectiveness * 0.000001 * deltaTime;
        animal.stats.health = Math.min(1.0, animal.stats.health + healingRate);

        // Reduce disease severity over time
        const progress = elapsed / treatment.duration;
        if (progress > 0.5 && diseaseInstance.severity !== 'mild') {
            const severities = ['critical', 'severe', 'moderate', 'mild'];
            const currentIndex = severities.indexOf(diseaseInstance.severity);
            if (currentIndex > 0) {
                diseaseInstance.severity = severities[currentIndex - 1];
            }
        }
    }

    applyVaccination(animal) {
        const species = animal.species.split('_')[0];
        const vaccines = this.getAvailableVaccines(species);
        
        for (const vaccine of vaccines) {
            // Check if already vaccinated
            const existing = animal.care.vaccinations.find(v => v.vaccine === vaccine.id);
            if (!existing || this.needsBooster(existing, vaccine)) {
                animal.care.vaccinations.push({
                    vaccine: vaccine.id,
                    date: new Date().toISOString(),
                    effectiveness: vaccine.effectiveness,
                    duration: vaccine.duration
                });
            }
        }

        return vaccines.length;
    }

    getAvailableVaccines(species) {
        const vaccines = {
            cow: [
                { id: 'bovine_general', effectiveness: 0.8, duration: 31536000000 }, // 1 year
                { id: 'mastitis_prevention', effectiveness: 0.7, duration: 15552000000 } // 6 months
            ],
            chicken: [
                { id: 'poultry_general', effectiveness: 0.75, duration: 15552000000 }
            ],
            pig: [
                { id: 'swine_general', effectiveness: 0.8, duration: 31536000000 }
            ]
        };

        return vaccines[species] || [];
    }

    needsBooster(vaccination, vaccine) {
        const timeSinceVaccination = Date.now() - new Date(vaccination.date).getTime();
        return timeSinceVaccination >= vaccine.duration;
    }

    applyHealthBooster(animal) {
        // General health improvement
        animal.stats.health = Math.min(1.0, animal.stats.health + 0.1);
        
        // Add temporary health boost
        animal.care.medications.push({
            type: 'health_boost',
            boost: 0.05,
            duration: 2592000000, // 30 days
            applied: Date.now()
        });

        return { boost: 0.1, duration: '30 days' };
    }

    performDiseaseScreening(animal) {
        const results = {
            risksDetected: [],
            earlyDetection: [],
            recommendations: []
        };

        // Check for early disease signs
        const animalDiseases = this.activeDiseases.get(animal.animalId) || [];
        for (const disease of animalDiseases) {
            if (disease.stage === 'onset') {
                results.earlyDetection.push(disease.name);
            }
        }

        // Assess risk factors
        const riskFactors = this.calculateDiseaseRiskFactors(animal);
        if (riskFactors.total > 1.5) {
            results.risksDetected.push('High disease risk detected');
            results.recommendations.push('Improve animal care routine');
        }

        return results;
    }

    assessHealthRisks(animal) {
        const risks = [];
        
        // Poor health
        if (animal.stats.health < 0.4) {
            risks.push({
                type: 'poor_health',
                severity: 'high',
                description: 'Animal health is critically low'
            });
        }

        // Poor hygiene
        if (animal.stats.cleanliness < 0.3) {
            risks.push({
                type: 'poor_hygiene',
                severity: 'medium',
                description: 'Poor hygiene increases disease risk'
            });
        }

        // Age-related risks
        const ageInDays = animal.age / 86400000;
        const lifespan = this.getSpeciesLifespan(animal.species);
        if (ageInDays > lifespan * 0.8) {
            risks.push({
                type: 'old_age',
                severity: 'medium',
                description: 'Advanced age increases health risks'
            });
        }

        // Genetic predispositions
        const resistance = animal.genetics.traits.disease_resistance || 0.5;
        if (resistance < 0.3) {
            risks.push({
                type: 'genetic_vulnerability',
                severity: 'low',
                description: 'Genetic predisposition to diseases'
            });
        }

        return risks;
    }

    generateHealthRecommendations(animal, healthReport) {
        const recommendations = [];

        // Disease-specific recommendations
        for (const disease of healthReport.activeDiseases) {
            if (!disease.treatment) {
                recommendations.push(`Treat ${disease.name} immediately`);
            }
        }

        // General health recommendations
        if (animal.stats.health < 0.6) {
            recommendations.push('Schedule veterinary checkup');
        }

        if (animal.stats.cleanliness < 0.5) {
            recommendations.push('Improve hygiene and cleaning routine');
        }

        if (animal.stats.happiness < 0.5) {
            recommendations.push('Increase social interaction and environmental enrichment');
        }

        // Preventive care recommendations
        const daysSinceVetVisit = animal.care.lastVetVisit 
            ? (Date.now() - new Date(animal.care.lastVetVisit).getTime()) / 86400000
            : 999;
        
        if (daysSinceVetVisit > 90) {
            recommendations.push('Schedule routine veterinary checkup');
        }

        return recommendations;
    }

    calculateNextVetVisit(animal) {
        const lastVisit = animal.care.lastVetVisit 
            ? new Date(animal.care.lastVetVisit).getTime()
            : 0;
        
        const recommendedInterval = 7776000000; // 90 days
        const nextVisit = new Date(lastVisit + recommendedInterval);
        
        return nextVisit;
    }

    applyAgeRelatedEffects(animal, deltaTime) {
        const ageInDays = animal.age / 86400000;
        const lifespan = this.getSpeciesLifespan(animal.species);
        const ageRatio = ageInDays / lifespan;

        // Very young animals are more vulnerable
        if (ageInDays < 30) {
            animal.stats.health = Math.max(0, animal.stats.health - 0.0000005 * deltaTime);
        }

        // Old age effects
        if (ageRatio > 0.8) {
            const agingRate = (ageRatio - 0.8) * 0.000001 * deltaTime;
            animal.stats.health = Math.max(0, animal.stats.health - agingRate);
            animal.stats.energy = Math.max(0, animal.stats.energy - agingRate * 0.5);
        }
    }

    processActiveTreatments(animal, deltaTime) {
        // This is handled by individual disease treatment processing
        // Could add additional system-wide treatment effects here
    }

    updateHealthHistory(animal) {
        const history = this.healthHistory.get(animal.animalId) || [];
        
        // Add daily health snapshot
        const today = new Date().toDateString();
        const lastEntry = history[history.length - 1];
        
        if (!lastEntry || lastEntry.date !== today) {
            history.push({
                date: today,
                health: animal.stats.health,
                activeDiseases: (this.activeDiseases.get(animal.animalId) || []).length,
                treatments: animal.care.medications.filter(m => m.type.includes('treatment')).length
            });

            // Keep only last 30 days
            if (history.length > 30) {
                history.splice(0, history.length - 30);
            }

            this.healthHistory.set(animal.animalId, history);
        }
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

    checkTreatmentRequirement(animal, requirement) {
        switch (requirement.type) {
            case 'min_health':
                return animal.stats.health >= requirement.value;
            case 'max_age':
                return (animal.age / 86400000) <= requirement.value;
            case 'has_disease':
                const diseases = this.activeDiseases.get(animal.animalId) || [];
                return diseases.some(d => d.diseaseId === requirement.disease);
            default:
                return true;
        }
    }

    loadDiseases() {
        const diseases = [
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
                effects: {
                    milk_production: -0.5,
                    happiness: -0.3,
                    contagiousness: 0.2
                },
                recoveryTime: 604800000 // 7 days
            },
            {
                diseaseId: 'fowl_pox',
                name: 'Fowl Pox',
                description: 'Viral infection affecting chickens and ducks',
                severity: 'mild',
                affectedSpecies: ['chicken', 'duck'],
                symptoms: ['skin_lesions', 'reduced_appetite', 'lethargy'],
                causes: {
                    poor_hygiene: 0.3,
                    overcrowding: 0.4,
                    weather_stress: 0.2,
                    genetics: 0.1
                },
                prevention: {
                    vaccination: 0.8,
                    good_ventilation: 0.5
                },
                effects: {
                    egg_production: -0.3,
                    happiness: -0.2,
                    contagiousness: 0.3
                },
                recoveryTime: 1209600000 // 14 days
            },
            {
                diseaseId: 'swine_flu',
                name: 'Swine Flu',
                description: 'Respiratory infection in pigs',
                severity: 'severe',
                affectedSpecies: ['pig'],
                symptoms: ['coughing', 'fever', 'reduced_appetite'],
                causes: {
                    poor_ventilation: 0.4,
                    overcrowding: 0.3,
                    stress: 0.2,
                    genetics: 0.1
                },
                prevention: {
                    vaccination: 0.7,
                    good_ventilation: 0.6,
                    quarantine: 0.8
                },
                effects: {
                    truffle_finding: -0.6,
                    health: -0.4,
                    happiness: -0.5,
                    contagiousness: 0.5
                },
                recoveryTime: 1814400000 // 21 days
            }
        ];

        for (const disease of diseases) {
            this.diseases.set(disease.diseaseId, disease);
        }
    }

    loadTreatments() {
        const treatments = [
            {
                id: 'antibiotics',
                name: 'Antibiotics',
                description: 'Broad-spectrum antibiotic treatment',
                treatedDiseases: ['mastitis', 'swine_flu'],
                effectiveness: 0.8,
                duration: 604800000, // 7 days
                cost: { coins: 50 },
                effects: {
                    stats: { health: 0.1 }
                },
                sideEffects: {
                    happiness: -0.05 // Animals don't like medicine
                }
            },
            {
                id: 'vaccination',
                name: 'Vaccination',
                description: 'Preventive immunization',
                treatedDiseases: ['preventive'],
                effectiveness: 0.8,
                duration: 31536000000, // 1 year
                cost: { coins: 25 },
                effects: {
                    prevention: {
                        diseases: ['all'],
                        effectiveness: 0.7
                    }
                }
            },
            {
                id: 'antiviral',
                name: 'Antiviral Medication',
                description: 'Treatment for viral infections',
                treatedDiseases: ['fowl_pox'],
                effectiveness: 0.6,
                duration: 1209600000, // 14 days
                cost: { coins: 30 },
                effects: {
                    stats: { health: 0.05 }
                }
            },
            {
                id: 'natural_remedy',
                name: 'Natural Herbal Remedy',
                description: 'Gentle herbal treatment',
                treatedDiseases: ['all'],
                effectiveness: 0.4,
                duration: 1209600000, // 14 days
                cost: { coins: 15 },
                effects: {
                    stats: { 
                        health: 0.03,
                        happiness: 0.1 // Animals prefer natural treatments
                    }
                }
            }
        ];

        for (const treatment of treatments) {
            this.treatments.set(treatment.id, treatment);
        }
    }

    // Save/Load health system state
    save() {
        return {
            activeDiseases: Array.from(this.activeDiseases.entries()),
            healthHistory: Array.from(this.healthHistory.entries())
        };
    }

    load(data) {
        if (data.activeDiseases) {
            this.activeDiseases = new Map(data.activeDiseases);
        }
        if (data.healthHistory) {
            this.healthHistory = new Map(data.healthHistory);
        }
    }
}

// Export for global use
window.HealthSystem = HealthSystem;