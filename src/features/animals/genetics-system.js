/**
 * Genetics System for Enhanced Animals Module
 * Handles trait inheritance, mutations, and genetic calculations
 */

class GeneticsSystem {
    constructor() {
        this.initialized = false;
        this.traits = new Map();
        this.dominanceRules = new Map();
    }

    initialize() {
        if (this.initialized) return;
        
        this.loadTraitDefinitions();
        this.initialized = true;
        console.log('Genetics System initialized');
    }

    // Generate genetics for a new animal
    generateGenetics(species, parentGenetics = null) {
        if (parentGenetics) {
            return this.inheritFromParents(species, parentGenetics);
        }
        
        return this.generateRandomGenetics(species);
    }

    generateRandomGenetics(species) {
        const speciesTraits = this.getSpeciesTraits(species);
        const genetics = {
            traits: {},
            dominantGenes: [],
            recessiveGenes: [],
            pedigree: {
                father: null,
                mother: null,
                generation: 1
            }
        };

        // Generate random traits within species bounds
        for (const traitName of Object.keys(speciesTraits)) {
            const traitDef = speciesTraits[traitName];
            genetics.traits[traitName] = this.generateRandomTrait(traitDef);
            
            // Generate alleles
            const dominantAllele = this.generateAllele(traitName, genetics.traits[traitName], true);
            const recessiveAllele = this.generateAllele(traitName, genetics.traits[traitName], false);
            
            genetics.dominantGenes.push(dominantAllele);
            genetics.recessiveGenes.push(recessiveAllele);
        }

        return genetics;
    }

    inheritFromParents(species, parentData) {
        const { father, mother } = parentData;
        const speciesTraits = this.getSpeciesTraits(species);
        
        const genetics = {
            traits: {},
            dominantGenes: [],
            recessiveGenes: [],
            pedigree: {
                father: father.animalId,
                mother: mother.animalId,
                generation: Math.max(father.genetics.pedigree.generation, mother.genetics.pedigree.generation) + 1
            }
        };

        // Inherit traits from parents
        for (const traitName of Object.keys(speciesTraits)) {
            const inheritance = this.inheritTrait(traitName, father.genetics, mother.genetics, speciesTraits[traitName]);
            genetics.traits[traitName] = inheritance.value;
            genetics.dominantGenes.push(inheritance.dominantAllele);
            genetics.recessiveGenes.push(inheritance.recessiveAllele);
        }

        // Apply mutations
        this.applyMutations(genetics, species);

        return genetics;
    }

    inheritTrait(traitName, fatherGenetics, motherGenetics, traitDef) {
        // Get parent alleles
        const fatherAlleles = this.getTraitAlleles(fatherGenetics, traitName);
        const motherAlleles = this.getTraitAlleles(motherGenetics, traitName);

        // Random selection from each parent
        const fatherContribution = fatherAlleles[Math.floor(Math.random() * fatherAlleles.length)];
        const motherContribution = motherAlleles[Math.floor(Math.random() * motherAlleles.length)];

        // Determine dominance
        const { dominant, recessive } = this.determineDominance(fatherContribution, motherContribution, traitName);

        // Calculate trait value
        const baseValue = this.calculateTraitValue(dominant, recessive, traitDef);
        const heritability = traitDef.heritability || 0.5;
        const parentAverage = (fatherGenetics.traits[traitName] + motherGenetics.traits[traitName]) / 2;
        
        // Blend inherited value with parent average based on heritability
        const finalValue = (baseValue * heritability) + (parentAverage * (1 - heritability));

        return {
            value: Math.max(0, Math.min(1, finalValue)), // Clamp to [0, 1]
            dominantAllele: dominant,
            recessiveAllele: recessive
        };
    }

    getTraitAlleles(genetics, traitName) {
        // Extract alleles for specific trait from genetics
        const alleles = [];
        
        for (const allele of genetics.dominantGenes) {
            if (allele.startsWith(traitName)) {
                alleles.push(allele);
            }
        }
        
        for (const allele of genetics.recessiveGenes) {
            if (allele.startsWith(traitName)) {
                alleles.push(allele);
            }
        }

        // If no specific alleles found, generate based on trait value
        if (alleles.length === 0) {
            const value = genetics.traits[traitName];
            alleles.push(this.generateAllele(traitName, value, true));
            alleles.push(this.generateAllele(traitName, value, false));
        }

        return alleles;
    }

    determineDominance(allele1, allele2, traitName) {
        // Check dominance rules
        const rules = this.dominanceRules.get(traitName);
        if (rules) {
            for (const rule of rules) {
                if (rule.includes(allele1) && rule.includes(allele2)) {
                    const index1 = rule.indexOf(allele1);
                    const index2 = rule.indexOf(allele2);
                    if (index1 < index2) {
                        return { dominant: allele1, recessive: allele2 };
                    } else {
                        return { dominant: allele2, recessive: allele1 };
                    }
                }
            }
        }

        // Default: random dominance
        return Math.random() < 0.5 
            ? { dominant: allele1, recessive: allele2 }
            : { dominant: allele2, recessive: allele1 };
    }

