# Tutorial System Documentation

## Overview

The Pixel-Harvest tutorial system provides an interactive, step-by-step guide for new players to learn the game mechanics. The system is designed to be engaging, informative, and accessible across both desktop and mobile devices.

## Features

### 🎯 Core Features
- **24 comprehensive tutorial steps** covering all game mechanics
- **Interactive UI highlighting** with visual pointers and tooltips
- **Progress tracking** with automatic advancement based on player actions
- **Multi-language support** (English, French, Spanish)
- **Mobile-responsive design** with touch-friendly controls
- **Customizable settings** for user preferences
- **Tutorial rewards** including coins, seeds, and experience points

### 🛠️ Technical Features
- **Modular architecture** with separate components for management, UI, steps, and localization
- **Game integration** with existing systems and progress tracking
- **Event-driven interactions** for responsive tutorial advancement
- **Local storage persistence** for settings and progress
- **Accessibility support** with keyboard navigation and screen reader compatibility

## Architecture

### Component Structure

```
src/tutorial/
├── tutorial-manager.js      # Main tutorial controller
├── tutorial-ui.js          # UI components and styling
├── tutorial-steps.js       # Step definitions and content
├── tutorial-localization.js # Multi-language support
└── README.md               # This documentation
```

### Key Classes

#### TutorialManager
- **Purpose**: Main controller for tutorial flow and state management
- **Responsibilities**:
  - Initializing tutorial system
  - Managing step progression
  - Handling user interactions
  - Saving/loading progress
  - Coordinating with game systems

#### TutorialUI
- **Purpose**: Handles all visual aspects of the tutorial
- **Responsibilities**:
  - Rendering tutorial interface
  - Managing animations and transitions
  - Creating modal dialogs
  - Highlighting UI elements
  - Mobile responsiveness

#### TutorialSteps
- **Purpose**: Defines tutorial content and progression logic
- **Contains**:
  - Step definitions with content, interactions, and conditions
  - Tutorial metadata and configuration
  - Step-specific game actions and hints

#### TutorialLocalization
- **Purpose**: Provides multi-language support
- **Features**:
  - Dynamic language switching
  - Fallback to English if translation missing
  - Browser language detection
  - Localized step content

## Tutorial Steps

The tutorial consists of 24 carefully designed steps:

### Basic Mechanics (Steps 1-8)
1. **Welcome** - Introduction to the game
2. **Character Movement** - WASD/arrow key controls
3. **Camera Controls** - Rotation and zoom
4. **Farm Plots** - Understanding the farming grid
5. **Planting Seeds** - How to plant crops
6. **Plant Growth** - Growth stages and timing
7. **Watering Plants** - Accelerating growth
8. **Harvesting** - Collecting mature crops

### Game Systems (Steps 9-16)
9. **Inventory Management** - Tracking items
10. **Marketplace** - Economic system overview
11. **Selling Crops** - Converting crops to coins
12. **Buying Seeds** - Purchasing new varieties
13. **Plant Selection** - Choosing what to grow
14. **Unlocking Plots** - Expanding the farm
15. **Objectives** - Goal-oriented gameplay
16. **Day/Night Cycle** - Time-based mechanics

### Advanced Features (Steps 17-24)
17. **Weather System** - Environmental effects
18. **Seasons** - Long-term cycles
19. **Farm Animals** - Livestock management
20. **Daily Quests** - Ongoing challenges
21. **Equipment** - Farm upgrades
22. **Game Menu** - Settings and options
23. **Mobile Controls** - Touch interface
24. **Completion** - Rewards and conclusion

## Usage

### Starting the Tutorial

The tutorial automatically starts for new players:

```javascript
// Automatic detection for new players
const hasPlayedBefore = localStorage.getItem('pixelHarvestHasPlayed');
if (!hasPlayedBefore) {
    // Show welcome screen
    tutorialManager.showWelcomeScreen();
}
```

### Manual Tutorial Access

Players can access the tutorial through the game menu:

```javascript
// In the game menu
function showTutorialMenu() {
    if (tutorialManager && tutorialManager.isAvailable()) {
        tutorialManager.showWelcomeScreen();
    }
}
```

### Integration with Game Systems

The tutorial integrates seamlessly with existing game mechanics:

