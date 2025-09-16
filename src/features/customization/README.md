# Customization Module

## Overview
This module implements comprehensive character and farm customization features for Pixel-Harvest, allowing players to personalize their gaming experience. Related to [Issue #26](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/26).

## Module Responsibilities
- **Character Appearance**: Skin tones, hair styles, clothing, accessories
- **Farm Decorations**: Buildings, paths, decorative items, themes
- **Unlock System**: Progression-based customization rewards
- **Asset Management**: Loading and caching of customization assets
- **Persistence**: Saving and loading player customizations
- **Multiplayer Sync**: Sharing customizations with other players

## Integration Points

### Main Game Loop Integration
```javascript
// In main game update loop
if (CustomizationModule.isEnabled()) {
    CustomizationModule.updateDecorations(deltaTime);
    CustomizationModule.processUnlocks(gameState);
}
```

### Character Rendering Hooks
```javascript
// In drawCharacter() function
function drawCharacter() {
    const appearance = CustomizationModule.getCharacterAppearance();
    drawCustomCharacter(character, appearance);
}
```

### Index.html Integration
```html
<!-- Add customization panels -->
<div id="customizationPanel" style="display: none;">
    <div id="characterCustomization">
        <div id="appearanceEditor"></div>
        <div id="clothingSelector"></div>
    </div>
    <div id="farmCustomization">
        <div id="decorationBrowser"></div>
        <div id="farmLayoutEditor"></div>
    </div>
</div>

<!-- Add customization button to main UI -->
<button id="customizationButton">🎨 Customize</button>
```

## API Interface

### Core Functions
```javascript
// Character customization
CustomizationModule.setCharacterAppearance(appearanceData);
CustomizationModule.getCharacterAppearance();
CustomizationModule.unlockClothing(itemId);

// Farm customization
CustomizationModule.placeDecoration(decorationId, position);
CustomizationModule.removeDecoration(decorationId);
CustomizationModule.setFarmTheme(themeId);

// Asset management
CustomizationModule.loadAssets(assetList);
CustomizationModule.previewItem(itemId, targetType);
```

## Example TODOs and Tasks

### Phase 1: Character Customization (Week 1-2)
- [ ] **Appearance System**
  - Create character appearance data structure
  - Implement skin tone selection with color picker
  - Add hair style options (short, long, curly, bald)
  - Enable hair color customization with preset and custom colors

- [ ] **Clothing System**
  - Design modular clothing system (tops, bottoms, shoes, accessories)
  - Create basic clothing options (shirts, overalls, boots, hats)
  - Implement clothing color variants and patterns
  - Add special clothing items (work gear, formal wear, seasonal outfits)

- [ ] **Accessory System**
  - Add hat and headwear options (straw hat, cap, bandana)
  - Implement tool accessories (custom watering cans, hoes)
  - Create jewelry and decorative accessories
  - Add seasonal and event-specific accessories

### Phase 2: Farm Decoration (Week 3-4)
- [ ] **Building Decorations**
  - Add decorative buildings (barns, sheds, windmills)
  - Implement functional decorations (advanced sprinklers, silos)
  - Create themed building sets (rustic, modern, fantasy)
  - Add size variants and color options for buildings

- [ ] **Landscape Decorations**
  - Place decorative plants and flowers
  - Add pathway systems with different materials
  - Implement fencing and boundary decorations
  - Create water features (ponds, fountains, wells)

- [ ] **Placement System**
  - Develop grid-based placement system
  - Add rotation and scaling for decorations
  - Implement collision detection and snap-to-grid
  - Create copy/paste functionality for decoration layouts

### Phase 3: Themes and Unlocks (Week 5-6)
- [ ] **Theme System**
  - Create predefined farm themes (Rustic, Modern, Fantasy, Tropical)
  - Implement theme switching with preview
  - Add seasonal theme variants
  - Allow custom theme creation and saving

- [ ] **Unlock Progression**
  - Tie customizations to player level and achievements
  - Create coin-based unlock system for premium items
  - Add quest rewards for exclusive customizations
  - Implement seasonal unlock events

- [ ] **Collection Management**
  - Build customization inventory system
  - Add favorites and recently used sections
  - Implement search and filtering for large collections
  - Create customization presets and outfits

### Phase 4: Advanced Features (Week 7-8)
- [ ] **Social Features**
  - Enable sharing of farm designs with other players
  - Add rating system for community-created themes
  - Implement customization showcases and contests
  - Create customization gift system for friends

- [ ] **Advanced Editing**
  - Add fine-tuned positioning for decorations
  - Implement layering system for complex designs
  - Create blueprint system for reusable layouts
  - Add undo/redo functionality for decoration changes

- [ ] **Performance Optimization**
  - Implement level-of-detail system for decorations
  - Add culling for off-screen decorations
  - Optimize asset loading and memory usage
  - Create quality settings for different device types

## Data Models

### Character Appearance
```javascript
{
    playerId: 'uuid',
    appearance: {
        skin: {
            tone: 'light|medium|dark|custom',
            color: '#RGB'
        },
        hair: {
            style: 'short_brown|long_blonde|curly_black|bald',
            color: '#RGB'
        },
        clothing: {
            top: 'shirt_red|overalls_blue|dress_green',
            bottom: 'pants_brown|skirt_purple',
            shoes: 'boots_brown|sneakers_white',
            accessories: ['straw_hat', 'work_gloves']
        }
    },
    unlockedItems: [
        'shirt_red', 'overalls_blue', 'straw_hat'
    ],
    favoriteOutfits: [
        {
            name: 'Work Outfit',
            items: ['overalls_blue', 'boots_brown', 'straw_hat']
        }
    ]
}
```

### Farm Decoration
```javascript
{
    farmId: 'uuid',
    layout: {
        theme: 'rustic',
        backgroundColor: '#87CEEB',
        decorations: [
            {
                id: 'decoration_001',
                assetId: 'red_barn',
                position: { x: 10, y: 0, z: 5 },
                rotation: 90,
                scale: 1.0,
                layer: 1
            }
        ],
        paths: [
            {
                points: [{ x: 0, z: 0 }, { x: 5, z: 5 }],
                material: 'stone_path',
                width: 1.0
            }
        ],
        boundaries: [
            {
                type: 'fence',
                material: 'wood_fence',
                points: [{ x: -15, z: -15 }, { x: 15, z: 15 }]
            }
        ]
    }
}
```

### Customization Asset
```javascript
{
    assetId: 'red_barn',
    name: 'Red Barn',
    category: 'building',
    subcategory: 'storage',
    rarity: 'common',
    unlockRequirements: {
        level: 10,
        coins: 1000,
        achievements: ['first_harvest'],
        seasonalEvent: null
    },
    properties: {
        functional: false,
        size: { width: 4, height: 3, depth: 3 },
        collisionBox: { width: 4, depth: 3 },
        snapToGrid: true,
        allowRotation: true,
        allowScaling: false
    },
    rendering: {
        modelPath: 'assets/models/red_barn.obj',
        texturePath: 'assets/textures/red_barn.png',
        normalMapPath: 'assets/textures/red_barn_normal.png',
        lodLevels: [
            { distance: 20, model: 'red_barn_high.obj' },
            { distance: 50, model: 'red_barn_medium.obj' },
            { distance: 100, model: 'red_barn_low.obj' }
        ]
    },
    tags: ['rustic', 'storage', 'large', 'seasonal_autumn']
}
```

## Performance Considerations
- **Asset Loading**: Lazy load customization assets, use texture atlases
- **LOD System**: Multiple detail levels for decorations based on distance
- **Culling**: Hide decorations outside camera view
- **Memory Management**: Unload unused assets, pool decoration objects
- **Mobile Optimization**: Reduced detail modes for mobile devices

## Testing Requirements
- [ ] Character customizations save and load correctly
- [ ] Farm decorations render properly in 3D space
- [ ] Placement system works accurately with collision detection
- [ ] Unlock system integrates with progression properly
- [ ] Performance remains stable with many decorations
- [ ] Mobile interface is touch-friendly and responsive

## Dependencies
- 3D rendering system for decoration display
- Save/load system for persistence
- Asset loading system for customization content
- UI framework for customization interface
- Achievement system for unlock conditions

## Configuration
```javascript
// Feature flag in data/features.json
{
    "customization": {
        "enabled": true,
        "version": "0.8.0",
        "config": {
            "maxDecorations": 100,
            "assetQuality": "medium",
            "enableAdvancedEditing": true,
            "allowCustomColors": true,
            "socialFeatures": false
        }
    }
}
```

## Integration with Other Modules
- **Multiplayer Module**: Sync customizations across players
- **Seasons Module**: Seasonal decorations and themes
- **Quests Module**: Customization rewards from quest completion
- **Animals Module**: Animal-themed decorations and accessories

## Accessibility Considerations
- **Color Blind Support**: Alternative indicators beyond color
- **Motor Impairment**: Keyboard navigation for all customization features
- **Screen Readers**: Proper ARIA labels for customization options
- **Touch Accessibility**: Large touch targets, gesture alternatives

---

*This module focuses on creative expression and player personalization. See [ROADMAP.md](../../ROADMAP.md) for implementation timeline and [design/FEATURE-SPECS.md](../../design/FEATURE-SPECS.md) for detailed technical specifications.*