/**
 * Extended Species System for Enhanced Animals Module
 * Adds new farm animals with unique characteristics and requirements
 */

class ExtendedSpeciesSystem {
    constructor() {
        this.initialized = false;
        this.extendedSpecies = new Map();
        this.specializations = new Map();
        this.seasonalBehaviors = new Map();
    }

    initialize() {
        if (this.initialized) return;
        
        this.loadExtendedSpecies();
        this.loadSpecializations();
        this.loadSeasonalBehaviors();
        this.initialized = true;
        console.log('Extended Species System initialized');
    }

    loadExtendedSpecies() {
        const newSpecies = [
            // Sheep Species
            {
                species: 'sheep_suffolk',
                displayName: 'Suffolk Sheep',
                baseSpecies: 'sheep',
                icon: '🐑',
                rarity: 'common',
                unlockRequirements: {
                    level: 3,
                    coins: 80,
                    prerequisites: ['basic_livestock_care']
                },
                physicalTraits: {
                    size: 'medium',
                    lifespan: 2555, // ~7 years
                    maturityAge: 365, // 1 year
                    genderRatio: { male: 0.2, female: 0.8 }
                },
                careRequirements: {
                    food: {
                        types: ['grass', 'hay', 'grain'],
                        frequency: 28800000, // 8 hours
                        amount: 2,
                        preferences: ['pasture_grass', 'clover_hay']
                    },
                    environment: {
                        shelter: 'optional',
                        space: 8,
                        companionship: 'required', // Flock animals
                        temperature: { min: -5, max: 25 }
                    },
                    health: {
                        vetCheckFrequency: 2592000000, // 30 days
                        commonDiseases: ['foot_rot', 'internal_parasites'],
                        vaccinations: ['ovine_general']
                    }
                },
                production: {
                    primary: {
                        type: 'wool',
                        baseRate: 1.0,
                        frequency: 7776000000, // 90 days (seasonal shearing)
                        qualityRange: [0.5, 1.5]
                    },
                    secondary: {
                        type: 'milk',
                        rate: 0.8,
                        frequency: 43200000 // 12 hours (if milked)
                    }
                },
                breeding: {
                    gestationPeriod: 12960000000, // 150 days
                    offspringCount: { min: 1, max: 3, typical: 2 },
                    breedingCooldown: 31536000000, // 365 days
                    fertilityRate: 0.9,
                    inbreedingPenalty: 0.4
                },
                genetics: {
                    traitHeritability: {
                        wool_quality: 0.8,
                        disease_resistance: 0.5,
                        growth_rate: 0.6,
                        flock_behavior: 0.7
                    },
                    mutationRate: 0.03,
                    dominanceRules: {
                        wool_color: ['white > brown > black']
                    }
                },
                specialTraits: {
                    flocking: true,
                    wool_grades: ['fine', 'medium', 'coarse'],
                    seasonal_breeding: true,
                    grazing_efficiency: 1.2
                }
            },

            // Horse Species
            {
                species: 'horse_quarter',
                displayName: 'Quarter Horse',
                baseSpecies: 'horse',
                icon: '🐴',
                rarity: 'uncommon',
                unlockRequirements: {
                    level: 8,
                    coins: 500,
                    prerequisites: ['advanced_animal_care', 'large_pasture']
                },
                physicalTraits: {
                    size: 'large',
                    lifespan: 10950, // ~30 years
                    maturityAge: 1095, // 3 years
                    genderRatio: { male: 0.4, female: 0.6 }
                },
                careRequirements: {
                    food: {
                        types: ['hay', 'oats', 'grass'],
                        frequency: 21600000, // 6 hours
                        amount: 5,
                        preferences: ['alfalfa_hay', 'sweet_oats']
                    },
                    environment: {
                        shelter: 'required',
                        space: 25,
                        companionship: 'preferred',
                        temperature: { min: -10, max: 35 }
                    },
                    health: {
                        vetCheckFrequency: 2592000000, // 30 days
                        commonDiseases: ['colic', 'lameness', 'respiratory_issues'],
                        vaccinations: ['equine_influenza', 'tetanus']
                    },
                    exercise: {
                        required: true,
                        frequency: 86400000, // daily
                        duration: 3600000 // 1 hour
                    }
                },
                production: {
                    primary: {
                        type: 'work_hours',
                        baseRate: 8.0, // 8 hours of work per day
                        frequency: 86400000, // 24 hours
                        qualityRange: [0.6, 1.4]
                    },
                    secondary: {
                        type: 'manure',
                        rate: 3.0,
                        frequency: 86400000
                    }
                },
                breeding: {
                    gestationPeriod: 29030400000, // 336 days (~11 months)
                    offspringCount: { min: 1, max: 1, typical: 1 },
                    breedingCooldown: 63072000000, // 2 years
                    fertilityRate: 0.7,
                    inbreedingPenalty: 0.5
                },
                genetics: {
                    traitHeritability: {
                        speed: 0.8,
                        endurance: 0.7,
                        temperament: 0.6,
                        work_ability: 0.7
                    },
                    mutationRate: 0.02,
                    dominanceRules: {
                        coat_color: ['bay > chestnut > black > gray']
                    }
                },
                specialTraits: {
                    work_types: ['plowing', 'transportation', 'racing'],
                    training_required: true,
                    exercise_needs: 'high',
                    rider_bonding: true
                }
            },

            // Goat Species
            {
                species: 'goat_nubian',
                displayName: 'Nubian Goat',
                baseSpecies: 'goat',
                icon: '🐐',
                rarity: 'common',
                unlockRequirements: {
                    level: 4,
                    coins: 120,
                    prerequisites: ['small_livestock_care']
                },
                physicalTraits: {
                    size: 'medium',
                    lifespan: 2920, // ~8 years
                    maturityAge: 365, // 1 year
                    genderRatio: { male: 0.15, female: 0.85 }
                },
                careRequirements: {
                    food: {
                        types: ['hay', 'browse', 'grain'],
                        frequency: 21600000, // 6 hours
                        amount: 2,
                        preferences: ['browse_mix', 'alfalfa_hay']
                    },
                    environment: {
                        shelter: 'optional',
                        space: 6,
                        companionship: 'required', // Herd animals
                        temperature: { min: -5, max: 30 },
                        climbing_space: 'preferred'
                    },
                    health: {
                        vetCheckFrequency: 2592000000, // 30 days
                        commonDiseases: ['parasites', 'hoof_rot', 'pneumonia'],
                        vaccinations: ['caprine_general']
                    }
                },
                production: {
                    primary: {
                        type: 'goat_milk',
                        baseRate: 1.5,
                        frequency: 43200000, // 12 hours
                        qualityRange: [0.6, 1.3]
                    },
                    secondary: {
                        type: 'land_clearing',
                        rate: 2.0, // square units per day
                        frequency: 86400000
                    }
                },
                breeding: {
                    gestationPeriod: 12960000000, // 150 days
                    offspringCount: { min: 1, max: 4, typical: 2 },
                    breedingCooldown: 15552000000, // 180 days
                    fertilityRate: 0.85,
                    inbreedingPenalty: 0.3
                },
                genetics: {
                    traitHeritability: {
                        milk_production: 0.75,
                        disease_resistance: 0.4,
                        climbing_ability: 0.8,
                        herd_behavior: 0.6
                    },
                    mutationRate: 0.04,
                    dominanceRules: {
                        ear_type: ['long > short'],
                        coat_pattern: ['solid > spotted']
                    }
                },
                specialTraits: {
                    land_clearing: true,
                    climbing_behavior: true,
                    escape_artist: true,
                    milk_variety: ['cheese', 'soap_making']
                }
            },

            // Duck Species
            {
                species: 'duck_pekin',
                displayName: 'Pekin Duck',
                baseSpecies: 'duck',
                icon: '🦆',
                rarity: 'common',
                unlockRequirements: {
                    level: 2,
                    coins: 45,
                    prerequisites: ['water_access']
                },
                physicalTraits: {
                    size: 'small',
                    lifespan: 2555, // ~7 years
                    maturityAge: 180, // 6 months
                    genderRatio: { male: 0.3, female: 0.7 }
                },
                careRequirements: {
                    food: {
                        types: ['waterfowl_feed', 'insects', 'aquatic_plants'],
                        frequency: 21600000, // 6 hours
                        amount: 1,
                        preferences: ['duck_pellets', 'pond_weeds']
                    },
                    environment: {
                        shelter: 'required',
                        space: 4,
                        companionship: 'preferred',
                        temperature: { min: -5, max: 30 },
                        water_access: 'required'
                    },
                    health: {
                        vetCheckFrequency: 5184000000, // 60 days
                        commonDiseases: ['duck_plague', 'botulism'],
                        vaccinations: ['waterfowl_general']
                    }
                },
                production: {
                    primary: {
                        type: 'duck_eggs',
                        baseRate: 1.0,
                        frequency: 86400000, // 24 hours
                        qualityRange: [0.7, 1.2]
                    },
                    secondary: {
                        type: 'feathers',
                        rate: 0.5,
                        frequency: 2592000000 // monthly
                    }
                },
                breeding: {
                    gestationPeriod: 2419200000, // 28 days
                    offspringCount: { min: 6, max: 15, typical: 10 },
                    breedingCooldown: 5184000000, // 60 days
                    fertilityRate: 0.8,
                    inbreedingPenalty: 0.2
                },
                genetics: {
                    traitHeritability: {
                        egg_production: 0.7,
                        water_adaptation: 0.8,
                        disease_resistance: 0.4,
                        foraging_ability: 0.6
                    },
                    mutationRate: 0.05,
                    dominanceRules: {
                        bill_color: ['orange > yellow'],
                        feather_pattern: ['white > mixed']
                    }
                },
                specialTraits: {
                    water_dependent: true,
                    foraging_behavior: true,
                    pest_control: ['insects', 'slugs'],
                    seasonal_laying: true
                }
            },

            // Guard Dog (Specialized Animal)
            {
                species: 'dog_anatolian',
                displayName: 'Anatolian Shepherd',
                baseSpecies: 'dog',
                icon: '🐕',
                rarity: 'uncommon',
                unlockRequirements: {
                    level: 6,
                    coins: 300,
                    prerequisites: ['livestock_protection_training']
                },
                physicalTraits: {
                    size: 'large',
                    lifespan: 4380, // ~12 years
                    maturityAge: 730, // 2 years
                    genderRatio: { male: 0.5, female: 0.5 }
                },
                careRequirements: {
                    food: {
                        types: ['dog_food', 'meat', 'bones'],
                        frequency: 43200000, // 12 hours
                        amount: 3,
                        preferences: ['high_protein_kibble', 'raw_meat']
                    },
                    environment: {
                        shelter: 'optional',
                        space: 15,
                        companionship: 'optional',
                        temperature: { min: -15, max: 35 }
                    },
                    health: {
                        vetCheckFrequency: 2592000000, // 30 days
                        commonDiseases: ['hip_dysplasia', 'bloat'],
                        vaccinations: ['canine_general', 'rabies']
                    },
                    training: {
                        required: true,
                        type: 'livestock_guardian',
                        duration: 15552000000 // 180 days
                    }
                },
                production: {
                    primary: {
                        type: 'protection_service',
                        baseRate: 1.0,
                        frequency: 86400000, // 24 hours
                        qualityRange: [0.8, 1.0]
                    }
                },
                breeding: {
                    gestationPeriod: 5443200000, // 63 days
                    offspringCount: { min: 4, max: 10, typical: 6 },
                    breedingCooldown: 31536000000, // 365 days
                    fertilityRate: 0.8,
                    inbreedingPenalty: 0.4
                },
                genetics: {
                    traitHeritability: {
                        protective_instinct: 0.8,
                        independence: 0.7,
                        livestock_bonding: 0.6,
                        territorial_behavior: 0.75
                    },
                    mutationRate: 0.02,
                    dominanceRules: {
                        size: ['large > medium > small'],
                        coat_type: ['thick > thin']
                    }
                },
                specialTraits: {
                    guard_behavior: true,
                    predator_deterrent: ['wolves', 'coyotes', 'foxes'],
                    livestock_bonding: true,
                    night_activity: true,
                    territory_patrol: true
                }
            },

            // Bee Colony (Exotic/Specialized)
            {
                species: 'bee_italian',
                displayName: 'Italian Bee Colony',
                baseSpecies: 'bee',
                icon: '🐝',
                rarity: 'rare',
                unlockRequirements: {
                    level: 10,
                    coins: 200,
                    prerequisites: ['beekeeping_knowledge', 'flowering_plants']
                },
                physicalTraits: {
                    size: 'colony', // Special size category
                    lifespan: 1825, // ~5 years (queen lifespan)
                    maturityAge: 30, // 30 days to establish
                    genderRatio: { male: 0.05, female: 0.95 } // Drones vs workers/queen
                },
                careRequirements: {
                    food: {
                        types: ['nectar', 'pollen', 'sugar_water'],
                        frequency: 86400000, // daily (natural foraging)
                        amount: 0, // Self-sufficient
                        preferences: ['wildflower_nectar', 'clover_pollen']
                    },
                    environment: {
                        shelter: 'hive_required',
                        space: 1, // Compact space
                        companionship: 'colony',
                        temperature: { min: 5, max: 40 },
                        flowering_radius: 100 // 100 unit foraging radius
                    },
                    health: {
                        vetCheckFrequency: 7776000000, // 90 days
                        commonDiseases: ['varroa_mites', 'nosema', 'american_foulbrood'],
                        vaccinations: [],
                        treatments: ['mite_treatment', 'antibiotics']
                    }
                },
                production: {
                    primary: {
                        type: 'honey',
                        baseRate: 2.0,
                        frequency: 604800000, // weekly
                        qualityRange: [0.8, 1.5]
                    },
                    secondary: {
                        type: 'pollination_service',
                        rate: 1.0,
                        frequency: 86400000,
                        crop_yield_bonus: 0.3 // 30% crop yield increase
                    },
                    tertiary: {
                        type: 'beeswax',
                        rate: 0.2,
                        frequency: 2592000000 // monthly
                    }
                },
                breeding: {
                    gestationPeriod: 1209600000, // 14 days (queen development)
                    offspringCount: { min: 1, max: 5, typical: 2 }, // Swarms
                    breedingCooldown: 15552000000, // 180 days
                    fertilityRate: 0.9,
                    inbreedingPenalty: 0.6 // High penalty for bee genetics
                },
                genetics: {
                    traitHeritability: {
                        honey_production: 0.8,
                        disease_resistance: 0.6,
                        foraging_range: 0.7,
                        docility: 0.5
                    },
                    mutationRate: 0.01, // Low mutation rate
                    dominanceRules: {
                        productivity: ['high > medium > low'],
                        temperament: ['calm > aggressive']
                    }
                },
                specialTraits: {
                    pollination_service: true,
                    seasonal_activity: true,
                    swarming_behavior: true,
                    crop_productivity_bonus: 0.3,
                    weather_sensitive: true,
                    collective_intelligence: true
                }
            }
        ];

        for (const species of newSpecies) {
            this.extendedSpecies.set(species.species, species);
        }
    }

