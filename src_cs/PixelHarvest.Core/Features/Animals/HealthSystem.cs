using System;
using System.Collections.Generic;

namespace PixelHarvest.Core.Features.Animals
{
    public enum DiseaseType { Acute, Chronic }

    public class DiseaseStatus
    {
        public string Name { get; set; } = string.Empty;
        public DiseaseType Type { get; set; }
        public double Severity { get; set; }
        public double IncubationSeconds { get; set; }
        public DateTime Start { get; set; }
    }

    public record HealthReport(double Health, bool IsDiseased, DiseaseStatus? Status);

    public interface IHealthSystem
    {
        void Initialize();
        void UpdateHealth(Animal animal, double deltaTime);
        HealthReport CheckHealth(Animal animal);
        void TreatDisease(Animal animal, string treatment);
        // propagate diseases from sources to nearby targets (module can pass candidate animals)
        void Propagate(IEnumerable<Animal> candidates);
        // force infection for testing/debugging
        void ForceInfect(Animal animal, DiseaseStatus status);
        void ApplyPreventiveCare(Animal animal);
    }

    public class HealthSystem : IHealthSystem
    {
        private readonly Func<double> _roll;
    // optional resolver to get species config by key
    private Func<string, SpeciesConfig?>? _speciesResolver;
        // track per-animal disease status
        private readonly Dictionary<string, DiseaseStatus> _diseased = new();

        // default constructor uses System.Random
        public HealthSystem() : this(new Random()) { }

        public HealthSystem(Random rng) : this(() => rng.NextDouble()) { }

        // allow injecting a deterministic roll function for tests
        public HealthSystem(Func<double> roll) : this(roll, null) { }

        // allow injecting a species resolver to fetch per-species contagion parameters
        public HealthSystem(Func<double> roll, Func<string, SpeciesConfig?>? speciesResolver)
        {
            _roll = roll ?? throw new ArgumentNullException(nameof(roll));
            _speciesResolver = speciesResolver;
        }

        public void Initialize() { }

        // allow external modules to provide a resolver for species config lookup
        public void SetSpeciesResolver(Func<string, SpeciesConfig?>? resolver)
        {
            _speciesResolver = resolver;
        }

        public void UpdateHealth(Animal animal, double deltaTime)
        {
            if (animal == null) return;

            // health decay driven by hunger
            if (animal.Stats.Hunger > 0.95)
            {
                // rapid decay when extremely hungry
                animal.Stats.Health -= 0.02 * deltaTime;
            }
            else if (animal.Stats.Hunger > 0.8)
            {
                animal.Stats.Health -= 0.01 * deltaTime;
            }

            // Apply disease effects if present
            if (_diseased.TryGetValue(animal.AnimalId, out var status))
            {
                var elapsed = (DateTime.UtcNow - status.Start).TotalSeconds;
                // if still in incubation, severity doesn't apply yet
                if (elapsed >= status.IncubationSeconds)
                {
                    // severity reduces health over time
                    animal.Stats.Health -= 0.01 * status.Severity * deltaTime;
                    // Chronic diseases have persistent small impact
                    if (status.Type == DiseaseType.Chronic)
                    {
                        animal.Stats.Health -= 0.002 * deltaTime;
                    }
                }
            }

            // clamp health to [0,1]
            animal.Stats.Health = Math.Clamp(animal.Stats.Health, 0.0, 1.0);

            // disease acquisition logic: prone animals (low health, high hunger)
            if (!_diseased.ContainsKey(animal.AnimalId) && animal.Stats.Health < 0.6 && animal.Stats.Hunger > 0.7)
            {
                // base probability reduced by genetic resistance
                var resistance = 0.0;
                if (animal.Genetics != null && animal.Genetics.TryGetValue("disease_resistance", out var r) && r is double rd)
                {
                    resistance = rd; // expected in [0,1]
                }

                const double baseProbability = 0.5;
                var prob = baseProbability * (1.0 - Math.Clamp(resistance, 0.0, 1.0));
                var roll = _roll();
                if (roll <= prob)
                {
                    // create a disease status with small incubation and varying severity
                    var ds = new DiseaseStatus
                    {
                        Name = "generic_infection",
                        Type = roll < 0.3 ? DiseaseType.Acute : DiseaseType.Chronic,
                        Severity = Math.Clamp(roll, 0.1, 1.0),
                        IncubationSeconds = 1.0 + roll * 4.0,
                        Start = DateTime.UtcNow
                    };
                    _diseased[animal.AnimalId] = ds;
                }
            }
        }

