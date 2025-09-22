using System;
using Xunit;
using PixelHarvest.Core.Features.Animals;

namespace PixelHarvest.Core.Tests
{
    public class ContagionTransmissibilityTests
    {
        [Fact]
        public void Increasing_BaseTransmissibility_Increases_Infection_Probability()
        {
            // roll function that returns 0.15 for first propagation attempt
            double[] rolls = { 0.15, 0.15, 0.15 };
            int idx = 0;
            var health = new HealthSystem(() => rolls[Math.Min(idx++, rolls.Length-1)]);
            var module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            var src = module.CreateAnimal("cow_holstein");
            var tgt = module.CreateAnimal("cow_holstein");
            src.Position = new Position(0,0,0);
            tgt.Position = new Position(1,0,0);

            var ds = new DiseaseStatus { Name = "test", Type = DiseaseType.Acute, Severity = 0.5, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);

            // default base transmissibility is 0.2; transmissibility = base + 0.6*severity => 0.2 + 0.6*0.5 = 0.5
            // resistance default 0 => prob = 0.5, roll 0.15 -> infection occurs
            module.Update(0.1);
            var r1 = health.CheckHealth(tgt);
            Assert.True(r1.IsDiseased, "Avec la valeur par défaut la cible doit être infectée pour roll=0.15");

            // Reset: clear animals and re-create for fresh test
            module.ClearAllAnimals();
            src = module.CreateAnimal("cow_holstein");
            tgt = module.CreateAnimal("cow_holstein");
            src.Position = new Position(0,0,0);
            tgt.Position = new Position(1,0,0);
            health = new HealthSystem(() => 0.65); // roll higher so only higher transmissibility causes infection
            module = new AnimalsModule(null, null, health, null);
            module.Initialize();

            // set species config to lower base transmissibility so infection should not occur for roll=0.65
            var cfg = module.GetSpeciesConfig("cow_holstein");
            Assert.NotNull(cfg);
            cfg.ContagionBaseTransmissibility = 0.05; // lower base
            module.UpdateSpeciesConfig(cfg);

            src = module.CreateAnimal("cow_holstein");
            tgt = module.CreateAnimal("cow_holstein");
            src.Position = new Position(0,0,0);
            tgt.Position = new Position(1,0,0);
            ds = new DiseaseStatus { Name = "test2", Type = DiseaseType.Acute, Severity = 0.5, IncubationSeconds = 0.0, Start = DateTime.UtcNow };
            health.ForceInfect(src, ds);
            module.Update(0.1);
            var r2 = health.CheckHealth(tgt);
            Assert.False(r2.IsDiseased, "Avec base transmissibilité basse et roll=0.65 la cible ne doit pas être infectée");

            // Now increase base transmissibility and try again
            cfg.ContagionBaseTransmissibility = 0.6;
            module.UpdateSpeciesConfig(cfg);
            // re-infect source
            health.ForceInfect(src, ds);
            module.Update(0.1);
            var r3 = health.CheckHealth(tgt);
            Assert.True(r3.IsDiseased, "Avec base transmissibilité élevée la cible doit être infectée pour roll=0.65");
        }
    }
}