    loadSpecializations() {
        const specializations = [
            {
                id: 'dairy_specialist',
                name: 'Dairy Specialist',
                applicableSpecies: ['cow', 'goat', 'sheep'],
                requirements: {
                    milk_production_trait: 0.8,
                    health_minimum: 0.7
                },
                bonuses: {
                    milk_production: 1.3,
                    milk_quality: 1.2,
                    production_frequency: 0.9 // 10% faster
                },
                unlockCost: { coins: 100, items: { 'veterinary_certificate': 1 } }
            },
            {
                id: 'wool_producer',
                name: 'Premium Wool Producer',
                applicableSpecies: ['sheep'],
                requirements: {
                    wool_quality_trait: 0.7,
                    cleanliness_minimum: 0.8
                },
                bonuses: {
                    wool_quality: 1.5,
                    wool_grade: 'premium',
                    market_value: 1.4
                },
                unlockCost: { coins: 150, items: { 'shearing_certification': 1 } }
            },
            {
                id: 'racing_horse',
                name: 'Racing Horse',
                applicableSpecies: ['horse'],
                requirements: {
                    speed_trait: 0.9,
                    endurance_trait: 0.8,
                    training_level: 'advanced'
                },
                bonuses: {
                    racing_earnings: 500, // per race
                    prestige_points: 10,
                    breeding_value: 1.5
                },
                unlockCost: { coins: 1000, items: { 'racing_license': 1 } }
            },
            {
                id: 'working_horse',
                name: 'Working Horse',
                applicableSpecies: ['horse'],
                requirements: {
                    work_ability_trait: 0.7,
                    temperament_trait: 0.6
                },
                bonuses: {
                    work_efficiency: 1.4,
                    field_work_bonus: 0.2, // 20% faster crop growth on worked fields
                    transportation_capacity: 5 // Can carry 5 units
                },
                unlockCost: { coins: 300, items: { 'work_harness': 1 } }
            },
            {
                id: 'show_animal',
                name: 'Show Animal',
                applicableSpecies: ['cow', 'horse', 'sheep', 'goat'],
                requirements: {
                    overall_quality: 0.85,
                    appearance_score: 0.9
                },
                bonuses: {
                    show_earnings: 200, // per show
                    breeding_requests: 3, // Higher breeding demand
                    prestige_points: 5
                },
                unlockCost: { coins: 400, items: { 'show_registration': 1 } }
            },
            {
                id: 'guard_dog',
                name: 'Livestock Guardian',
                applicableSpecies: ['dog'],
                requirements: {
                    protective_instinct: 0.8,
                    training_completed: true
                },
                bonuses: {
                    predator_protection: 0.95, // 95% protection from predators
                    livestock_stress_reduction: 0.8,
                    territory_coverage: 50 // unit radius
                },
                unlockCost: { coins: 200, items: { 'guardian_training': 1 } }
            },
            {
                id: 'honey_producer',
                name: 'Premium Honey Producer',
                applicableSpecies: ['bee'],
                requirements: {
                    honey_production_trait: 0.8,
                    disease_resistance: 0.7
                },
                bonuses: {
                    honey_quality: 1.6,
                    honey_variety: ['wildflower', 'clover', 'acacia'],
                    pollination_radius: 150
                },
                unlockCost: { coins: 300, items: { 'master_beekeeper_license': 1 } }
            }
        ];

        for (const spec of specializations) {
            this.specializations.set(spec.id, spec);
        }
    }

