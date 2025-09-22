/**
 * Animals UI Module - Enhanced user interface for animal management
 * Provides detailed animal care, breeding, and health interfaces
 */

class AnimalsUI {
    constructor() {
        this.initialized = false;
        this.selectedAnimal = null;
        this.currentTab = 'overview';
        this.updateInterval = null;
    }

    initialize() {
        if (this.initialized) return;
        
        this.createEnhancedUI();
        this.bindEvents();
        this.startUpdateLoop();
        this.initialized = true;
        console.log('Animals UI initialized');
    }

    createEnhancedUI() {
        // Get the existing animals panel
        const animalsPanel = document.getElementById('animalsPanel');
        if (!animalsPanel) {
            console.error('Animals panel not found');
            return;
        }

        // Create enhanced animals interface
        const enhancedHTML = `
            <!-- Enhanced Animal Management -->
            <div id="enhancedAnimalsInterface" style="display: none;">
                <div id="animalsList" class="animals-list">
                    <h3>🐄 Your Animals</h3>
                    <div id="animalsGrid" class="animals-grid"></div>
                    <button id="addAnimalBtn" class="add-animal-btn">+ Add New Animal</button>
                </div>

                <!-- Animal Details Panel -->
                <div id="animalDetails" class="animal-details" style="display: none;">
                    <div class="animal-header">
                        <h3 id="animalName">Animal Name</h3>
                        <button id="closeDetailsBtn" class="close-btn">×</button>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="tab-navigation">
                        <button class="tab-btn active" data-tab="overview">Overview</button>
                        <button class="tab-btn" data-tab="care">Care</button>
                        <button class="tab-btn" data-tab="breeding">Breeding</button>
                        <button class="tab-btn" data-tab="health">Health</button>
                        <button class="tab-btn" data-tab="production">Production</button>
                    </div>

                    <!-- Tab Contents -->
                    <div id="tabContent" class="tab-content">
                        <!-- Overview Tab -->
                        <div id="overviewTab" class="tab-panel active">
                            <div class="animal-stats">
                                <div class="stat-grid">
                                    <div class="stat-item">
                                        <span class="stat-label">Health</span>
                                        <div class="stat-bar">
                                            <div class="stat-fill health" id="healthBar"></div>
                                        </div>
                                        <span id="healthValue">100%</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Happiness</span>
                                        <div class="stat-bar">
                                            <div class="stat-fill happiness" id="happinessBar"></div>
                                        </div>
                                        <span id="happinessValue">100%</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Hunger</span>
                                        <div class="stat-bar">
                                            <div class="stat-fill hunger" id="hungerBar"></div>
                                        </div>
                                        <span id="hungerValue">0%</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Cleanliness</span>
                                        <div class="stat-bar">
                                            <div class="stat-fill cleanliness" id="cleanlinessBar"></div>
                                        </div>
                                        <span id="cleanlinessValue">100%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="animal-info">
                                <p><strong>Species:</strong> <span id="animalSpecies"></span></p>
                                <p><strong>Gender:</strong> <span id="animalGender"></span></p>
                                <p><strong>Age:</strong> <span id="animalAge"></span></p>
                                <p><strong>Mood:</strong> <span id="animalMood"></span></p>
                                <p><strong>Activity:</strong> <span id="animalActivity"></span></p>
                            </div>
                        </div>

                        <!-- Care Tab -->
                        <div id="careTab" class="tab-panel">
                            <div class="care-actions">
                                <h4>Care Actions</h4>
                                <div class="action-buttons">
                                    <button class="care-btn" data-action="feed">
                                        🌾 Feed (💰1)
                                    </button>
                                    <button class="care-btn" data-action="clean">
                                        🧽 Clean (💰1)
                                    </button>
                                    <button class="care-btn" data-action="pet">
                                        ❤️ Pet (Free)
                                    </button>
                                    <button class="care-btn" data-action="veterinary">
                                        🏥 Vet Visit (💰10)
                                    </button>
                                </div>
                            </div>
                            <div class="feed-options">
                                <h4>Feed Type</h4>
                                <select id="feedTypeSelect">
                                    <option value="basic">Basic Feed (💰1)</option>
                                    <option value="premium_hay">Premium Hay (💰3)</option>
                                    <option value="grain_mix">Grain Mix (💰2)</option>
                                    <option value="organic_feed">Organic Feed (💰5)</option>
                                </select>
                            </div>
                            <div class="care-history">
                                <h4>Care History</h4>
                                <p><strong>Last Fed:</strong> <span id="lastFed"></span></p>
                                <p><strong>Last Cleaned:</strong> <span id="lastCleaned"></span></p>
                                <p><strong>Last Vet Visit:</strong> <span id="lastVetVisit"></span></p>
                            </div>
                        </div>

                        <!-- Breeding Tab -->
                        <div id="breedingTab" class="tab-panel">
                            <div class="breeding-status">
                                <h4>Breeding Status</h4>
                                <div id="breedingInfo"></div>
                            </div>
                            <div class="breeding-actions">
                                <h4>Breeding Options</h4>
                                <select id="breedingPartnerSelect">
                                    <option value="">Select Breeding Partner</option>
                                </select>
                                <button id="breedBtn" class="breed-btn" disabled>Start Breeding</button>
                            </div>
                            <div class="genetics-info">
                                <h4>Genetics</h4>
                                <div id="geneticsDisplay"></div>
                            </div>
                        </div>

                        <!-- Health Tab -->
                        <div id="healthTab" class="tab-panel">
                            <div class="health-status">
                                <h4>Health Report</h4>
                                <div id="healthReport"></div>
                            </div>
                            <div class="disease-status">
                                <h4>Active Conditions</h4>
                                <div id="activeDiseases"></div>
                            </div>
                            <div class="treatment-options">
                                <h4>Available Treatments</h4>
                                <div id="treatmentOptions"></div>
                            </div>
                        </div>

                        <!-- Production Tab -->
                        <div id="productionTab" class="tab-panel">
                            <div class="production-stats">
                                <h4>Production Statistics</h4>
                                <div id="productionInfo"></div>
                            </div>
                            <div class="pending-products">
                                <h4>Products Ready for Collection</h4>
                                <div id="pendingProducts"></div>
                                <button id="collectProductsBtn" class="collect-btn">Collect All Products</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Animal Creation Modal -->
            <div id="animalCreationModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <h3>Add New Animal</h3>
                    <div class="form-group">
                        <label for="newAnimalSpecies">Species:</label>
                        <select id="newAnimalSpecies">
                            <option value="cow_holstein">Holstein Cow (💰100)</option>
                            <option value="chicken_leghorn">Leghorn Chicken (💰30)</option>
                            <option value="pig_yorkshire">Yorkshire Pig (💰150)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="newAnimalName">Name:</label>
                        <input type="text" id="newAnimalName" placeholder="Enter animal name">
                    </div>
                    <div class="modal-buttons">
                        <button id="createAnimalBtn">Create Animal</button>
                        <button id="cancelCreateBtn">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        // Add enhanced interface to animals panel
        animalsPanel.insertAdjacentHTML('beforeend', enhancedHTML);

        // Add CSS styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animals-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px;
                margin: 10px 0;
            }

            .animal-card {
                border: 2px solid #8B4513;
                border-radius: 8px;
                padding: 10px;
                background: linear-gradient(145deg, #F5DEB3, #DEB887);
                cursor: pointer;
                transition: transform 0.2s;
            }

            .animal-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }

            .animal-card.selected {
                border-color: #32CD32;
                background: linear-gradient(145deg, #E6FFE6, #C7FFC7);
            }

            .animal-details {
                background: #F5F5DC;
                border: 2px solid #8B4513;
                border-radius: 8px;
                padding: 15px;
                margin-top: 15px;
                max-width: 600px;
            }

            .animal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #8B4513;
                padding-bottom: 10px;
            }

            .close-btn {
                background: #DC143C;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                font-size: 18px;
            }

            .tab-navigation {
                display: flex;
                margin-bottom: 15px;
                border-bottom: 2px solid #8B4513;
            }

            .tab-btn {
                background: #DEB887;
                border: none;
                padding: 10px 15px;
                cursor: pointer;
                border-radius: 5px 5px 0 0;
                margin-right: 5px;
                transition: background 0.2s;
            }

            .tab-btn.active {
                background: #32CD32;
                color: white;
            }

            .tab-btn:hover {
                background: #CD853F;
            }

            .tab-panel {
                display: none;
                padding: 15px 0;
            }

            .tab-panel.active {
                display: block;
            }

            .stat-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }

            .stat-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .stat-label {
                font-weight: bold;
                font-size: 14px;
            }

            .stat-bar {
                width: 100%;
                height: 20px;
                background: #E0E0E0;
                border-radius: 10px;
                overflow: hidden;
                border: 1px solid #999;
            }

            .stat-fill {
                height: 100%;
                transition: width 0.3s ease;
                border-radius: 10px;
            }

            .stat-fill.health { background: linear-gradient(90deg, #FF4444, #44FF44); }
            .stat-fill.happiness { background: linear-gradient(90deg, #FF4444, #FFD700, #44FF44); }
            .stat-fill.hunger { background: linear-gradient(90deg, #44FF44, #FFD700, #FF4444); }
            .stat-fill.cleanliness { background: linear-gradient(90deg, #8B4513, #DEB887, #F5DEB3); }

            .action-buttons {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin: 10px 0;
            }

            .care-btn, .breed-btn, .collect-btn {
                background: #32CD32;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }

            .care-btn:hover, .breed-btn:hover, .collect-btn:hover {
                background: #228B22;
            }

            .care-btn:disabled, .breed-btn:disabled, .collect-btn:disabled {
                background: #999;
                cursor: not-allowed;
            }

            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-content {
                background: #F5F5DC;
                border: 2px solid #8B4513;
                border-radius: 8px;
                padding: 20px;
                min-width: 300px;
            }

            .form-group {
                margin: 15px 0;
            }

            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }

            .form-group input, .form-group select {
                width: 100%;
                padding: 8px;
                border: 1px solid #8B4513;
                border-radius: 4px;
                font-size: 14px;
            }

            .modal-buttons {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }

            .add-animal-btn {
                background: #FF6347;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px 0;
            }

            .add-animal-btn:hover {
                background: #FF4500;
            }

            .genetics-trait {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
                padding: 5px;
                background: #E6E6FA;
                border-radius: 3px;
            }

            .disease-item {
                background: #FFE4E1;
                border: 1px solid #CD5C5C;
                border-radius: 5px;
                padding: 10px;
                margin: 5px 0;
            }

            .production-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                margin: 5px 0;
                background: #F0FFF0;
                border: 1px solid #90EE90;
                border-radius: 5px;
            }

            @media (max-width: 768px) {
                .animals-grid {
                    grid-template-columns: 1fr;
                }
                
                .stat-grid {
                    grid-template-columns: 1fr;
                }
                
                .action-buttons {
                    grid-template-columns: 1fr;
                }
                
                .animal-details {
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Animal card selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.animal-card')) {
                const animalId = e.target.closest('.animal-card').dataset.animalId;
                this.selectAnimal(animalId);
            }
        });

        // Care actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('care-btn')) {
                const action = e.target.dataset.action;
                this.performCareAction(action);
            }
        });

        // Close details
        document.getElementById('closeDetailsBtn')?.addEventListener('click', () => {
            this.closeAnimalDetails();
        });

        // Add animal
        document.getElementById('addAnimalBtn')?.addEventListener('click', () => {
            this.showAnimalCreationModal();
        });

        // Animal creation modal
        document.getElementById('createAnimalBtn')?.addEventListener('click', () => {
            this.createNewAnimal();
        });

        document.getElementById('cancelCreateBtn')?.addEventListener('click', () => {
            this.hideAnimalCreationModal();
        });

        // Breeding
        document.getElementById('breedBtn')?.addEventListener('click', () => {
            this.startBreeding();
        });

        // Product collection
        document.getElementById('collectProductsBtn')?.addEventListener('click', () => {
            this.collectProducts();
        });

        // Toggle enhanced interface
        document.addEventListener('click', (e) => {
            if (e.target.id === 'mobileAnimalsBtn' || e.target.closest('#mobileAnimalsBtn')) {
                this.toggleEnhancedInterface();
            }
        });
    }

    startUpdateLoop() {
        // Update UI every 5 seconds
        this.updateInterval = setInterval(() => {
            this.updateAnimalsGrid();
            if (this.selectedAnimal) {
                this.updateAnimalDetails();
            }
        }, 5000);
    }

    toggleEnhancedInterface() {
        const enhancedInterface = document.getElementById('enhancedAnimalsInterface');
        if (!enhancedInterface) return;

        if (enhancedInterface.style.display === 'none') {
            enhancedInterface.style.display = 'block';
            this.updateAnimalsGrid();
        } else {
            enhancedInterface.style.display = 'none';
            this.closeAnimalDetails();
        }
    }

    updateAnimalsGrid() {
        const grid = document.getElementById('animalsGrid');
        if (!grid || !window.animalsModule?.initialized) return;

        const animals = window.animalsModule.getAllAnimals();
        
        grid.innerHTML = '';

        for (const animal of animals) {
            const card = this.createAnimalCard(animal);
            grid.appendChild(card);
        }
    }

    createAnimalCard(animal) {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.dataset.animalId = animal.animalId;

        const moodEmoji = this.getMoodEmoji(animal.behavior.mood);
        const healthColor = this.getHealthColor(animal.stats.health);
        const ageInDays = Math.floor(animal.age / 86400000);

        card.innerHTML = `
            <div class="animal-card-content">
                <h4>${animal.name} ${moodEmoji}</h4>
                <p><strong>Species:</strong> ${this.formatSpeciesName(animal.species)}</p>
                <p><strong>Age:</strong> ${ageInDays} days</p>
                <div class="health-indicator" style="background: ${healthColor}; width: ${animal.stats.health * 100}%; height: 4px; border-radius: 2px;"></div>
                <p style="font-size: 12px; color: #666;">Health: ${Math.round(animal.stats.health * 100)}%</p>
            </div>
        `;

        return card;
    }

    getMoodEmoji(mood) {
        const moodEmojis = {
            happy: '😊',
            content: '😌',
            sad: '😢',
            sick: '🤒',
            angry: '😠',
            hungry: '🤤',
            excited: '🤩'
        };
        return moodEmojis[mood] || '🐄';
    }

    getHealthColor(health) {
        if (health > 0.8) return '#44FF44';
        if (health > 0.6) return '#FFD700';
        if (health > 0.4) return '#FF8C00';
        return '#FF4444';
    }

    formatSpeciesName(species) {
        const names = {
            cow_holstein: 'Holstein Cow',
            chicken_leghorn: 'Leghorn Chicken',
            pig_yorkshire: 'Yorkshire Pig',
            sheep_suffolk: 'Suffolk Sheep',
            goat_nubian: 'Nubian Goat',
            duck_pekin: 'Pekin Duck',
            horse_quarter: 'Quarter Horse'
        };
        return names[species] || species.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    selectAnimal(animalId) {
        // Deselect previous animal
        document.querySelectorAll('.animal-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Select new animal
        const selectedCard = document.querySelector(`[data-animal-id="${animalId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        this.selectedAnimal = animalId;
        this.showAnimalDetails();
        this.updateAnimalDetails();
    }

    showAnimalDetails() {
        const detailsPanel = document.getElementById('animalDetails');
        if (detailsPanel) {
            detailsPanel.style.display = 'block';
        }
    }

    closeAnimalDetails() {
        const detailsPanel = document.getElementById('animalDetails');
        if (detailsPanel) {
            detailsPanel.style.display = 'none';
        }
        
        // Deselect animal
        document.querySelectorAll('.animal-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.selectedAnimal = null;
    }

    updateAnimalDetails() {
        if (!this.selectedAnimal || !window.animalsModule?.initialized) return;

        const animal = window.animalsModule.getAnimal(this.selectedAnimal);
        if (!animal) return;

        // Update header
        document.getElementById('animalName').textContent = animal.name;

        // Update based on current tab
        switch (this.currentTab) {
            case 'overview':
                this.updateOverviewTab(animal);
                break;
            case 'care':
                this.updateCareTab(animal);
                break;
            case 'breeding':
                this.updateBreedingTab(animal);
                break;
            case 'health':
                this.updateHealthTab(animal);
                break;
            case 'production':
                this.updateProductionTab(animal);
                break;
        }
    }

    updateOverviewTab(animal) {
        // Update stat bars
        this.updateStatBar('health', animal.stats.health);
        this.updateStatBar('happiness', animal.stats.happiness);
        this.updateStatBar('hunger', animal.stats.hunger);
        this.updateStatBar('cleanliness', animal.stats.cleanliness);

        // Update info
        document.getElementById('animalSpecies').textContent = this.formatSpeciesName(animal.species);
        document.getElementById('animalGender').textContent = animal.gender;
        document.getElementById('animalAge').textContent = `${Math.floor(animal.age / 86400000)} days`;
        document.getElementById('animalMood').textContent = animal.behavior.mood;
        document.getElementById('animalActivity').textContent = animal.behavior.activity;
    }

    updateStatBar(statName, value) {
        const bar = document.getElementById(`${statName}Bar`);
        const valueDisplay = document.getElementById(`${statName}Value`);
        
        if (bar) {
            bar.style.width = `${value * 100}%`;
        }
        
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(value * 100)}%`;
        }
    }

    updateCareTab(animal) {
        // Update care history
        document.getElementById('lastFed').textContent = new Date(animal.care.lastFed).toLocaleString();
        document.getElementById('lastCleaned').textContent = new Date(animal.care.lastCleaned).toLocaleString();
        document.getElementById('lastVetVisit').textContent = animal.care.lastVetVisit 
            ? new Date(animal.care.lastVetVisit).toLocaleString() 
            : 'Never';

        // Update care buttons state
        this.updateCareButtons(animal);
    }

    updateCareButtons(animal) {
        const buttons = document.querySelectorAll('.care-btn');
        buttons.forEach(btn => {
            const action = btn.dataset.action;
            const canPerform = this.canPerformCareAction(animal, action);
            btn.disabled = !canPerform.allowed;
            if (!canPerform.allowed) {
                btn.title = canPerform.reason;
            }
        });
    }

    canPerformCareAction(animal, action) {
        // Check cooldowns and requirements
        if (!window.animalsModule.care) {
            return { allowed: false, reason: 'Care system not available' };
        }

        try {
            const careSystem = window.animalsModule.care;
            const careAction = careSystem.careActions.get(action);
            if (!careAction) {
                return { allowed: false, reason: 'Unknown care action' };
            }

            return careSystem.canPerformCare(animal, careAction);
        } catch (error) {
            return { allowed: false, reason: error.message };
        }
    }

    updateBreedingTab(animal) {
        const breedingInfo = document.getElementById('breedingInfo');
        const partnerSelect = document.getElementById('breedingPartnerSelect');
        const breedBtn = document.getElementById('breedBtn');

        if (!window.animalsModule.breeding) return;

        // Get breeding status
        const breedingStatus = window.animalsModule.breeding.getBreedingStatus(animal.animalId);
        
        // Update breeding info
        let statusHTML = '';
        if (breedingStatus.isPregnant) {
            statusHTML = `
                <p><strong>Status:</strong> Pregnant 🤱</p>
                <p><strong>Due Date:</strong> ${breedingStatus.dueDate.toLocaleDateString()}</p>
                <p><strong>Progress:</strong> ${Math.round(breedingStatus.pregnancyProgress * 100)}%</p>
            `;
        } else if (breedingStatus.cooldownRemaining > 0) {
            const daysRemaining = Math.ceil(breedingStatus.cooldownRemaining / 86400000);
            statusHTML = `
                <p><strong>Status:</strong> On breeding cooldown</p>
                <p><strong>Available:</strong> ${daysRemaining} days</p>
            `;
        } else if (breedingStatus.canBreed) {
            statusHTML = `<p><strong>Status:</strong> Ready to breed ✅</p>`;
        } else {
            statusHTML = `<p><strong>Status:</strong> Not ready for breeding</p>`;
        }
        
        breedingInfo.innerHTML = statusHTML;

        // Update partner selection
        this.updateBreedingPartners(animal, partnerSelect);

        // Update breed button
        breedBtn.disabled = !breedingStatus.canBreed || !partnerSelect.value;

        // Update genetics display
        this.updateGeneticsDisplay(animal);
    }

    updateBreedingPartners(animal, select) {
        const animals = window.animalsModule.getAllAnimals();
        const compatibleAnimals = animals.filter(other => {
            if (other.animalId === animal.animalId) return false;
            if (other.gender === animal.gender) return false;
            
            const compatibility = window.animalsModule.breeding.canBreed(animal.animalId, other.animalId);
            return compatibility.canBreed;
        });

        select.innerHTML = '<option value="">Select Breeding Partner</option>';
        for (const partner of compatibleAnimals) {
            const option = document.createElement('option');
            option.value = partner.animalId;
            option.textContent = `${partner.name} (${this.formatSpeciesName(partner.species)})`;
            select.appendChild(option);
        }
    }

    updateGeneticsDisplay(animal) {
        const geneticsDisplay = document.getElementById('geneticsDisplay');
        const genetics = animal.genetics;

        let html = '<h5>Traits</h5>';
        for (const [trait, value] of Object.entries(genetics.traits)) {
            const percentage = Math.round(value * 100);
            const color = this.getTraitColor(value);
            html += `
                <div class="genetics-trait">
                    <span>${trait.replace('_', ' ')}</span>
                    <span style="color: ${color}; font-weight: bold;">${percentage}%</span>
                </div>
            `;
        }

        geneticsDisplay.innerHTML = html;
    }

    getTraitColor(value) {
        if (value > 0.8) return '#44FF44';
        if (value > 0.6) return '#90EE90';
        if (value > 0.4) return '#FFD700';
        if (value > 0.2) return '#FF8C00';
        return '#FF4444';
    }

    updateHealthTab(animal) {
        if (!window.animalsModule.health) return;

        const healthReport = window.animalsModule.health.checkHealth(animal.animalId);
        
        // Update health report
        const reportDiv = document.getElementById('healthReport');
        let reportHTML = `
            <p><strong>Overall Health:</strong> ${Math.round(healthReport.overallHealth * 100)}%</p>
            <p><strong>Next Vet Visit:</strong> ${healthReport.nextVetVisit.toLocaleDateString()}</p>
        `;

        if (healthReport.recommendations.length > 0) {
            reportHTML += '<h5>Recommendations:</h5><ul>';
            for (const rec of healthReport.recommendations) {
                reportHTML += `<li>${rec}</li>`;
            }
            reportHTML += '</ul>';
        }

        reportDiv.innerHTML = reportHTML;

        // Update active diseases
        const diseasesDiv = document.getElementById('activeDiseases');
        if (healthReport.activeDiseases.length === 0) {
            diseasesDiv.innerHTML = '<p>No active health issues ✅</p>';
        } else {
            let diseasesHTML = '';
            for (const disease of healthReport.activeDiseases) {
                diseasesHTML += `
                    <div class="disease-item">
                        <h5>${disease.name}</h5>
                        <p><strong>Severity:</strong> ${disease.severity}</p>
                        <p><strong>Stage:</strong> ${disease.stage}</p>
                        <p><strong>Symptoms:</strong> ${disease.symptoms.join(', ')}</p>
                    </div>
                `;
            }
            diseasesDiv.innerHTML = diseasesHTML;
        }

        // Update treatment options
        this.updateTreatmentOptions(animal);
    }

    updateTreatmentOptions(animal) {
        const treatmentDiv = document.getElementById('treatmentOptions');
        // This would be expanded to show available treatments
        treatmentDiv.innerHTML = `
            <button class="care-btn" onclick="animalsUI.applyTreatment('${animal.animalId}', 'antibiotics')">
                💊 Antibiotics (💰50)
            </button>
            <button class="care-btn" onclick="animalsUI.applyTreatment('${animal.animalId}', 'vaccination')">
                💉 Vaccination (💰25)
            </button>
        `;
    }

    updateProductionTab(animal) {
        if (!window.animalsModule.production) return;

        const productionStats = window.animalsModule.production.getProductionStats(animal.animalId);
        
        // Update production info
        const productionInfo = document.getElementById('productionInfo');
        productionInfo.innerHTML = `
            <p><strong>Total Lifetime Production:</strong> ${productionStats.totalLifetimeProduction}</p>
            <p><strong>Production Efficiency:</strong> ${Math.round(productionStats.productionEfficiency * 100)}%</p>
            <p><strong>Next Production:</strong> ${productionStats.nextProduction.toLocaleString()}</p>
            <p><strong>Current Quality:</strong> ${this.getQualityTier(productionStats.currentQuality)}</p>
        `;

        // Update pending products
        this.updatePendingProducts(animal);
    }

    updatePendingProducts(animal) {
        const pendingDiv = document.getElementById('pendingProducts');
        const collectBtn = document.getElementById('collectProductsBtn');
        
        const pendingProducts = window.animalsModule.production.pendingProducts.get(animal.animalId) || [];
        
        if (pendingProducts.length === 0) {
            pendingDiv.innerHTML = '<p>No products ready for collection</p>';
            collectBtn.disabled = true;
        } else {
            let html = '';
            for (const product of pendingProducts) {
                html += `
                    <div class="production-item">
                        <span>${product.quantity} ${product.name}</span>
                        <span>${this.getQualityTier(product.quality)} Quality</span>
                        <span>💰${product.actualValue.toFixed(2)}</span>
                    </div>
                `;
            }
            pendingDiv.innerHTML = html;
            collectBtn.disabled = false;
        }
    }

    getQualityTier(quality) {
        if (quality < 0.2) return 'Poor';
        if (quality < 0.4) return 'Below Average';
        if (quality < 0.6) return 'Standard';
        if (quality < 0.8) return 'Good';
        if (quality < 0.9) return 'Premium';
        return 'Exceptional';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');

        this.currentTab = tabName;
        this.updateAnimalDetails(); // Refresh content for new tab
    }

    performCareAction(action) {
        if (!this.selectedAnimal || !window.animalsModule.care) return;

        const feedType = document.getElementById('feedTypeSelect')?.value || 'basic';
        const options = action === 'feed' ? { foodType: feedType } : {};

        try {
            const result = window.animalsModule.care.performCare(this.selectedAnimal, action, options);
            if (result.success) {
                this.showMessage(`Care action successful: ${result.messages[0]}`, 'success');
                this.updateAnimalDetails();
                this.updateAnimalsGrid();
            } else {
                this.showMessage(`Care action failed: ${result.reason}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Error: ${error.message}`, 'error');
        }
    }

    showAnimalCreationModal() {
        document.getElementById('animalCreationModal').style.display = 'flex';
    }

    hideAnimalCreationModal() {
        document.getElementById('animalCreationModal').style.display = 'none';
    }

    createNewAnimal() {
        const species = document.getElementById('newAnimalSpecies').value;
        const name = document.getElementById('newAnimalName').value;

        if (!name.trim()) {
            this.showMessage('Please enter a name for the animal', 'error');
            return;
        }

        // Check costs
        const costs = {
            cow_holstein: 100,
            chicken_leghorn: 30,
            pig_yorkshire: 150
        };

        const cost = costs[species] || 100;
        if (window.coins < cost) {
            this.showMessage(`Not enough coins! Need ${cost} coins.`, 'error');
            return;
        }

        try {
            // Create animal
            const animal = window.animalsModule.createAnimal(species, { name: name.trim() });
            
            // Deduct cost
            window.coins -= cost;
            
            this.hideAnimalCreationModal();
            this.updateAnimalsGrid();
            this.showMessage(`${animal.name} has been added to your farm!`, 'success');
            
            // Update UI
            if (window.updateUI) {
                window.updateUI();
            }
        } catch (error) {
            this.showMessage(`Error creating animal: ${error.message}`, 'error');
        }
    }

    startBreeding() {
        if (!this.selectedAnimal) return;

        const partnerId = document.getElementById('breedingPartnerSelect').value;
        if (!partnerId) {
            this.showMessage('Please select a breeding partner', 'error');
            return;
        }

        try {
            const result = window.animalsModule.breeding.breed(this.selectedAnimal, partnerId);
            if (result.success) {
                this.showMessage(`Breeding successful! ${result.mother} is now pregnant.`, 'success');
                this.updateAnimalDetails();
                this.updateAnimalsGrid();
            } else {
                this.showMessage(`Breeding failed: ${result.reason}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Breeding error: ${error.message}`, 'error');
        }
    }

    collectProducts() {
        if (!this.selectedAnimal) return;

        try {
            const result = window.animalsModule.production.collectProducts(this.selectedAnimal);
            if (result.success) {
                this.showMessage(`Collected ${result.count} products worth 💰${result.totalValue.toFixed(2)}!`, 'success');
                this.updateAnimalDetails();
                this.updateAnimalsGrid();
                
                if (window.updateUI) {
                    window.updateUI();
                }
            } else {
                this.showMessage(`Collection failed: ${result.reason}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Collection error: ${error.message}`, 'error');
        }
    }

    applyTreatment(animalId, treatment) {
        try {
            const result = window.animalsModule.health.treatDisease(animalId, treatment);
            if (result.success) {
                this.showMessage('Treatment applied successfully!', 'success');
                this.updateAnimalDetails();
            } else {
                this.showMessage(`Treatment failed: ${result.reason}`, 'error');
            }
        } catch (error) {
            this.showMessage(`Treatment error: ${error.message}`, 'error');
        }
    }

    showMessage(message, type = 'info') {
        if (window.showInstruction) {
            window.showInstruction(message, 3000);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.initialized = false;
    }
}

// Create global instance
window.animalsUI = new AnimalsUI();

// Export for module use
window.AnimalsUI = AnimalsUI;