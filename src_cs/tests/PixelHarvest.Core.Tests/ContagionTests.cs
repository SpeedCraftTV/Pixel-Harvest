using System;
using System.Linq;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class ContagionTests
    {
        [Fact]
        public void ForceInfect_And_Propagate_ToNearbyAnimal()
        {
            // deterministic roll that ensures propagation occurs for low-resistance targets (roll 0.01)
            var health = new HealthSystem(() => 0.01);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var src = module.CreateAnimal("cow_holstein");
            var tgt = module.CreateAnimal("cow_holstein");

            // place animals within range
            src.Position = new Position(0, 0, 0);
            tgt.Position = new Position(1, 1, 0);

            // create a disease status on source
            var ds = new DiseaseStatus { Name = "test", Type = DiseaseType.Acute, Severity = 0.9, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);

            // run update which will call Propagate
            module.Update(0.1);

            var report = health.CheckHealth(tgt);
            Assert.True(report.IsDiseased, "La cible doit être infectée par propagation");
        }

        [Fact]
        public void Propagation_RespectsResistance()
        {
            // deterministic roll that would infect low-resistance targets but not very high-resistance ones
            var health = new HealthSystem(() => 0.01);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var src = module.CreateAnimal("cow_holstein");
            var tgt = module.CreateAnimal("cow_holstein");

            src.Position = new Position(0, 0, 0);
            tgt.Position = new Position(1, 1, 0);

            // give target high genetic resistance
            tgt.Genetics = new System.Collections.Generic.Dictionary<string, object> { ["disease_resistance"] = 0.99 };

            var ds = new DiseaseStatus { Name = "test", Type = DiseaseType.Acute, Severity = 0.9, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);

            module.Update(0.1);

            var report = health.CheckHealth(tgt);
            Assert.False(report.IsDiseased, "La cible ne doit pas être infectée si la résistance génétique est élevée");
        }
    }
}
