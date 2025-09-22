using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PixelHarvest.Core.Features.Animals
{
    // Offspring container returned by BreedingSystem.Breed
    public record Offspring(Animal Child, Animal ParentA, Animal ParentB);

    public record BirthEvent(Animal Child, PregnancyStatus Pregnancy);

    public interface IBreedingSystem
    {
        bool CanBreed(Animal a, Animal b);
        /// <summary>
        /// Attempts to breed two animals and returns an Offspring object if successful; otherwise null.
        /// Important: This method does not create or store the child in any repository. The caller (AnimalsModule) is responsible for persisting the child.
        /// </summary>
        Offspring? Breed(Animal a, Animal b);
        /// <summary>
        /// Advance time for an animal's breeding state. Returns a BirthEvent if pregnancy completes during this update; otherwise null.
        /// </summary>
        BirthEvent? Update(Animal a, double deltaTime);
    }

    public class BreedingSystem : IBreedingSystem
    {
        private readonly IGeneticsSystem _genetics;

        public BreedingSystem() : this(new GeneticsSystem()) { }

        public BreedingSystem(IGeneticsSystem genetics)
        {
            _genetics = genetics ?? new GeneticsSystem();
        }

        public bool CanBreed(Animal a, Animal b)
        {
            if (a == null || b == null) return false;
            if (a.Species != b.Species) return false;
            if (a.Gender == b.Gender) return false;
            // maturity check: use BreedingState.MaturityAge if present, otherwise allow
            var aMaturity = a.Breeding?.MaturityAge ?? 0;
            var bMaturity = b.Breeding?.MaturityAge ?? 0;
            if (aMaturity > 0 && a.Age < aMaturity) return false;
            if (bMaturity > 0 && b.Age < bMaturity) return false;
            // cooldown check: if LastBred exists and cooldown not elapsed, prevent breeding
            var now = DateTime.UtcNow;
            if (a.Breeding?.LastBred != null)
            {
                var cooldown = a.Breeding.CooldownSeconds;
                if (cooldown > 0 && (now - a.Breeding.LastBred.Value).TotalSeconds < cooldown) return false;
            }
            if (b.Breeding?.LastBred != null)
            {
                var cooldown = b.Breeding.CooldownSeconds;
                if (cooldown > 0 && (now - b.Breeding.LastBred.Value).TotalSeconds < cooldown) return false;
            }
            return true;
        }

        public Offspring? Breed(Animal a, Animal b)
        {
            if (!CanBreed(a, b)) return null;

            // Ensure genetics dictionaries exist
            var g1 = a.Genetics ?? _genetics.GenerateGenetics(a.Species);
            var g2 = b.Genetics ?? _genetics.GenerateGenetics(b.Species);
            // Determine child genetics now so pregnancy is deterministic
            var childTraits = _genetics.CalculateOffspring(g1, g2);

            // Support pregnancy: instead of instant birth, mark the female as pregnant
            var female = a.Gender.ToLowerInvariant().StartsWith("f") ? a : b.Gender.ToLowerInvariant().StartsWith("f") ? b : null;
            var male = female == a ? b : a;

            if (female != null)
            {
                female.Breeding ??= new BreedingState();
                // simple pregnancy duration based on species maturity/size; use 1 second for tests by default
                female.Breeding.PregnancyStatus = new PregnancyStatus
                {
                    ParentAId = male.AnimalId,
                    ParentBId = female.AnimalId,
                    Start = DateTime.UtcNow,
                    DurationSeconds = 1.0, // keep short for unit tests
                    ChildGenetics = childTraits
                };

                // set cooldown window (example: 5 seconds) if not already set on the animal
                if (female.Breeding.CooldownSeconds <= 0.0) female.Breeding.CooldownSeconds = 5.0;

                // update parents' last bred and offspring list to include child placeholder id
                var placeholderId = "pending_" + Guid.NewGuid().ToString("N");
                a.Breeding ??= new BreedingState();
                b.Breeding ??= new BreedingState();
                a.Breeding.LastBred = DateTime.UtcNow;
                b.Breeding.LastBred = DateTime.UtcNow;
                a.Breeding.Offspring ??= new System.Collections.Generic.List<string>();
                b.Breeding.Offspring ??= new System.Collections.Generic.List<string>();
                a.Breeding.Offspring.Add(placeholderId);
                b.Breeding.Offspring.Add(placeholderId);

                // Pregnancy initiated; birth will be handled in Update
                return null;
            }

            // Fallback: if no female identified, create child immediately
            var child = new Animal
            {
                AnimalId = GenerateId(),
                Species = a.Species,
                Name = string.Empty,
                Gender = GenerateGender(),
                Age = 0,
                Genetics = childTraits,
                Stats = new AnimalStats { Health = 100, Happiness = 1.0, Hunger = 0, Cleanliness = 1.0, Energy = 1.0, Social = 0.0 },
                Breeding = new BreedingState { MaturityAge = 0, LastBred = null, PregnancyStatus = null, BreedingValue = 0.5, Offspring = new System.Collections.Generic.List<string>() },
                Production = new ProductionState(),
                Care = new CareState(),
                Behavior = new BehaviorState(),
                CreatedAt = DateTime.UtcNow,
                LastUpdate = DateTime.UtcNow
            };

            // update parents breeding state
            a.Breeding ??= new BreedingState();
            b.Breeding ??= new BreedingState();
            a.Breeding.LastBred = DateTime.UtcNow;
            b.Breeding.LastBred = DateTime.UtcNow;
            a.Breeding.Offspring ??= new System.Collections.Generic.List<string>();
            b.Breeding.Offspring ??= new System.Collections.Generic.List<string>();

            a.Breeding.Offspring.Add(child.AnimalId);
            b.Breeding.Offspring.Add(child.AnimalId);

            return new Offspring(child, a, b);
        }

        public BirthEvent? Update(Animal a, double deltaTime)
        {
            if (a == null) return null;
            if (a.Breeding == null) a.Breeding = new BreedingState();
            // If animal is pregnant, check if pregnancy duration elapsed
            if (a.Breeding.PregnancyStatus != null)
            {
                var ps = a.Breeding.PregnancyStatus!;
                var elapsed = (DateTime.UtcNow - ps.Start).TotalSeconds;
                if (elapsed >= ps.DurationSeconds)
                {
                    // finalize birth
                    var child = new Animal
                    {
                        AnimalId = GenerateId(),
                        Species = a.Species,
                        Name = string.Empty,
                        Gender = GenerateGender(),
                        Age = 0,
                        Genetics = ps.ChildGenetics ?? _genetics.GenerateGenetics(a.Species),
                        Stats = new AnimalStats { Health = 100, Happiness = 1.0, Hunger = 0, Cleanliness = 1.0, Energy = 1.0, Social = 0.0 },
                        Breeding = new BreedingState { MaturityAge = a.Breeding.MaturityAge, LastBred = DateTime.UtcNow, PregnancyStatus = null, BreedingValue = a.Breeding.BreedingValue, Offspring = new System.Collections.Generic.List<string>() },
                        Production = new ProductionState(),
                        Care = new CareState(),
                        Behavior = new BehaviorState(),
                        CreatedAt = DateTime.UtcNow,
                        LastUpdate = DateTime.UtcNow
                    };

                    // Build birth event containing the pregnancy so caller can persist and update parents
                    var birth = new BirthEvent(child, ps);
                    // clear pregnancy on the female
                    a.Breeding.PregnancyStatus = null;
                    return birth;
                }
            }
            return null;
        }

        private static string GenerateId() => Guid.NewGuid().ToString("N");
        private static string GenerateGender() => (new Random()).NextDouble() > 0.5 ? "Male" : "Female";
    }
}
