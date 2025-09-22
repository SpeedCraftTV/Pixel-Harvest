using System;
using System.IO;
using System.Threading.Tasks;

namespace PixelHarvest.Core
{
    internal static class Program
    {
        public static async Task<int> Main(string[] args)
        {
            Console.WriteLine("PixelHarvest.Core POC - Internationalization demo\n");

            var i18n = new InternationalizationSystem(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "data", "localization"));
            await i18n.InitializeAsync();

            // --- Animals demo ---
            var animalsModule = new Features.Animals.AnimalsModule();
            animalsModule.Initialize();
            var animal = animalsModule.CreateAnimal("cow_holstein");
            Console.WriteLine();
            Console.WriteLine("Animals demo: created animal:");
            Console.WriteLine($" - Id: {animal.AnimalId}");
            Console.WriteLine($" - Species: {animal.Species}");
            Console.WriteLine($" - Name: {animal.Name}");
            Console.WriteLine($" - Gender: {animal.Gender}");

            Console.WriteLine("Available languages:");
            foreach (var lang in i18n.GetAvailableLanguages())
            {
                Console.WriteLine($" - {lang.Code} ({lang.Name ?? "unknown"})");
            }

            Console.WriteLine();
            var key = "tutorial.steps.welcome.title";

            Console.WriteLine($"t({key}) in default language ({i18n.GetCurrentLanguage().Code}):");
            Console.WriteLine(i18n.T(key));

            Console.WriteLine();
            Console.WriteLine("Switching language to 'fr'...");
            if (await i18n.SetLanguageAsync("fr"))
            {
                Console.WriteLine(i18n.T(key));
            }

            Console.WriteLine();
            Console.WriteLine("Done. Press any key to exit.");
            Console.ReadKey(true);
            return 0;
        }
    }
}
