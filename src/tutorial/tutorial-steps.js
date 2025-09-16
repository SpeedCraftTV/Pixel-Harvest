/**
 * Tutorial Steps Definition
 * Defines all tutorial steps and their content for Pixel-Harvest
 */

const TutorialSteps = {
    steps: [
        {
            id: 'welcome',
            title: 'Welcome to Pixel-Harvest!',
            icon: '🌱',
            description: `
                <p>Welcome to your new farm! You're about to learn how to grow crops, manage animals, and build a thriving agricultural business.</p>
                <p>This tutorial will guide you through all the essential game mechanics step by step.</p>
            `,
            hints: [
                'You can skip any step by clicking "Skip Step"',
                'Use keyboard arrows to navigate between steps',
                'Press ESC to exit the tutorial at any time'
            ],
            gameActions: [
                {
                    type: 'focus_character',
                    options: { smooth: true }
                }
            ],
            autoAdvance: false,
            duration: null
        },
        {
            id: 'character_movement',
            title: 'Moving Your Character',
            icon: '🚶‍♂️',
            description: `
                <p>Let's start by learning how to move around your farm!</p>
                <p><strong>Desktop:</strong> Use ZQSD keys or arrow keys to move</p>
                <p><strong>Mobile:</strong> Use the virtual joystick in the bottom-left corner</p>
                <p>Try moving your character around now. Notice how the camera follows you!</p>
            `,
            hints: [
                'The character position is shown in the top-right corner',
                'You can drag the mouse to rotate the camera view',
                'Scroll wheel zooms in and out'
            ],
            highlight: ['#dayNightIndicator'],
            interactions: [
                {
                    selector: 'body',
                    event: 'keydown',
                    conditions: {
                        gameState: { characterMoved: true }
                    },
                    callback: () => console.log('Character moved!'),
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'show_tooltip',
                    content: 'Use ZQSD or arrow keys to move around!',
                    position: { target: '#dayNightIndicator' },
                    options: { duration: 3000 }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'camera_controls',
            title: 'Camera Controls',
            icon: '📹',
            description: `
                <p>You can control the camera to get the best view of your farm.</p>
                <p><strong>Desktop:</strong> Press C to toggle camera mode, drag mouse to rotate, scroll to zoom</p>
                <p><strong>Mobile:</strong> Use the camera button, drag to rotate, pinch to zoom</p>
                <p>Try toggling the camera mode now!</p>
            `,
            hints: [
                'Character Follow mode keeps the camera centered on your character',
                'Free Camera mode lets you look around independently',
                'You can zoom in to see details or zoom out for a wider view'
            ],
            highlight: ['#cameraMode'],
            interactions: [
                {
                    selector: 'body',
                    event: 'keydown',
                    conditions: {
                        gameState: { cameraToggled: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#cameraMode',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'farm_plots',
            title: 'Understanding Farm Plots',
            icon: '🌾',
            description: `
                <p>Your farm is divided into plots where you can grow crops. Some plots are already unlocked, while others need to be purchased.</p>
                <p>Move close to a plot to see if you can interact with it. Unlocked plots have a brown soil color.</p>
                <p>Get close to an empty plot to continue!</p>
            `,
            hints: [
                'Brown plots are ready for planting',
                'Gray plots need to be unlocked with coins',
                'A green circle appears around your character when you can interact'
            ],
            highlight: [],
            interactions: [
                {
                    selector: 'body',
                    event: 'custom',
                    conditions: {
                        gameState: { nearPlot: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'show_tooltip',
                    content: 'Move close to a brown farm plot!',
                    position: { x: 400, y: 300 },
                    options: { duration: 5000 }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'planting_seeds',
            title: 'Planting Your First Seeds',
            icon: '🌱',
            description: `
                <p>Great! Now you're close to a farm plot. Let's plant your first seeds!</p>
                <p>You start with some carrot seeds. Make sure carrots are selected in the plant selector, then press SPACE to plant.</p>
                <p>Plant a carrot seed now!</p>
            `,
            hints: [
                'Check the Plant Types panel to see your available seeds',
                'Selected plant type is highlighted in blue',
                'You need to be close to an empty plot to plant'
            ],
            highlight: ['#plantSelector', '.plant-btn.selected'],
            interactions: [
                {
                    selector: 'body',
                    event: 'keydown',
                    conditions: {
                        gameState: { plantedSeed: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#plantSelector',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'plant_growth',
            title: 'Watching Plants Grow',
            icon: '🌿',
            description: `
                <p>Excellent! You've planted your first seed. Plants in Pixel-Harvest grow automatically over time through 3 stages:</p>
                <p>🌱 <strong>Seedling</strong> → 🌿 <strong>Growing</strong> → 🥕 <strong>Mature</strong></p>
                <p>Weather and seasons affect growth speed. You can also water plants to help them grow faster!</p>
            `,
            hints: [
                'Plants grow faster in good weather',
                'Watering plants speeds up growth',
                'Different plants take different amounts of time to grow'
            ],
            highlight: ['#weatherPanel'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#weatherPanel',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'watering_plants',
            title: 'Watering Your Plants',
            icon: '💧',
            description: `
                <p>You can water your plants to help them grow faster!</p>
                <p>Get close to the plant you just planted and press E to water it.</p>
                <p>Watch for the watering animation and growth boost!</p>
            `,
            hints: [
                'Watered plants have a blue sparkle effect',
                'Each watering session provides a growth boost',
                'You can water plants at any growth stage'
            ],
            highlight: [],
            interactions: [
                {
                    selector: 'body',
                    event: 'keydown',
                    conditions: {
                        gameState: { wateredPlant: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'show_tooltip',
                    content: 'Press E to water the plant!',
                    position: { x: 400, y: 300 },
                    options: { duration: 5000 }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'harvesting',
            title: 'Harvesting Crops',
            icon: '🥕',
            description: `
                <p>When plants reach full maturity, they'll show their crop icon (like 🥕 for carrots).</p>
                <p>Get close to a mature plant and press SPACE to harvest it and add it to your inventory.</p>
                <p>For this tutorial, we'll simulate a mature plant. Try harvesting now!</p>
            `,
            hints: [
                'Mature plants show the final crop icon',
                'Harvesting adds items to your inventory',
                'You earn points and coins from harvesting'
            ],
            highlight: ['#inventory'],
            gameActions: [
                {
                    type: 'simulate_mature_plant'
                },
                {
                    type: 'highlight_ui',
                    selector: '#inventory',
                    options: { showPointer: true }
                }
            ],
            interactions: [
                {
                    selector: 'body',
                    event: 'keydown',
                    conditions: {
                        gameState: { harvestedPlant: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            autoAdvance: false
        },
        {
            id: 'inventory_management',
            title: 'Managing Your Inventory',
            icon: '📦',
            description: `
                <p>Great! You've harvested your first crop. Check your inventory to see what you've collected.</p>
                <p>The inventory shows all your crops, equipment, and animal products.</p>
                <p>You can sell items in the marketplace to earn coins!</p>
            `,
            hints: [
                'Inventory is divided into categories: crops, equipment, and animal products',
                'Numbers show how many of each item you have',
                'Items are automatically sorted by type'
            ],
            highlight: ['#inventory'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#inventory',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'marketplace_intro',
            title: 'The Marketplace',
            icon: '🏪',
            description: `
                <p>The marketplace is where you buy seeds and equipment, and sell your crops for coins.</p>
                <p>Prices change dynamically based on supply and demand!</p>
                <p>Let's sell your harvested crop for some coins.</p>
            `,
            hints: [
                'Prices fluctuate based on market conditions',
                'Selling crops is the main way to earn coins',
                'Use coins to buy seeds, equipment, and unlock plots'
            ],
            highlight: ['#marketplace'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#marketplace',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 3000
        },
        {
            id: 'selling_crops',
            title: 'Selling Your Crops',
            icon: '💰',
            description: `
                <p>In the marketplace's "Sell Produce" section, click on "Sell Carrots" to sell your harvested crop.</p>
                <p>Watch your coin count increase when you make the sale!</p>
                <p>Try selling your carrot now.</p>
            `,
            hints: [
                'You can only sell items you actually have',
                'Disabled buttons mean you have none of that item',
                'Each sale gives you coins and experience'
            ],
            highlight: ['#marketplace .market-category:first-child'],
            interactions: [
                {
                    selector: '#sellCarrotBtn',
                    event: 'click',
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#sellCarrotBtn',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'buying_seeds',
            title: 'Buying More Seeds',
            icon: '🌱',
            description: `
                <p>Now that you have coins, you can buy more seeds to expand your farming operation!</p>
                <p>In the "Seeds" section of the marketplace, try buying some tomato seeds.</p>
                <p>Click "Buy Tomato Seeds" to purchase them.</p>
            `,
            hints: [
                'Different seeds have different costs and growth times',
                'Some seeds are only available in certain seasons',
                'Start with cheaper seeds and work your way up'
            ],
            highlight: ['#marketplace .market-category:nth-child(3)'],
            interactions: [
                {
                    selector: '#buyTomatoSeedsBtn',
                    event: 'click',
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#buyTomatoSeedsBtn',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'changing_plant_types',
            title: 'Selecting Plant Types',
            icon: '🍅',
            description: `
                <p>Great! You now have tomato seeds. To plant them, you need to select tomatoes in the Plant Types panel.</p>
                <p>Click on the tomato button in the Plant Types panel to select it.</p>
                <p>Notice how the selected plant is highlighted in blue.</p>
            `,
            hints: [
                'Only the selected plant type will be planted',
                'You can see how many seeds you have of each type',
                'Some plants require specific seasons to grow'
            ],
            highlight: ['#plantSelector'],
            interactions: [
                {
                    selector: '[data-plant="tomato"]',
                    event: 'click',
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '[data-plant="tomato"]',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'unlocking_plots',
            title: 'Unlocking New Plots',
            icon: '🔓',
            description: `
                <p>To expand your farm, you need to unlock new plots using coins.</p>
                <p>Move close to a gray (locked) plot and press SPACE to unlock it.</p>
                <p>Each plot costs coins to unlock, but gives you more space to grow crops!</p>
            `,
            hints: [
                'Locked plots appear gray and show an unlock cost',
                'Unlocking plots permanently expands your farm',
                'Start with plots close to your existing ones'
            ],
            highlight: [],
            interactions: [
                {
                    selector: 'body',
                    event: 'custom',
                    conditions: {
                        gameState: { unlockedPlot: true }
                    },
                    advanceOnComplete: true,
                    once: true
                }
            ],
            gameActions: [
                {
                    type: 'show_tooltip',
                    content: 'Find a gray plot and get close to unlock it!',
                    position: { x: 400, y: 250 },
                    options: { duration: 5000 }
                }
            ],
            autoAdvance: false
        },
        {
            id: 'objectives_system',
            title: 'Objectives and Goals',
            icon: '🎯',
            description: `
                <p>Check out the Objectives panel to see your current goals!</p>
                <p>Completing objectives gives you direction and rewards.</p>
                <p>Try to complete the visible objectives by playing the game naturally.</p>
            `,
            hints: [
                'Objectives provide guidance on what to do next',
                'Completed objectives give rewards and unlock new ones',
                'Focus on easier objectives first'
            ],
            highlight: ['#objectives'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#objectives',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'day_night_cycle',
            title: 'Day and Night Cycle',
            icon: '🌅',
            description: `
                <p>Pixel-Harvest features a dynamic day/night cycle that affects gameplay!</p>
                <p>Different things happen during day and night - plants grow differently, and the atmosphere changes.</p>
                <p>Watch the time indicator to track the current time of day.</p>
            `,
            hints: [
                'The day/night cycle affects plant growth rates',
                'Some animals are more active at certain times',
                'The lighting and ambiance change with the time'
            ],
            highlight: ['#dayNightIndicator'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#dayNightIndicator',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 3000
        },
        {
            id: 'weather_system',
            title: 'Weather Effects',
            icon: '🌤️',
            description: `
                <p>Weather affects how fast your plants grow and your overall farming efficiency.</p>
                <p>☀️ Sunny weather makes plants grow faster</p>
                <p>🌧️ Rainy weather provides natural watering</p>
                <p>❄️ Cold weather slows growth but some plants thrive</p>
            `,
            hints: [
                'Check the weather panel to plan your farming',
                'Some plants prefer certain weather conditions',
                'Weather changes randomly throughout the game'
            ],
            highlight: ['#weatherPanel'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#weatherPanel',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'seasons_system',
            title: 'Seasonal Changes',
            icon: '🍂',
            description: `
                <p>The game features four seasons, each lasting 20 in-game days:</p>
                <p>🌸 Spring: Best for most crops</p>
                <p>☀️ Summer: Hot weather, great for heat-loving plants</p>
                <p>🍂 Autumn: Harvest season with unique crops</p>
                <p>❄️ Winter: Limited growing, but some special plants thrive</p>
            `,
            hints: [
                'Some plants can only be grown in specific seasons',
                'Seasonal events and festivals occur regularly',
                'Plan your crops around the seasonal calendar'
            ],
            highlight: ['#seasonPanel'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#seasonPanel',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'animals_intro',
            title: 'Farm Animals',
            icon: '🐄',
            description: `
                <p>You can buy and raise animals on your farm! Animals produce valuable resources:</p>
                <p>🐔 Chickens produce eggs</p>
                <p>🐄 Cows produce milk</p>
                <p>🐷 Pigs find truffles</p>
                <p>Take care of your animals and collect their products regularly!</p>
            `,
            hints: [
                'Animals need regular care and feeding',
                'Collect products daily for maximum profit',
                'Animal products sell for good prices'
            ],
            highlight: ['#animalsPanel'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#animalsPanel',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'daily_quests',
            title: 'Daily Quests',
            icon: '📋',
            description: `
                <p>Complete daily quests to earn extra rewards and experience!</p>
                <p>Quests reset daily and provide specific goals to work towards.</p>
                <p>Check the Daily Quests panel to see what challenges await you.</p>
            `,
            hints: [
                'Quests provide bonus coins and experience',
                'New quests appear daily',
                'Focus on quests that match your current activities'
            ],
            highlight: ['#questsPanel'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#questsPanel',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'equipment_intro',
            title: 'Farm Equipment',
            icon: '🔧',
            description: `
                <p>As you progress, you can buy equipment to automate and improve your farm:</p>
                <p>💧 Auto Sprinklers: Automatically water nearby plants</p>
                <p>🌿 Fertilizer: Boosts plant growth speed</p>
                <p>🏠 Greenhouses: Protect plants from weather</p>
            `,
            hints: [
                'Equipment is expensive but saves time in the long run',
                'Some equipment works automatically',
                'Upgrade your farm gradually as you earn more coins'
            ],
            highlight: ['#marketplace .market-category:last-child'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#marketplace .market-category:last-child',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'game_menu',
            title: 'Game Menu and Settings',
            icon: '⚙️',
            description: `
                <p>Access the game menu in the top-right corner for various options:</p>
                <p>⚙️ Controls: Customize your keyboard controls</p>
                <p>🔧 UI Mode: Rearrange interface panels</p>
                <p>🆕 New Game: Start fresh anytime</p>
                <p>🌍 Language: Change the game language</p>
            `,
            hints: [
                'Customize controls to your preference',
                'Save your game progress automatically',
                'UI Mode lets you drag panels around'
            ],
            highlight: ['#unifiedMenu'],
            gameActions: [
                {
                    type: 'highlight_ui',
                    selector: '#unifiedMenu',
                    options: { showPointer: true }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'mobile_controls',
            title: 'Mobile Controls',
            icon: '📱',
            description: `
                <p>On mobile devices, use these touch controls:</p>
                <p>🕹️ Virtual joystick for movement</p>
                <p>🌱 Green button to plant/harvest</p>
                <p>💧 Blue button to water plants</p>
                <p>📋 Bottom menu for panels</p>
                <p>Touch and drag to rotate camera, pinch to zoom</p>
            `,
            hints: [
                'Mobile interface adapts automatically',
                'Use the navigation menu at the bottom',
                'Panels open as full-screen overlays on mobile'
            ],
            highlight: [],
            gameActions: [
                {
                    type: 'show_overlay',
                    content: 'Mobile controls are automatically enabled on touch devices!',
                    options: { duration: 3000 }
                }
            ],
            autoAdvance: true,
            autoAdvanceDelay: 4000
        },
        {
            id: 'tutorial_complete',
            title: 'Tutorial Complete!',
            icon: '🎉',
            description: `
                <p>Congratulations! You've learned all the basics of Pixel-Harvest!</p>
                <p>Here's what you've mastered:</p>
                <ul style="text-align: left; margin: 15px 0;">
                    <li>🚶‍♂️ Character movement and camera controls</li>
                    <li>🌱 Planting, watering, and harvesting crops</li>
                    <li>💰 Buying and selling in the marketplace</li>
                    <li>🔓 Unlocking new farm plots</li>
                    <li>🎯 Understanding objectives and quests</li>
                    <li>🐄 Farm animals and their products</li>
                    <li>🌤️ Weather and seasonal systems</li>
                </ul>
                <p>Now go build your farming empire!</p>
            `,
            hints: [
                'Remember: you can restart this tutorial anytime from the game menu',
                'Experiment with different crops and strategies',
                'Have fun and enjoy your farming adventure!'
            ],
            gameActions: [],
            autoAdvance: false
        }
    ],

    // Tutorial metadata
    metadata: {
        version: '1.0.0',
        totalSteps: 24,
        estimatedDuration: '10-15 minutes',
        difficulty: 'beginner',
        prerequisites: [],
        tags: ['farming', 'basic', 'essential'],
        lastUpdated: '2024-12-19'
    },

    // Tutorial configuration
    config: {
        defaultSettings: {
            autoAdvance: false,
            showHints: true,
            highlightElements: true,
            pauseGameOnTutorial: false
        },
        analytics: {
            trackStepCompletion: true,
            trackTimeSpent: true,
            trackSkippedSteps: true
        },
        accessibility: {
            highContrast: false,
            reducedMotion: false,
            keyboardNavigation: true,
            screenReaderSupport: true
        }
    }
};

// Export for use in tutorial manager
if (typeof window !== 'undefined') {
    window.TutorialSteps = TutorialSteps;
}