    loadSeasonalBehaviors() {
        const behaviors = [
            {
                species: 'sheep',
                season: 'spring',
                behaviors: {
                    breeding_season: true,
                    increased_appetite: 1.2,
                    wool_growth_rate: 1.3,
                    grazing_preference: 'new_grass'
                }
            },
            {
                species: 'sheep',
                season: 'autumn',
                behaviors: {
                    wool_harvest_ready: true,
                    fat_accumulation: true,
                    breeding_preparation: true
                }
            },
            {
                species: 'horse',
                season: 'summer',
                behaviors: {
                    increased_water_needs: 1.5,
                    heat_stress_susceptibility: true,
                    peak_work_capacity: true
                }
            },
            {
                species: 'horse',
                season: 'winter',
                behaviors: {
                    increased_feed_needs: 1.3,
                    shelter_requirement: 'essential',
                    reduced_work_capacity: 0.8
                }
            },
            {
                species: 'goat',
                season: 'autumn',
                behaviors: {
                    breeding_season: true,
                    increased_climbing: true,
                    browse_preparation: true
                }
            },
            {
                species: 'duck',
                season: 'spring',
                behaviors: {
                    peak_laying_season: true,
                    nesting_behavior: true,
                    increased_water_activity: true
                }
            },
            {
                species: 'duck',
                season: 'winter',
                behaviors: {
                    reduced_laying: 0.5,
                    increased_shelter_needs: true,
                    flock_behavior_increase: true
                }
            },
            {
                species: 'bee',
                season: 'spring',
                behaviors: {
                    peak_activity: true,
                    swarming_season: true,
                    honey_production_peak: 1.5
                }
            },
            {
                species: 'bee',
                season: 'winter',
                behaviors: {
                    dormant_period: true,
                    honey_consumption: true,
                    cluster_behavior: true,
                    no_production: true
                }
            }
        ];

        for (const behavior of behaviors) {
            const key = `${behavior.species}_${behavior.season}`;
            this.seasonalBehaviors.set(key, behavior.behaviors);
        }
    }

