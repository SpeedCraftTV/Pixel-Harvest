using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class HealthSystemExtendedTests
    {
        [Fact]
        public void IncubationProgression_AllowsNoEffectThenAppliesAfterIncubation()
        {
            // deterministic roll that will trigger disease with a known roll value
            double rollVal = 0.2; // ensures an acute disease per logic (roll < 0.3)
            var health = new HealthSystem(() => rollVal);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.9;
            a.Stats.Health = 0.5;

            // first update should acquire disease but be in incubation
            module.Update(0.5);
            var report1 = health.CheckHealth(a);
            Assert.True(report1.IsDiseased, "L'animal devrait être marqué malade après acquisition");
            var before = report1.Health;

            // short update during incubation (less than incubationSeconds ~ 1.0+)
            module.Update(0.5);
            var report2 = health.CheckHealth(a);
            // compute expected hunger-driven decay for the delta time and assert disease did not additionally reduce health
            double expectedDecay = 0.0;
            if (a.Stats.Hunger > 0.95) expectedDecay = 0.02 * 0.5;
            else if (a.Stats.Hunger > 0.8) expectedDecay = 0.01 * 0.5;
            var expected = Math.Round(before - expectedDecay, 6);
            Assert.Equal(expected, Math.Round(report2.Health, 6));

            // wait beyond incubation and update to apply severity effects
            System.Threading.Thread.Sleep(TimeSpan.FromSeconds(2));
            module.Update(2.0);
            var report3 = health.CheckHealth(a);
            Assert.True(report3.Health < before, "La santé doit diminuer après la période d'incubation");
        }

        [Fact]
        public void TreatDisease_RemovesDisease_WhenSeverityReduced()
        {
            // deterministic roll to create disease
            double rollVal = 0.2;
            var health = new HealthSystem(() => rollVal);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.9;
            a.Stats.Health = 0.4;

            module.Update(1.0);
            var rep = health.CheckHealth(a);
            Assert.True(rep.IsDiseased);

            // apply treatment repeatedly until removed
            health.TreatDisease(a, "antibiotics");
            health.TreatDisease(a, "antibiotics");

            var after = health.CheckHealth(a);
            Assert.False(after.IsDiseased, "La maladie doit être supprimée après traitements successifs");
        }

        [Fact]
        public void ChronicDisease_PersistsAndReducesHealthOverTime()
        {
            // select a roll that produces a chronic disease (roll >= 0.3 yields chronic per code)
            double rollVal = 0.5;
            var health = new HealthSystem(() => rollVal);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var a = module.CreateAnimal("cow_holstein");
            a.Stats.Hunger = 0.9;
            // lower initial health so disease acquisition logic (health < 0.6) can trigger
            a.Stats.Health = 0.5;

            module.Update(1.0);
            var rep1 = health.CheckHealth(a);
            Assert.True(rep1.IsDiseased && rep1.Status?.Type == DiseaseType.Chronic, "La maladie doit être chronique pour ce tirage");

            // multiple updates should reduce health cumulatively
            module.Update(5.0);
            var rep2 = health.CheckHealth(a);
            Assert.True(rep2.Health < rep1.Health, "La santé doit diminuer au fil du temps pour une maladie chronique");
        }
    }
}
