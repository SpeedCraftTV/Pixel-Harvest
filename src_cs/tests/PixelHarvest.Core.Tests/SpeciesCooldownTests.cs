using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class SpeciesCooldownTests
    {
        [Fact]
        public void NewAnimal_InheritsSpeciesDefaultCooldown()
        {
            var module = new AnimalsModule();
            module.Initialize();

            var cow = module.CreateAnimal("cow_holstein");
            var sheep = module.CreateAnimal("sheep_merino");

            Assert.Equal(5.0, cow.Breeding.CooldownSeconds);
            Assert.Equal(10.0, sheep.Breeding.CooldownSeconds);
        }

        [Fact]
        public void CanBreed_RespectsSpeciesCooldown()
        {
            var genetics = new GeneticsSystem();
            var breeding = new BreedingSystem(genetics);
            var module = new AnimalsModule(genetics, breeding);
            module.Initialize();

            var male = module.CreateAnimal("cow_holstein", new AnimalTraits { Gender = "male", Age = 1000 });
            var female = module.CreateAnimal("cow_holstein", new AnimalTraits { Gender = "female", Age = 1000 });

            // initiate breeding (will set LastBred)
            var res = module.TryBreed(male.AnimalId, female.AnimalId);
            // TryBreed may return null since pregnancy is deferred; ensure LastBred is present
            Assert.True(male.Breeding.LastBred != null || (male.Breeding.Offspring != null && male.Breeding.Offspring.Count > 0));

            // Immediately, CanBreed should be false due to cooldown
            Assert.False(breeding.CanBreed(male, female));

            // Simulate cooldown elapsed by moving LastBred back in time beyond cooldown
            var past = DateTime.UtcNow.AddSeconds(-(male.Breeding.CooldownSeconds + 1.0));
            male.Breeding.LastBred = past;
            female.Breeding.LastBred = past;

            Assert.True(breeding.CanBreed(male, female));
        }
    }
}
