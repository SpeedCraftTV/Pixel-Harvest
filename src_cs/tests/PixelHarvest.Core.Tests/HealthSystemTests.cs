using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class HealthSystemTests
    {
        [Fact]
        public void Health_Decays_When_HungerHigh()
        {
            var health = new HealthSystem();
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.95;
            a.Stats.Health = 1.0;

            module.Update(10.0);
            Assert.True(a.Stats.Health < 1.0, "La santé doit diminuer lorsque la faim est élevée après Update");
        }

        [Fact]
        public void TreatDisease_RestoresHealth()
        {
            // fonction de tirage déterministe qui déclenche toujours la maladie lorsque la probabilité > 0
            var health = new HealthSystem(() => 0.0);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.9;
            a.Stats.Health = 0.5;
            a.Genetics = new System.Collections.Generic.Dictionary<string, object>
            {
                ["disease_resistance"] = 0.0
            };

            module.Update(1.0);
            var report = health.CheckHealth(a);
            Assert.True(report.IsDiseased, "L'animal doit devenir malade avec un tirage déterministe");

            health.TreatDisease(a, "antibiotics");
            var after = health.CheckHealth(a);
            Assert.False(after.IsDiseased, "La maladie doit être levée après le traitement");
            Assert.True(after.Health > 0.5, "La santé doit s'améliorer après le traitement");
        }

        [Fact]
        public void DiseaseChance_Reduces_WithGeneticResistance()
        {
            // tirage déterministe où 0.4 est utilisé pour comparer à la probabilité
            var health = new HealthSystem(() => 0.4);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.9;
            a.Stats.Health = 0.5;
            a.Genetics = new System.Collections.Generic.Dictionary<string, object>
            {
                ["disease_resistance"] = 0.9 // high resistance should drop probability near zero
            };

            module.Update(1.0);
            var report = health.CheckHealth(a);
            Assert.False(report.IsDiseased, "Une forte résistance génétique doit prévenir la maladie sur le même tirage");
        }
    }
}
