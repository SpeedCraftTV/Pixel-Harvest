using System;

namespace PixelHarvest.Core.Features.Animals
{
    public interface IProductionSystem
    {
        void Initialize();
        void UpdateProduction(Animal animal, double deltaTime);
    }

    public class ProductionSystem : IProductionSystem
    {
        public void Initialize() { }

        public void UpdateProduction(Animal animal, double deltaTime)
        {
            // Simple production: increment total production based on rate
            var produced = animal.Production.Rate * deltaTime;
            animal.Production.TotalLifetimeProduction += produced;
            animal.Production.LastProduced = DateTime.UtcNow;
        }
    }
}
