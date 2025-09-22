using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class ContagionRangeTests
    {
        [Fact]
        public void SpeciesContagionRange_Affects_Whether_Target_Is_Infected()
        {
            var health = new HealthSystem(() => 0.01);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var src = module.CreateAnimal("cow_holstein");
            var tgt = module.CreateAnimal("cow_holstein");

            // place animals at distance ~6 (dist2 = 36)
            src.Position = new Position(0, 0, 0);
            tgt.Position = new Position(6, 0, 0);

            var ds = new DiseaseStatus { Name = "r", Type = DiseaseType.Acute, Severity = 0.9, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);

            // default should NOT infect
            module.Update(0.1);
            Assert.False(health.CheckHealth(tgt).IsDiseased);

            // now increase species range via public API
            var cfg = module.GetSpeciesConfig("cow_holstein");
            Assert.NotNull(cfg);
            cfg.ContagionRangeUnitsSquared = 50.0; // slightly above 36
            module.UpdateSpeciesConfig(cfg);

            // run update again -> should infect
            module.Update(0.1);
            Assert.True(health.CheckHealth(tgt).IsDiseased);
        }
    }
}