    calculateTraitValue(dominantAllele, recessiveAllele, traitDef) {
        // Extract values from allele names
        const dominantValue = this.getAlleleValue(dominantAllele);
        const recessiveValue = this.getAlleleValue(recessiveAllele);

        // Weight dominant allele more heavily
        return (dominantValue * 0.7) + (recessiveValue * 0.3);
    }

    getAlleleValue(allele) {
        // Extract numeric value from allele name (e.g., "milk_production_high_0.8" -> 0.8)
        const match = allele.match(/_(\d+\.?\d*)$/);
        return match ? parseFloat(match[1]) : 0.5;
    }

    generateAllele(traitName, traitValue, isDominant) {
        const intensity = isDominant ? 'high' : 'low';
        const adjustedValue = isDominant ? Math.min(1.0, traitValue + 0.1) : Math.max(0.0, traitValue - 0.1);
        return `${traitName}_${intensity}_${adjustedValue.toFixed(2)}`;
    }

    applyMutations(genetics, species) {
        const mutationRate = 0.05; // 5% chance per trait
        
        for (const traitName of Object.keys(genetics.traits)) {
            if (Math.random() < mutationRate) {
                // Apply mutation
                const mutation = (Math.random() - 0.5) * 0.2; // ±0.1 change
                genetics.traits[traitName] = Math.max(0, Math.min(1, genetics.traits[traitName] + mutation));
                
                // Add mutation marker
                genetics.dominantGenes.push(`${traitName}_mutation_${Date.now()}`);
                
                console.log(`Mutation applied to ${traitName}: ${mutation.toFixed(3)}`);
            }
        }
    }

    generateRandomTrait(traitDef) {
        // Generate value within trait bounds
        const min = traitDef.min || 0;
        const max = traitDef.max || 1;
        const mean = traitDef.mean || (min + max) / 2;
        const variance = traitDef.variance || 0.1;
        
        // Use normal distribution around mean
        return this.normalRandom(mean, variance, min, max);
    }

    normalRandom(mean, variance, min, max) {
        // Box-Muller transform for normal distribution
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        
        const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const value = mean + (normal * Math.sqrt(variance));
        
        return Math.max(min, Math.min(max, value));
    }

    getSpeciesTraits(species) {
        // Define traits for each species
        const baseTraits = {
            milk_production: {
                min: 0.2,
                max: 1.0,
                mean: 0.6,
                variance: 0.1,
                heritability: 0.7
            },
            disease_resistance: {
                min: 0.1,
                max: 0.9,
                mean: 0.5,
                variance: 0.15,
                heritability: 0.4
            },
            growth_rate: {
                min: 0.3,
                max: 1.0,
                mean: 0.7,
                variance: 0.1,
                heritability: 0.6
            },
            temperament: {
                min: 0.0,
                max: 1.0,
                mean: 0.5,
                variance: 0.2,
                heritability: 0.3
            },
            size: {
                min: 0.4,
                max: 1.0,
                mean: 0.7,
                variance: 0.1,
                heritability: 0.8
            }
        };

        // Species-specific trait modifications
        const speciesModifications = {
            cow: {
                milk_production: { mean: 0.8, variance: 0.15 }
            },
            chicken: {
                egg_production: { min: 0.3, max: 1.0, mean: 0.7, variance: 0.1, heritability: 0.6 }
            },
            pig: {
                truffle_finding: { min: 0.1, max: 0.9, mean: 0.4, variance: 0.2, heritability: 0.5 }
            }
        };

        // Merge base traits with species modifications
        const speciesBase = species.split('_')[0]; // e.g., 'cow_holstein' -> 'cow'
        const modifications = speciesModifications[speciesBase] || {};
        
        return { ...baseTraits, ...modifications };
    }

    loadTraitDefinitions() {
        // Load dominance rules
        this.dominanceRules.set('coat_pattern', [
            ['solid', 'spotted', 'striped']
        ]);
        
        this.dominanceRules.set('size', [
            ['large', 'medium', 'small']
        ]);
    }

    // Breeding compatibility check
    areCompatible(genetics1, genetics2, species) {
        // Check for inbreeding
        const inbreedingLevel = this.calculateInbreedingLevel(genetics1, genetics2);
        if (inbreedingLevel > 0.25) {
            return { compatible: false, reason: 'High inbreeding risk' };
        }

        // Check species compatibility
        if (species !== genetics2.species && !this.areSpeciesCompatible(species, genetics2.species)) {
            return { compatible: false, reason: 'Species incompatible' };
        }

        return { compatible: true };
    }

