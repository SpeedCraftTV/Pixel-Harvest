# Seasons Module

## Overview
This module implements enhanced seasonal events and dynamic weather systems for Pixel-Harvest, building upon the existing basic weather system. Related to [Issue #25](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/25).

## Module Responsibilities
- **Dynamic Weather Events**: Storms, droughts, perfect growing conditions
- **Seasonal Festivals**: Harvest festivals, spring celebrations, winter events
- **Random Challenges**: Pest invasions, natural disasters, equipment failures
- **Event Scheduling**: Time-based and condition-based event triggers
- **Reward Systems**: Special items, decorations, and bonuses from events
- **Visual Effects**: Enhanced weather animations and seasonal decorations

## Integration Points

### Main Game Loop Integration
```javascript
// In main game update loop
if (SeasonsModule.isEnabled()) {
    SeasonsModule.updateWeatherSystem(deltaTime);
    SeasonsModule.checkEventTriggers(gameState);
    SeasonsModule.processActiveEvents(deltaTime);
}
```

### Existing Weather System Hooks
- Enhance `updateWeather()` function with new weather types
- Extend `currentWeather` object with event-specific properties
- Add seasonal modifiers to existing crop growth calculations

### Index.html Integration
```html
<!-- Enhance existing weather panel -->
<div id="weatherPanel">
    <!-- Existing weather display -->
    <div id="activeEvents" style="display: none;">
        <div id="eventNotification"></div>
        <div id="eventProgress"></div>
    </div>
</div>

<!-- Add event overlay -->
<div id="eventOverlay" style="display: none;">
    <div id="eventDetails"></div>
    <div id="eventRewards"></div>
</div>
```

## API Interface

### Core Functions
```javascript
// Event management
SeasonsModule.registerEvent(eventDefinition);
SeasonsModule.triggerEvent(eventId, parameters);
SeasonsModule.getActiveEvents();

// Weather system
SeasonsModule.setWeather(weatherType, duration);
SeasonsModule.addWeatherEffect(effectType, intensity);

// Seasonal mechanics
SeasonsModule.getCurrentSeason();
SeasonsModule.getSeasonalModifiers();
SeasonsModule.checkEventConditions(gameState);
```

## Example TODOs and Tasks

### Phase 1: Enhanced Weather System (Week 1-2)
- [ ] **Extended Weather Types**
  - Add thunderstorms with lightning effects and sound
  - Implement drought conditions affecting water levels
  - Create perfect growing weather with bonus effects
  - Add fog and mist for atmospheric variety

- [ ] **Dynamic Weather Transitions**
  - Smooth weather changes instead of instant switches
  - Weather prediction system showing upcoming conditions
  - Seasonal weather probability adjustments

- [ ] **Visual Weather Effects**
  - Particle systems for rain, snow, and storms
  - Dynamic lighting changes during weather events
  - Animated cloud movements and sky color transitions

### Phase 2: Seasonal Events (Week 3-4)
- [ ] **Festival System**
  - Spring Planting Festival with seed bonuses
  - Summer Growth Festival with accelerated crop growth
  - Autumn Harvest Festival with price bonuses
  - Winter Rest Festival with special decorations

- [ ] **Event Calendar**
  - Scheduled events tied to real-world dates
  - In-game calendar showing upcoming events
  - Event countdown timers and notifications

- [ ] **Event Rewards**
  - Special decorative items only available during events
  - Temporary bonuses and buffs for participation
  - Achievement system for event participation

### Phase 3: Random Challenges (Week 5-6)
- [ ] **Pest Invasions**
  - Locust swarms affecting multiple crops
  - Individual plant diseases requiring treatment
  - Beneficial insects boosting crop health

- [ ] **Natural Disasters**
  - Hailstorms damaging crops and equipment
  - Flooding temporarily disabling plots
  - Heat waves requiring extra watering

- [ ] **Market Events**
  - Supply shortages increasing crop prices
  - Bumper harvest years reducing prices
  - Special orders from NPCs for rare items

### Phase 4: Advanced Features (Week 7-8)
- [ ] **Community Events**
  - Global challenges requiring all players to contribute
  - Regional weather patterns affecting multiple farms
  - Collaborative building projects during festivals

- [ ] **Seasonal Progression**
  - Unlockable content tied to seasonal progression
  - Seasonal achievements and milestones
  - Year-over-year progression tracking

- [ ] **Environmental Storytelling**
  - Weather patterns that tell a story
  - Seasonal NPCs with rotating dialog
  - Historical weather events players can reference

## Data Models

### Event Definition
```javascript
{
    eventId: 'spring_growth_festival',
    name: 'Spring Growth Festival',
    description: 'Plants grow 50% faster during this celebration of new life!',
    type: 'festival|weather|challenge|market',
    season: 'spring',
    duration: 86400000, // 24 hours
    triggers: ['season_change', 'date_march_20'],
    effects: {
        cropGrowthRate: 1.5,
        seedDiscount: 0.2,
        specialSeeds: ['rainbow_carrot', 'giant_tomato']
    },
    visualEffects: {
        decorations: ['spring_banners', 'flower_petals'],
        lighting: 'festival',
        particles: 'flower_bloom'
    },
    rewards: {
        participation: { coins: 100, experience: 50 },
        completion: { items: ['spring_crown', 'growth_fertilizer'] }
    }
}
```

### Weather Event
```javascript
{
    weatherId: 'summer_thunderstorm',
    name: 'Thunderstorm',
    icon: '⛈️',
    duration: 1800000, // 30 minutes
    effects: {
        plantGrowth: 0.3,
        waterLevel: 'auto_fill',
        animalMood: 0.8,
        harvestDamage: 0.1
    },
    visualEffects: {
        lightning: { frequency: 5000, intensity: 0.8 },
        rain: { intensity: 0.9, windEffect: true },
        soundEffects: ['thunder', 'heavy_rain']
    },
    probability: { spring: 0.1, summer: 0.15, autumn: 0.12, winter: 0.05 }
}
```

### Seasonal Modifiers
```javascript
{
    season: 'spring',
    plantGrowth: {
        carrot: 1.2,
        tomato: 1.1,
        rare: 1.3
    },
    weatherProbabilities: {
        sunny: 0.4,
        rainy: 0.3,
        cloudy: 0.25,
        stormy: 0.05
    },
    specialEvents: ['spring_festival', 'pest_bloom'],
    decorativeItems: ['spring_flowers', 'green_leaves'],
    ambientEffects: ['bird_sounds', 'wind_rustle']
}
```

## Performance Considerations
- **Particle Systems**: Limit particle count on mobile devices
- **Visual Effects**: Provide quality settings for different device capabilities
- **Event Processing**: Use efficient triggering system to avoid frame drops
- **Memory Management**: Clean up expired events and temporary visual effects

## Testing Requirements
- [ ] Events trigger at correct times and conditions
- [ ] Weather effects apply properly to crops and animals
- [ ] Visual effects perform well on mobile devices
- [ ] Event rewards are distributed correctly
- [ ] Seasonal transitions work smoothly
- [ ] Random events occur at expected frequencies

## Dependencies
- Existing weather system (to be enhanced)
- Existing season system (to be extended)
- Particle system for visual effects
- Audio system for weather sounds
- Save system for event progress tracking

## Configuration
```javascript
// Feature flag in data/features.json
{
    "seasons": {
        "enabled": true,
        "version": "1.0.0",
        "config": {
            "eventFrequency": 0.3,
            "weatherIntensity": 1.0,
            "visualEffects": "medium",
            "seasonLength": 1728000000, // 20 days in ms
            "enableRandomEvents": true
        }
    }
}
```

## Integration with Other Modules
- **Quests Module**: Generate seasonal and event-specific quests
- **Animals Module**: Seasonal animal behavior and breeding patterns
- **Customization Module**: Seasonal decorations and themes
- **Multiplayer Module**: Synchronized events across all players

---

*This module builds upon existing seasonal and weather systems. See [ROADMAP.md](../../ROADMAP.md) for implementation timeline and [design/FEATURE-SPECS.md](../../design/FEATURE-SPECS.md) for detailed technical specifications.*