        // Propagate disease from infected animals to others based on simple proximity and transmissibility
        public void Propagate(IEnumerable<Animal> candidates)
        {
            if (candidates == null) return;
            // collect infected animals
            var infected = new List<(Animal, DiseaseStatus)>();
            foreach (var a in candidates)
            {
                if (_diseased.TryGetValue(a.AnimalId, out var s)) infected.Add((a, s));
            }

            // naive O(n^2) propagation for now: for each infected -> attempt to infect others
            foreach (var (src, status) in infected)
            {
                foreach (var tgt in candidates)
                {
                    if (tgt.AnimalId == src.AnimalId) continue;
                    // basic distance check if positions are present
                    var dx = src.Position.X - tgt.Position.X;
                    var dy = src.Position.Y - tgt.Position.Y;
                    var dz = src.Position.Z - tgt.Position.Z;
                    var dist2 = dx * dx + dy * dy + dz * dz;
                    // determine per-species range (use source species if available, fallback to default 25)
                    var range = 25.0;
                    if (_speciesResolver != null)
                    {
                        var cfg = _speciesResolver(src.Species);
                        if (cfg != null) range = cfg.ContagionRangeUnitsSquared;
                    }
                    if (dist2 > range) continue;

                    // transmissibility: base from species (if available) plus scaling with severity
                    var baseTrans = 0.2;
                    if (_speciesResolver != null)
                    {
                        var cfg = _speciesResolver(src.Species);
                        if (cfg != null) baseTrans = Math.Clamp(cfg.ContagionBaseTransmissibility, 0.0, 1.0);
                    }
                    var transmissibility = baseTrans + 0.6 * status.Severity; // additive scaling with severity
                    // reduced by target resistance
                    var resistance = 0.0;
                    if (tgt.Genetics != null && tgt.Genetics.TryGetValue("disease_resistance", out var r) && r is double rd) resistance = rd;
                    var prob = transmissibility * (1.0 - Math.Clamp(resistance, 0.0, 1.0));
                    if (_roll() <= prob)
                    {
                        // infect target with a scaled disease status
                        var ds = new DiseaseStatus
                        {
                            Name = status.Name + "_x",
                            Type = status.Type,
                            Severity = Math.Clamp(status.Severity * 0.8, 0.05, 1.0),
                            IncubationSeconds = Math.Max(0.5, status.IncubationSeconds * 0.5),
                            Start = DateTime.UtcNow
                        };
                        _diseased[tgt.AnimalId] = ds;
                    }
                }
            }
        }

        public void ForceInfect(Animal animal, DiseaseStatus status)
        {
            if (animal == null || status == null) return;
            _diseased[animal.AnimalId] = status;
        }

        public HealthReport CheckHealth(Animal animal)
        {
            if (animal == null) return new HealthReport(0.0, false, null);
            return new HealthReport(animal.Stats.Health, _diseased.ContainsKey(animal.AnimalId), _diseased.TryGetValue(animal.AnimalId, out var s) ? s : null);
        }

        public void TreatDisease(Animal animal, string treatment)
        {
            if (animal == null) return;
            if (_diseased.TryGetValue(animal.AnimalId, out var status))
            {
                // treatment reduces severity; if severity drops below threshold, remove disease
                status.Severity -= 0.5; // coarse effect of treatment
                animal.Stats.Health = Math.Clamp(animal.Stats.Health + 0.25, 0.0, 1.0);
                animal.Care.LastVetVisit = DateTime.UtcNow;
                if (status.Severity <= 0.1)
                {
                    _diseased.Remove(animal.AnimalId);
                }
                else
                {
                    // update start to now to restart incubation-like timers for residual effects
                    status.Start = DateTime.UtcNow;
                }
            }
        }

        public void ApplyPreventiveCare(Animal animal)
        {
            if (animal == null) return;
            animal.Care.Vaccinations ??= new List<string>();
            animal.Care.Vaccinations.Add("standard_vaccine");
            animal.Stats.Health = Math.Clamp(animal.Stats.Health + 0.05, 0.0, 1.0);
        }
    }
}
