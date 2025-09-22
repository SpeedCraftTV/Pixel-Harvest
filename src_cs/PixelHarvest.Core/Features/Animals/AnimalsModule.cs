using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace PixelHarvest.Core.Features.Animals
{
    public class AnimalsModule
    {
        private readonly Dictionary<string, Animal> _animals = new();
        private readonly Dictionary<string, SpeciesConfig> _species = new();
        public bool Enabled { get; private set; } = false;

    private readonly IGeneticsSystem _genetics;
    private readonly IBreedingSystem _breeding;
    private readonly IHealthSystem _health;
    private readonly IProductionSystem _production;

    public AnimalsModule(
        IGeneticsSystem? genetics = null,
        IBreedingSystem? breeding = null,
        IHealthSystem? health = null,
        IProductionSystem? production = null)
    {
    _genetics = genetics ?? new GeneticsSystem();
    _breeding = breeding ?? new BreedingSystem(_genetics);
        _health = health ?? new HealthSystem();
        _production = production ?? new ProductionSystem();
    }

        public void Initialize()
        {
            if (Enabled) return;
            LoadSpeciesConfigurations();
            // Provide species resolver to health system if supported
            if (_health is HealthSystem hs)
            {
                hs.SetSpeciesResolver(k => _species.TryGetValue(k, out var c) ? c : null);
            }
            // Initialize subsystems
            _genetics.Initialize();
            _health.Initialize();
            _production.Initialize();

            Enabled = true;
        }

        public Animal CreateAnimal(string speciesKey, AnimalTraits? traits = null)
        {
            traits ??= new AnimalTraits();
            if (!_species.TryGetValue(speciesKey, out var speciesConfig))
                throw new ArgumentException($"Unknown species: {speciesKey}");

            var id = GenerateAnimalId();
            var animal = new Animal
            {
                AnimalId = id,
                Species = speciesKey,
                Name = traits.Name ?? GenerateAnimalName(speciesKey),
                Gender = traits.Gender ?? GenerateGender(speciesConfig),
                Age = traits.Age ?? 0,
                Position = traits.Position ?? new Position(0,0,0),
                CreatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow,
                Stats = InitializeStats(speciesConfig),
                Care = InitializeCare(),
                Production = InitializeProduction(speciesConfig),
                Breeding = InitializeBreeding(speciesConfig),
                Behavior = InitializeBehavior(speciesConfig)
            };

            _animals[id] = animal;
            return animal;
        }

        public void Update(double deltaTime)
        {
            if (!Enabled) return;
            foreach (var animal in _animals.Values)
            {
                _health.UpdateHealth(animal, deltaTime);
                _production.UpdateProduction(animal, deltaTime);
            }

            // allow health system to propagate diseases between nearby animals
            _health.Propagate(_animals.Values);
            // update breeding state per animal (iterate over a snapshot to allow adding new animals during birth)
            foreach (var animal in _animals.Values.ToList())
            {
                var birth = _breeding.Update(animal, deltaTime);
                if (birth != null)
                {
                    // persist new child
                    var child = birth.Child;
                    _animals[child.AnimalId] = child;

                    // replace pending placeholders in parents
                    if (!string.IsNullOrEmpty(birth.Pregnancy.ParentAId) && _animals.TryGetValue(birth.Pregnancy.ParentAId, out var pa))
                    {
                        if (pa.Breeding?.Offspring != null)
                        {
                            for (int i = 0; i < pa.Breeding.Offspring.Count; i++)
                            {
                                if (pa.Breeding.Offspring[i].StartsWith("pending_")) pa.Breeding.Offspring[i] = child.AnimalId;
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(birth.Pregnancy.ParentBId) && _animals.TryGetValue(birth.Pregnancy.ParentBId, out var pb))
                    {
                        if (pb.Breeding?.Offspring != null)
                        {
                            for (int i = 0; i < pb.Breeding.Offspring.Count; i++)
                            {
                                if (pb.Breeding.Offspring[i].StartsWith("pending_")) pb.Breeding.Offspring[i] = child.AnimalId;
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Attempts to breed two animals by id. If successful persists the offspring and returns it, otherwise null.
        /// </summary>
        public Animal? TryBreed(string parentAId, string parentBId)
        {
            var a = GetAnimal(parentAId);
            var b = GetAnimal(parentBId);
            if (a == null || b == null) return null;

            var result = _breeding.Breed(a, b);
            if (result == null) return null;

            // Persist child
            var child = result.Child;
            _animals[child.AnimalId] = child;
            return child;
        }

        public Animal? GetAnimal(string id) => _animals.TryGetValue(id, out var a) ? a : null;

        public IEnumerable<Animal> GetAllAnimals() => _animals.Values.ToList();

        // Simple JSON export of all animals for persistence/import into another environment.
        public string ExportAllAnimalsToJson()
        {
            var list = GetAllAnimals();
            return JsonConvert.SerializeObject(list, Formatting.Indented);
        }

        public void ImportAnimalsFromJson(string json)
        {
            var list = JsonConvert.DeserializeObject<List<Animal>>(json);
            if (list == null) return;
            foreach (var a in list)
            {
                if (string.IsNullOrEmpty(a.AnimalId)) a.AnimalId = GenerateAnimalId();
                _animals[a.AnimalId] = a;
            }
        }

        // Helper used by tests to clear all animals from the module
        public void ClearAllAnimals()
        {
            _animals.Clear();
        }

        // --- Helpers ---
        private string GenerateAnimalId() => "animal_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + "_" + Guid.NewGuid().ToString("N").Substring(0, 8);

        private string GenerateAnimalName(string species)
        {
            var names = new Dictionary<string, string[]>
            {
                { "cow", new[] { "Bessie", "Moobert", "Daisy" } },
                { "chicken", new[] { "Henrietta", "Clucky" } }
            };
            if (!names.TryGetValue(species, out var arr)) arr = new[] { "Friend" };
            var idx = new Random().Next(arr.Length);
            return arr[idx];
        }

        private string GenerateGender(SpeciesConfig cfg)
        {
            var ratio = cfg.PhysicalTraits.GenderRatio;
            var rnd = new Random().NextDouble();
            return rnd < ratio.Female ? "female" : "male";
        }

        private AnimalStats InitializeStats(SpeciesConfig cfg) => new AnimalStats
        {
            Health = 1.0,
            Happiness = 0.8,
            Hunger = 0.5,
            Cleanliness = 0.8,
            Energy = 0.9,
            Social = 0.6
        };

        private CareState InitializeCare() => new CareState
        {
            LastFed = DateTime.UtcNow,
            FoodType = "basic",
            LastCleaned = DateTime.UtcNow,
            LastVetVisit = null
        };

        private ProductionState InitializeProduction(SpeciesConfig cfg) => new ProductionState
        {
            Type = cfg.Production.Primary.Type,
            Quality = "standard",
            Rate = cfg.Production.Primary.BaseRate,
            LastProduced = DateTime.UtcNow,
            TotalLifetimeProduction = 0
        };

        private BreedingState InitializeBreeding(SpeciesConfig cfg) => new BreedingState
        {
            MaturityAge = cfg.PhysicalTraits.MaturityAge,
            LastBred = null,
            PregnancyStatus = null,
            BreedingValue = 0.5,
            // apply species-configured default cooldown
            CooldownSeconds = cfg.DefaultBreedingCooldownSeconds
        };

        private BehaviorState InitializeBehavior(SpeciesConfig cfg) => new BehaviorState
        {
            Personality = "friendly",
            Mood = "content",
            Activity = "idle",
            SocialBonds = new List<string>()
        };

        private void LoadSpeciesConfigurations()
        {
            // Minimal built-in species to avoid external IO for now
            var cow = new SpeciesConfig
            {
                Species = "cow_holstein",
                DisplayName = "Holstein Cow",
                BaseSpecies = "cow",
                Icon = "🐄",
                Rarity = "common",
                PhysicalTraits = new PhysicalTraits
                {
                    Size = "large",
                    Lifespan = 2555,
                    MaturityAge = 365,
                    GenderRatio = new GenderRatio { Male = 0.1, Female = 0.9 }
                },
                // species default cooldown (seconds) applied to new animals
                DefaultBreedingCooldownSeconds = 5.0,
                Production = new ProductionConfig
                {
                    Primary = new ProductionPrimary { Type = "milk", BaseRate = 2.0 }
                }
            };
            
            var sheep = new SpeciesConfig
            {
                Species = "sheep_merino",
                DisplayName = "Merino Sheep",
                BaseSpecies = "sheep",
                Icon = "🐑",
                Rarity = "common",
                PhysicalTraits = new PhysicalTraits
                {
                    Size = "medium",
                    Lifespan = 2000,
                    MaturityAge = 180,
                    GenderRatio = new GenderRatio { Male = 0.5, Female = 0.5 }
                },
                // longer cooldown for sheep in this sample
                DefaultBreedingCooldownSeconds = 10.0,
                Production = new ProductionConfig
                {
                    Primary = new ProductionPrimary { Type = "wool", BaseRate = 1.0 }
                }
            };
            _species[cow.Species] = cow;
            _species[sheep.Species] = sheep;
        }

        // Public API to allow updating or adding species configurations at runtime (useful for tests)
        public void UpdateSpeciesConfig(SpeciesConfig config)
        {
            if (config == null) throw new ArgumentNullException(nameof(config));
            _species[config.Species] = config;
            // if health system supports resolver, refresh it to ensure new config is visible
            if (_health is HealthSystem hs)
            {
                hs.SetSpeciesResolver(k => _species.TryGetValue(k, out var c) ? c : null);
            }
        }

        public SpeciesConfig? GetSpeciesConfig(string speciesKey)
        {
            if (!_species.TryGetValue(speciesKey, out var cfg)) return null;
            return CloneSpeciesConfig(cfg);
        }

        // produce a deep copy of species config to avoid accidental external mutation
        private SpeciesConfig CloneSpeciesConfig(SpeciesConfig src)
        {
            if (src == null) throw new ArgumentNullException(nameof(src));
            return new SpeciesConfig
            {
                Species = src.Species,
                DisplayName = src.DisplayName,
                BaseSpecies = src.BaseSpecies,
                Icon = src.Icon,
                Rarity = src.Rarity,
                DefaultBreedingCooldownSeconds = src.DefaultBreedingCooldownSeconds,
                ContagionRangeUnitsSquared = src.ContagionRangeUnitsSquared,
                ContagionBaseTransmissibility = src.ContagionBaseTransmissibility,
                PhysicalTraits = new PhysicalTraits
                {
                    Size = src.PhysicalTraits?.Size ?? string.Empty,
                    Lifespan = src.PhysicalTraits?.Lifespan ?? 0,
                    MaturityAge = src.PhysicalTraits?.MaturityAge ?? 0,
                    GenderRatio = new GenderRatio
                    {
                        Male = src.PhysicalTraits?.GenderRatio?.Male ?? 0.0,
                        Female = src.PhysicalTraits?.GenderRatio?.Female ?? 0.0
                    }
                },
                Production = new ProductionConfig
                {
                    Primary = new ProductionPrimary
                    {
                        Type = src.Production?.Primary?.Type ?? string.Empty,
                        BaseRate = src.Production?.Primary?.BaseRate ?? 0.0
                    }
                }
            };
        }
    }
}