    calculateInbreedingLevel(genetics1, genetics2) {
        // Calculate genetic similarity
        const pedigree1 = genetics1.pedigree;
        const pedigree2 = genetics2.pedigree;
        
        // Check for common ancestors
        if (pedigree1.father === pedigree2.father || 
            pedigree1.mother === pedigree2.mother ||
            pedigree1.father === pedigree2.animalId ||
            pedigree1.mother === pedigree2.animalId) {
            return 0.5; // Parent-offspring or sibling
        }

        // Check for genetic similarity in traits
        const traitNames = Object.keys(genetics1.traits);
        let similarity = 0;
        
        for (const trait of traitNames) {
            const diff = Math.abs(genetics1.traits[trait] - genetics2.traits[trait]);
            similarity += (1 - diff) / traitNames.length;
        }

        return similarity * 0.3; // Reduce weight of trait similarity
    }

    areSpeciesCompatible(species1, species2) {
        // Define compatible species combinations
        const compatiblePairs = [
            ['cow_holstein', 'cow_angus'],
            ['chicken_leghorn', 'chicken_rhode_island'],
            ['pig_yorkshire', 'pig_hampshire']
        ];

        return compatiblePairs.some(pair => 
            (pair[0] === species1 && pair[1] === species2) ||
            (pair[1] === species1 && pair[0] === species2)
        );
    }

    // Calculate breeding value
    calculateBreedingValue(genetics) {
        const traits = genetics.traits;
        const weights = {
            milk_production: 0.3,
            disease_resistance: 0.2,
            growth_rate: 0.2,
            temperament: 0.1,
            size: 0.1,
            egg_production: 0.3,
            truffle_finding: 0.3
        };

        let value = 0;
        let totalWeight = 0;

        for (const [trait, traitValue] of Object.entries(traits)) {
            const weight = weights[trait] || 0.1;
            value += traitValue * weight;
            totalWeight += weight;
        }

        return totalWeight > 0 ? value / totalWeight : 0.5;
    }

    // Offspring calculation
    calculateOffspring(parent1, parent2) {
        const compatibility = this.areCompatible(parent1.genetics, parent2.genetics, parent1.species);
        if (!compatibility.compatible) {
            throw new Error(`Breeding not possible: ${compatibility.reason}`);
        }

        const offspring = this.generateGenetics(parent1.species, {
            father: parent1,
            mother: parent2
        });

        // Calculate success rate based on genetics and health
        const successRate = this.calculateBreedingSuccessRate(parent1, parent2);
        
        return {
            genetics: offspring,
            successRate,
            estimatedBirthTime: this.calculateGestationPeriod(parent1.species)
        };
    }

    calculateBreedingSuccessRate(parent1, parent2) {
        const healthFactor = (parent1.stats.health + parent2.stats.health) / 2;
        const ageFactor = this.calculateAgeFactor(parent1, parent2);
        const geneticsFactor = this.calculateGeneticsFactor(parent1.genetics, parent2.genetics);
        
        return Math.min(0.95, healthFactor * ageFactor * geneticsFactor);
    }

    calculateAgeFactor(parent1, parent2) {
        // Optimal breeding age factors
        const species = parent1.species.split('_')[0];
        const optimalAge = {
            cow: { min: 730, max: 2190 }, // 2-6 years
            chicken: { min: 180, max: 1095 }, // 6 months - 3 years
            pig: { min: 270, max: 1460 } // 9 months - 4 years
        };

        const range = optimalAge[species] || { min: 365, max: 1825 };
        
        const factor1 = this.calculateIndividualAgeFactor(parent1.age, range);
        const factor2 = this.calculateIndividualAgeFactor(parent2.age, range);
        
        return (factor1 + factor2) / 2;
    }

    calculateIndividualAgeFactor(age, range) {
        if (age < range.min) {
            return Math.max(0.3, age / range.min);
        } else if (age > range.max) {
            return Math.max(0.2, 1 - ((age - range.max) / range.max));
        } else {
            return 1.0;
        }
    }

    calculateGeneticsFactor(genetics1, genetics2) {
        const inbreedingLevel = this.calculateInbreedingLevel(genetics1, genetics2);
        return Math.max(0.3, 1 - inbreedingLevel);
    }

    calculateGestationPeriod(species) {
        const periods = {
            cow: 25920000000, // 300 days
            chicken: 1814400000, // 21 days
            pig: 10368000000, // 120 days
            sheep: 12960000000, // 150 days
            horse: 29030400000, // 336 days
            goat: 12960000000, // 150 days
            duck: 2419200000 // 28 days
        };

        const baseSpecies = species.split('_')[0];
        return periods[baseSpecies] || 12960000000; // Default 150 days
    }
}

// Export for global use
window.GeneticsSystem = GeneticsSystem;