    // Get extended species configuration
    getExtendedSpecies(species) {
        return this.extendedSpecies.get(species);
    }

    // Get all available species
    getAllSpecies() {
        const allSpecies = [];
        
        // Add base species from main animals module
        if (window.animalsModule?.species) {
            for (const species of window.animalsModule.species.values()) {
                allSpecies.push(species);
            }
        }
        
        // Add extended species
        for (const species of this.extendedSpecies.values()) {
            allSpecies.push(species);
        }
        
        return allSpecies;
    }

    // Check if species is unlocked for player
    isSpeciesUnlocked(species, playerLevel = 1, playerCoins = 0, playerPrerequisites = []) {
        const speciesConfig = this.getExtendedSpecies(species) || window.animalsModule?.species?.get(species);
        if (!speciesConfig) return false;

        const requirements = speciesConfig.unlockRequirements;
        
        // Check level requirement
        if (requirements.level && playerLevel < requirements.level) {
            return { unlocked: false, reason: `Requires level ${requirements.level}` };
        }

        // Check coin requirement
        if (requirements.coins && playerCoins < requirements.coins) {
            return { unlocked: false, reason: `Requires ${requirements.coins} coins` };
        }

        // Check prerequisites
        if (requirements.prerequisites) {
            for (const prereq of requirements.prerequisites) {
                if (!playerPrerequisites.includes(prereq)) {
                    return { unlocked: false, reason: `Requires: ${prereq}` };
                }
            }
        }

        return { unlocked: true };
    }

