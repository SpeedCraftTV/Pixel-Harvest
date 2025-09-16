# Animals Module

## Overview
This module enhances the existing animal system in Pixel-Harvest with advanced care mechanics, breeding systems, and expanded animal variety. Related to [Issue #27](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/27).

## Module Responsibilities
- **Animal Care System**: Health, happiness, feeding, and hygiene management
- **Breeding Mechanics**: Genetic traits, reproduction, and offspring generation
- **Expanded Species**: Additional animal types with unique characteristics
- **Product Management**: Enhanced resource production and quality systems
- **Health System**: Disease prevention, treatment, and veterinary care
- **Social Dynamics**: Herd behavior, animal relationships, and mood effects

## Integration Points

### Main Game Loop Integration
```javascript
// In main game update loop (enhance existing updateAnimals)
if (AnimalsModule.isEnabled()) {
    AnimalsModule.updateAnimalNeeds(deltaTime);
    AnimalsModule.processBreeding(deltaTime);
    AnimalsModule.updateAnimalHealth(deltaTime);
    AnimalsModule.generateProducts(deltaTime);
}
```

### Existing Animal System Enhancement
```javascript
// Enhance existing animal update functions
function updateAnimals(deltaTime) {
    // Existing basic animal logic...
    
    // Enhanced animal system
    AnimalsModule.updateAdvancedBehavior(animals, deltaTime);
    AnimalsModule.calculateProductionRates(animals);
}
```

### Index.html Integration
```html
<!-- Enhance existing animals panel -->
<div id="animalsPanel">
    <!-- Existing animal counts and purchase buttons -->
    
    <!-- Enhanced animal management -->
    <div id="animalCare" style="display: none;">
        <div id="selectedAnimalInfo"></div>
        <div id="careActions"></div>
        <div id="breedingInterface"></div>
    </div>
    
    <!-- New veterinary interface -->
    <div id="veterinaryPanel" style="display: none;">
        <div id="healthStatus"></div>
        <div id="treatmentOptions"></div>
    </div>
</div>
```

## API Interface

### Core Functions
```javascript
// Animal management
AnimalsModule.createAnimal(species, traits);
AnimalsModule.getAnimal(animalId);
AnimalsModule.careForAnimal(animalId, careType);

// Breeding system
AnimalsModule.canBreed(parent1Id, parent2Id);
AnimalsModule.breedAnimals(parent1Id, parent2Id);
AnimalsModule.calculateOffspringTraits(parent1, parent2);

// Health system
AnimalsModule.checkHealth(animalId);
AnimalsModule.treatDisease(animalId, treatment);
AnimalsModule.applyPreventiveCare(animalId);
```

## Example TODOs and Tasks

### Phase 1: Enhanced Care System (Week 1-2)
- [ ] **Advanced Animal Needs**
  - Implement hunger system with different food types and preferences
  - Add cleanliness tracking requiring regular cleaning
  - Create happiness/mood system affected by care quality
  - Add exercise needs for different animal types

- [ ] **Detailed Health Tracking**
  - Track individual animal health with multiple factors
  - Implement age-related health changes and requirements
  - Add disease system with prevention and treatment options
  - Create veterinary care system with costs and benefits

- [ ] **Environmental Factors**
  - Weather effects on animal comfort and health
  - Shelter requirements for different seasons
  - Social needs - animals requiring companionship
  - Space requirements affecting animal wellness

### Phase 2: Breeding and Genetics (Week 3-4)
- [ ] **Genetic System**
  - Implement trait inheritance from parent animals
  - Create dominant and recessive gene mechanics
  - Add random mutations for rare traits
  - Track genetic lineage and family trees

- [ ] **Breeding Mechanics**
  - Add breeding cooldowns and maturity requirements
  - Implement pregnancy/incubation periods
  - Create breeding compatibility rules between species
  - Add breeding success rates based on animal health

- [ ] **Offspring Management**
  - Generate offspring with inherited and mutated traits
  - Implement growth stages from baby to adult
  - Add special care requirements for young animals
  - Create naming system for bred animals

### Phase 3: Expanded Species (Week 5-6)
- [ ] **New Farm Animals**
  - Add sheep (wool production, different breeds)
  - Implement horses (transportation, work assistance)
  - Add goats (milk, cheese production, land clearing)
  - Create ducks (eggs, feathers, pond requirements)

- [ ] **Specialized Animals**
  - Add guard animals (dogs, llamas) for protection
  - Implement bee colonies for honey and pollination
  - Create exotic animals with special requirements
  - Add seasonal animals that migrate or hibernate

- [ ] **Animal Specializations**
  - Breeding animals specialized for different products
  - Racing animals with speed competitions
  - Show animals with appearance contests
  - Working animals that assist with farm tasks

### Phase 4: Advanced Features (Week 7-8)
- [ ] **Animal AI and Behavior**
  - Implement realistic animal movement patterns
  - Add animal personalities affecting behavior
  - Create social hierarchies within herds
  - Add animal reactions to player actions and environment

- [ ] **Product Quality System**
  - Link product quality to animal care and genetics
  - Implement premium products from well-cared animals
  - Add product processing and value-added items
  - Create specialty products from rare breeds

- [ ] **Animal Facilities**
  - Build advanced animal housing with upgrade options
  - Add automated feeding and watering systems
  - Implement milking parlors and egg collection systems
  - Create breeding facilities and veterinary clinics

## Data Models

### Enhanced Animal Instance
```javascript
{
    animalId: 'uuid',
    species: 'cow_holstein',
    name: 'Bessie',
    gender: 'female',
    age: 365, // days
    genetics: {
        traits: {
            milk_production: 0.85,
            disease_resistance: 0.6,
            growth_rate: 0.9,
            coat_pattern: 'black_white_spots',
            temperament: 'calm'
        },
        dominantGenes: ['high_milk_A', 'disease_resist_B'],
        recessiveGenes: ['slow_growth_a', 'small_size_b'],
        pedigree: {
            father: 'animal_uuid_123',
            mother: 'animal_uuid_456',
            generation: 3
        }
    },
    stats: {
        health: 0.95,
        happiness: 0.8,
        hunger: 0.3,
        cleanliness: 0.7,
        energy: 0.9,
        social: 0.6
    },
    care: {
        lastFed: 'ISO-timestamp',
        foodType: 'premium_hay',
        lastCleaned: 'ISO-timestamp',
        lastVetVisit: 'ISO-timestamp',
        vaccinations: ['vaccine_A', 'vaccine_B'],
        medications: []
    },
    production: {
        type: 'milk',
        quality: 'premium',
        rate: 1.2, // multiplier based on genetics and care
        lastProduced: 'ISO-timestamp',
        totalLifetimeProduction: 1500
    },
    breeding: {
        maturityAge: 365,
        lastBred: 'ISO-timestamp',
        pregnancyStatus: null,
        breedingValue: 0.8,
        offspring: ['animal_uuid_789']
    },
    behavior: {
        personality: 'friendly',
        mood: 'content',
        activity: 'grazing',
        socialBonds: ['animal_uuid_101', 'animal_uuid_102']
    }
}
```

### Species Configuration
```javascript
{
    species: 'cow_holstein',
    displayName: 'Holstein Cow',
    baseSpecies: 'cow',
    icon: '🐄',
    rarity: 'common',
    unlockRequirements: {
        level: 5,
        coins: 1000,
        prerequisites: ['basic_cow_care']
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
            space: 16, // square units
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
```

### Health and Disease System
```javascript
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
```

## Performance Considerations
- **Animal Scaling**: Efficient algorithms for large herds (100+ animals)
- **Genetic Calculations**: Optimize breeding computations for real-time play
- **Behavior AI**: Balance realistic behavior with performance requirements
- **Memory Management**: Pool animal objects, clean up deceased animals
- **Mobile Optimization**: Simplified breeding interface for touch devices

## Testing Requirements
- [ ] Animal needs decrease and respond to care appropriately
- [ ] Breeding produces offspring with expected trait inheritance
- [ ] Health system accurately tracks and treats diseases
- [ ] Production rates reflect animal care quality and genetics
- [ ] Large numbers of animals don't impact game performance
- [ ] Save/load preserves all animal data correctly

## Dependencies
- Existing animal system (to be enhanced)
- Save/load system for complex animal data
- UI framework for detailed animal management
- Random number generation for genetics
- Timer system for breeding and production cycles

## Configuration
```javascript
// Feature flag in data/features.json
{
    "animals": {
        "enabled": false,
        "version": "0.1.0",
        "config": {
            "maxAnimalsPerFarm": 50,
            "breedingEnabled": true,
            "geneticsComplexity": "medium",
            "diseaseSystem": true,
            "autoCareFeaturesAvailable": true
        }
    }
}
```

## Integration with Other Modules
- **Seasons Module**: Seasonal breeding patterns and care requirements
- **Quests Module**: Animal care and breeding objectives
- **Customization Module**: Animal-themed decorations and farm layouts
- **Multiplayer Module**: Animal trading and cooperative breeding programs

## Accessibility Considerations
- **Visual Indicators**: Clear animal status indicators for color-blind players
- **Audio Cues**: Sound effects for animal needs and health status
- **Simplified Interface**: Optional simplified mode for complex breeding mechanics
- **Touch Accessibility**: Large interaction areas for mobile animal care

---

*This module significantly expands the existing animal system. See [ROADMAP.md](../../ROADMAP.md) for implementation timeline and [design/FEATURE-SPECS.md](../../design/FEATURE-SPECS.md) for detailed technical specifications.*