```javascript
// Track player actions for tutorial progression
function trackTutorialProgress(action, value = true) {
    if (!tutorialManager || !tutorialManager.isActive) return;
    
    tutorialProgress[action] = value;
    
    // Trigger advancement events
    if (action === 'nearPlot' && value) {
        document.dispatchEvent(new CustomEvent('tutorialNearPlot'));
    }
}
```

## Customization

### Tutorial Settings

Players can customize their tutorial experience:

- **Auto-advance**: Automatically proceed to next step when possible
- **Show hints**: Display helpful tips for each step
- **Highlight elements**: Visual highlighting of interactive elements
- **Pause game**: Pause gameplay during tutorial

### Adding New Steps

To add new tutorial steps:

1. **Define the step** in `tutorial-steps.js`:
```javascript
{
    id: 'new_feature',
    title: 'New Feature Tutorial',
    icon: '🆕',
    description: 'Learn about this amazing new feature!',
    hints: ['Helpful tip 1', 'Helpful tip 2'],
    gameActions: [
        {
            type: 'highlight_ui',
            selector: '#newFeatureButton',
            options: { showPointer: true }
        }
    ],
    interactions: [
        {
            selector: '#newFeatureButton',
            event: 'click',
            advanceOnComplete: true
        }
    ]
}
```

2. **Add translations** in `tutorial-localization.js`:
```javascript
en: {
    steps: {
        new_feature: {
            title: 'New Feature Tutorial',
            description: 'Learn about this amazing new feature!'
        }
    }
}
```

3. **Integrate with game** by adding progress tracking:
```javascript
// In the relevant game function
function useNewFeature() {
    // ... feature logic ...
    trackTutorialProgress('usedNewFeature', true);
}
```

## Localization

### Supported Languages

- **English (en)** - Default language
- **French (fr)** - Français
- **Spanish (es)** - Español

### Adding New Languages

1. **Add language definition**:
```javascript
languages: {
    de: {
        name: 'Deutsch',
        flag: '🇩🇪',
        code: 'de'
    }
}
```

2. **Add translations**:
```javascript
translations: {
    de: {
        ui: {
            welcome: 'Willkommen',
            next: 'Weiter →',
            // ... other translations
        }
    }
}
```

3. **Update language selector** in the game menu HTML.

## Mobile Support

The tutorial system is fully responsive and touch-friendly:

### Mobile-Specific Features
- **Touch navigation** - Tap-friendly buttons and interactions
- **Responsive layout** - Adapts to different screen sizes
- **Virtual joystick integration** - Works with mobile controls
- **Gesture support** - Pinch-to-zoom and drag camera controls
- **Haptic feedback** - Vibration on supported devices

### Mobile Tutorial Adaptations
- Simplified instructions for touch controls
- Visual joystick and button highlighting
- Larger touch targets for easier interaction
- Condensed UI to fit smaller screens

## Screenshots

The tutorial system has been tested and verified to work correctly:

1. **Welcome Screen**: Automatically appears for new players with options to start tutorial, view settings, or skip
2. **Step Navigation**: Clean, modern interface with progress indicators and navigation controls
3. **Interactive Highlighting**: UI elements are highlighted with visual pointers and tooltips
4. **Mobile Responsive**: Adapts seamlessly to different screen sizes and touch controls

## Integration

The tutorial system integrates with all major game systems:

- **Character Movement**: Tracks when player moves character
- **Camera Controls**: Detects camera mode toggles
- **Farming Actions**: Monitors planting, watering, and harvesting
- **Plot Management**: Tracks plot unlocking and interactions
- **Inventory System**: Integrates with item collection and management
- **Marketplace**: Guides through buying and selling processes
- **Game Menu**: Accessible through main menu system

## Technical Implementation

### Files Added
- `src/tutorial/tutorial-manager.js` - Main tutorial controller (445 lines)
- `src/tutorial/tutorial-ui.js` - UI components and styling (1,077 lines)  
- `src/tutorial/tutorial-steps.js` - 24 tutorial steps definition (820 lines)
- `src/tutorial/tutorial-localization.js` - Multi-language support (549 lines)
- `src/tutorial/README.md` - Component documentation
- `docs/TUTORIAL.md` - Complete system documentation

### Integration Points
- Modified `index.html` to include tutorial scripts and menu integration
- Added tutorial progress tracking to existing game functions
- Integrated with existing language system and game menu
- Added tutorial button to main game menu

The tutorial system is now fully functional and ready for use!