    // Get available specializations for an animal
    getAvailableSpecializations(animal) {
        const species = animal.species.split('_')[0];
        const availableSpecs = [];

        for (const [specId, spec] of this.specializations.entries()) {
            if (spec.applicableSpecies.includes(species)) {
                const meetsRequirements = this.checkSpecializationRequirements(animal, spec);
                availableSpecs.push({
                    ...spec,
                    id: specId,
                    available: meetsRequirements.eligible,
                    reason: meetsRequirements.reason
                });
            }
        }

        return availableSpecs;
    }

    checkSpecializationRequirements(animal, specialization) {
        const requirements = specialization.requirements;

        // Check trait requirements
        for (const [trait, minValue] of Object.entries(requirements)) {
            if (trait.endsWith('_trait')) {
                const traitName = trait.replace('_trait', '');
                const animalTraitValue = animal.genetics.traits[traitName] || 0;
                if (animalTraitValue < minValue) {
                    return { 
                        eligible: false, 
                        reason: `${traitName} trait too low (${Math.round(animalTraitValue * 100)}% < ${Math.round(minValue * 100)}%)` 
                    };
                }
            }
        }

        // Check stat requirements
        for (const [stat, minValue] of Object.entries(requirements)) {
            if (stat.endsWith('_minimum')) {
                const statName = stat.replace('_minimum', '');
                const animalStatValue = animal.stats[statName] || 0;
                if (animalStatValue < minValue) {
                    return { 
                        eligible: false, 
                        reason: `${statName} too low (${Math.round(animalStatValue * 100)}% < ${Math.round(minValue * 100)}%)` 
                    };
                }
            }
        }

        // Check special requirements
        if (requirements.training_level && !this.hasTrainingLevel(animal, requirements.training_level)) {
            return { eligible: false, reason: `Requires ${requirements.training_level} training` };
        }

        if (requirements.training_completed && !this.hasCompletedTraining(animal)) {
            return { eligible: false, reason: 'Training not completed' };
        }

        return { eligible: true };
    }

