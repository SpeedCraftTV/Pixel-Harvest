using System;
using System.Collections.Generic;

namespace PixelHarvest.Core.Features.Animals
{
    public interface IGeneticsSystem
    {
        void Initialize();
        Dictionary<string, object> GenerateGenetics(string species, Dictionary<string, object>? seed = null);
        Dictionary<string, object> CalculateOffspring(Dictionary<string, object> parent1, Dictionary<string, object> parent2);
    }

    public class GeneticsSystem : IGeneticsSystem
    {
        private readonly Random _rand;

        public GeneticsSystem() : this(new Random()) { }

        // Allow injection of a seedable RNG for deterministic tests/simulations
        public GeneticsSystem(Random rng)
        {
            _rand = rng ?? new Random();
        }

        public void Initialize() { }

        public Dictionary<string, object> GenerateGenetics(string species, Dictionary<string, object>? seed = null)
        {
            return new Dictionary<string, object>
            {
                ["genomeId"] = Guid.NewGuid().ToString(),
                ["milk_production"] = _rand.NextDouble() * 1.0 + 0.5,
                ["disease_resistance"] = _rand.NextDouble()
            };
        }

        public Dictionary<string, object> CalculateOffspring(Dictionary<string, object> parent1, Dictionary<string, object> parent2)
        {
            // Merge parents' genetics into a child genetics map.
            // Numeric traits -> weighted mix with simple dominance and mutation.
            // Non-numeric or missing traits -> prefer parent1, then parent2.
            var result = new Dictionary<string, object>();

            // Collect all keys from both parents
            var keys = new HashSet<string>(parent1.Keys);
            foreach (var k in parent2.Keys) keys.Add(k);

            const double mutationRate = 0.03; // 3% chance to mutate a numeric trait

            foreach (var k in keys)
            {
                parent1.TryGetValue(k, out var v1);
                parent2.TryGetValue(k, out var v2);

                // Special handling for genomeId: create combined id
                if (string.Equals(k, "genomeId", StringComparison.OrdinalIgnoreCase))
                {
                    var id1 = v1 as string ?? Guid.NewGuid().ToString();
                    var id2 = v2 as string ?? Guid.NewGuid().ToString();
                    result[k] = id1 + "-" + id2;
                    continue;
                }

                if (v1 is double d1 && v2 is double d2)
                {
                    // dominance: higher parent has a slightly larger weight
                    var dominantWeight = d1 > d2 ? 0.6 : d1 < d2 ? 0.4 : 0.5;
                    var mixed = d1 * dominantWeight + d2 * (1 - dominantWeight);

                    // small mutation
                    if (_rand.NextDouble() < mutationRate)
                    {
                        // mutate by +/- up to 10%
                        var factor = 1.0 + (_rand.NextDouble() * 0.2 - 0.1);
                        mixed *= factor;
                    }

                    // clamp to reasonable bounds
                    result[k] = Clamp(mixed, 0.0, 10.0);
                }
                else if (v1 != null && v2 == null)
                {
                    result[k] = v1;
                }
                else if (v2 != null && v1 == null)
                {
                    result[k] = v2;
                }
                else if (v1 != null && v2 != null)
                {
                    // both exist but not numeric - prefer parent1
                    result[k] = v1;
                }
                else
                {
                    // fallback to a sensible default for numeric traits
                    result[k] = 0.0;
                }
            }

            return result;
        }

        private static double Clamp(double v, double min, double max) => Math.Max(min, Math.Min(max, v));
    }
}
