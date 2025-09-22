using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class SpeciesContagionConfigTests
    {
        [Fact]
        public void SpeciesConfig_ContagionParameters_AffectPropagationRange()
        {
            // deterministic roll that would only infect when within a large range
            var health = new HealthSystem(() => 0.01);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            // override species config to set a tiny contagion range for cows
            var cowCfg = module.GetType().Assembly.GetType("PixelHarvest.Core.Features.Animals.SpeciesConfig");
            // instead of reflection, directly modify species via module by importing animals via JSON with species config applied;
            // easier approach: create two animals and manually set positions outside default but inside custom when changed in _species.

            // find the two animals
            var src = module.CreateAnimal("cow_holstein");
            var tgt = module.CreateAnimal("cow_holstein");

            // place them just outside default range (~6 units => dist2 = 36)
            src.Position = new Position(0, 0, 0);
            tgt.Position = new Position(6, 0, 0);

            // set source infected
            var ds = new DiseaseStatus { Name = "test", Type = DiseaseType.Acute, Severity = 0.9, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);

            // default propagation should not reach target (default range ~5 units)
            module.Update(0.1);
            var report = health.CheckHealth(tgt);
            Assert.False(report.IsDiseased, "Par défaut la cible ne doit pas être infectée à 6 unités");


            // Now update the module's species config to increase contagion range using the new public API
            var cfg = new SpeciesConfig
            {
                Species = "cow_holstein",
                DisplayName = "Holstein Cow",
                BaseSpecies = "cow",
                Icon = "🐄",
                Rarity = "common",
                PhysicalTraits = new PhysicalTraits { Size = "large", Lifespan = 2555, MaturityAge = 365, GenderRatio = new GenderRatio{ Male = 0.1, Female = 0.9 } },
                DefaultBreedingCooldownSeconds = 5.0,
                ContagionRangeUnitsSquared = 100.0, // increase to ~10 units
                ContagionBaseTransmissibility = 0.2,
                Production = new ProductionConfig { Primary = new ProductionPrimary { Type = "milk", BaseRate = 2.0 } }
            };
            module.UpdateSpeciesConfig(cfg);

            // run update again; now propagation should infect
            module.Update(0.1);
            var report2 = health.CheckHealth(tgt);
            Assert.True(report2.IsDiseased, "Après ajustement du range, la cible doit être infectée");
        }
    }
}