    hasTrainingLevel(animal, level) {
        // Check if animal has required training level
        const trainingLevels = ['basic', 'intermediate', 'advanced', 'expert'];
        const currentLevel = animal.training?.level || 'none';
        const requiredIndex = trainingLevels.indexOf(level);
        const currentIndex = trainingLevels.indexOf(currentLevel);
        
        return currentIndex >= requiredIndex;
    }

    hasCompletedTraining(animal) {
        return animal.training?.completed || false;
    }

    // Apply specialization to an animal
    applySpecialization(animal, specializationId) {
        const specialization = this.specializations.get(specializationId);
        if (!specialization) {
            throw new Error(`Unknown specialization: ${specializationId}`);
        }

        const meetsRequirements = this.checkSpecializationRequirements(animal, specialization);
        if (!meetsRequirements.eligible) {
            throw new Error(`Cannot apply specialization: ${meetsRequirements.reason}`);
        }

        // Add specialization to animal
        animal.specialization = {
            id: specializationId,
            name: specialization.name,
            appliedAt: new Date().toISOString(),
            bonuses: specialization.bonuses
        };

        // Apply immediate bonuses
        this.applySpecializationBonuses(animal, specialization.bonuses);

        return { success: true, specialization: specialization.name };
    }

    applySpecializationBonuses(animal, bonuses) {
        // Apply production bonuses
        if (bonuses.milk_production) {
            animal.production.rate *= bonuses.milk_production;
        }

        if (bonuses.production_frequency) {
            // This would be applied during production calculations
            animal.production.frequencyModifier = bonuses.production_frequency;
        }

        // Apply stat bonuses
        if (bonuses.health_boost) {
            animal.stats.health = Math.min(1.0, animal.stats.health + bonuses.health_boost);
        }

        if (bonuses.happiness_boost) {
            animal.stats.happiness = Math.min(1.0, animal.stats.happiness + bonuses.happiness_boost);
        }
    }

    // Get seasonal behavior modifiers for an animal
    getSeasonalBehavior(animal, currentSeason) {
        const species = animal.species.split('_')[0];
        const key = `${species}_${currentSeason}`;
        return this.seasonalBehaviors.get(key) || {};
    }

    // Apply seasonal effects to an animal
    applySeasonalEffects(animal, currentSeason) {
        const seasonalBehavior = this.getSeasonalBehavior(animal, currentSeason);
        
        // Apply seasonal modifiers
        for (const [effect, value] of Object.entries(seasonalBehavior)) {
            switch (effect) {
                case 'increased_appetite':
                    animal.stats.hunger += (value - 1) * 0.1;
                    break;
                case 'increased_water_needs':
                    animal.stats.thirst = Math.min(1.0, (animal.stats.thirst || 0.5) * value);
                    break;
                case 'breeding_season':
                    if (value && !animal.breeding.seasonalBreedingBonus) {
                        animal.breeding.seasonalBreedingBonus = 1.5;
                    }
                    break;
                case 'peak_laying_season':
                    if (value) {
                        animal.production.seasonalBonus = 1.3;
                    }
                    break;
                case 'reduced_laying':
                    animal.production.seasonalPenalty = value;
                    break;
                case 'no_production':
                    if (value) {
                        animal.production.seasonalPenalty = 0;
                    }
                    break;
            }
        }
    }

    // Special animal creation for exotic types
    createSpecialAnimal(species, traits = {}) {
        const speciesConfig = this.getExtendedSpecies(species);
        if (!speciesConfig) {
            throw new Error(`Unknown extended species: ${species}`);
        }

        // Use main animals module to create the animal
        const animal = window.animalsModule.createAnimal(species, traits);

        // Apply special traits for extended species
        this.applySpecialTraits(animal, speciesConfig);

        return animal;
    }

    applySpecialTraits(animal, speciesConfig) {
        const specialTraits = speciesConfig.specialTraits || {};

        // Apply special behaviors
        if (specialTraits.flocking && !animal.behavior.flockBehavior) {
            animal.behavior.flockBehavior = true;
            animal.behavior.flockId = this.assignToFlock(animal);
        }

        if (specialTraits.guard_behavior) {
            animal.behavior.guardBehavior = true;
            animal.behavior.protectedArea = 25; // Default protected area radius
        }

        if (specialTraits.collective_intelligence) {
            animal.behavior.collectiveIntelligence = true;
            animal.behavior.colonyId = this.assignToColony(animal);
        }

        // Apply special production capabilities
        if (specialTraits.pollination_service) {
            animal.production.pollinationService = {
                radius: specialTraits.crop_productivity_bonus || 100,
                bonus: specialTraits.crop_productivity_bonus || 0.3
            };
        }

        if (specialTraits.land_clearing) {
            animal.production.landClearing = {
                rate: 2.0, // square units per day
                effectiveness: 0.8
            };
        }

        // Apply special requirements
        if (specialTraits.water_dependent) {
            animal.careRequirements.waterAccess = 'required';
            animal.care.waterAccessLastChecked = new Date().toISOString();
        }

        if (specialTraits.exercise_needs === 'high') {
            animal.careRequirements.exercise = {
                frequency: 86400000, // daily
                duration: 3600000 // 1 hour
            };
        }
    }

    assignToFlock(animal) {
        // Simple flock assignment logic
        const species = animal.species.split('_')[0];
        return `flock_${species}_${Math.floor(Date.now() / 1000000)}`;
    }

    assignToColony(animal) {
        // Simple colony assignment logic
        const species = animal.species.split('_')[0];
        return `colony_${species}_${Math.floor(Date.now() / 1000000)}`;
    }

    // Save/Load extended species system state
    save() {
        return {
            initialized: this.initialized
        };
    }

    load(data) {
        if (data.initialized) {
            this.initialized = data.initialized;
        }
    }
}

// Export for global use
window.ExtendedSpeciesSystem = ExtendedSpeciesSystem;