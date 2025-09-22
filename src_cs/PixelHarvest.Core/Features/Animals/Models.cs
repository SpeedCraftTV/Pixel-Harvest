using System;
using System.Collections.Generic;

namespace PixelHarvest.Core.Features.Animals
{
    public record Position(double X, double Y, double Z);

    public class Animal
    {
        public string AnimalId { get; set; } = string.Empty;
        public string Species { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int Age { get; set; }
        public Dictionary<string, object>? Genetics { get; set; }
        public AnimalStats Stats { get; set; } = new();
        public CareState Care { get; set; } = new();
        public ProductionState Production { get; set; } = new();
        public BreedingState Breeding { get; set; } = new();
        public BehaviorState Behavior { get; set; } = new();
        public Position Position { get; set; } = new(0,0,0);
        public DateTime CreatedAt { get; set; }
        public DateTime LastUpdate { get; set; }
    }

    public class AnimalTraits
    {
        public string? Name { get; set; }
        public string? Gender { get; set; }
        public int? Age { get; set; }
        public Position? Position { get; set; }
        public Dictionary<string, object>? Genetics { get; set; }
    }

    public class AnimalStats
    {
        public double Health { get; set; }
        public double Happiness { get; set; }
        public double Hunger { get; set; }
        public double Cleanliness { get; set; }
        public double Energy { get; set; }
        public double Social { get; set; }
    }

    public class CareState
    {
        public DateTime LastFed { get; set; }
        public string FoodType { get; set; } = string.Empty;
        public DateTime LastCleaned { get; set; }
        public DateTime? LastVetVisit { get; set; }
        public List<string>? Vaccinations { get; set; }
    }

    public class ProductionState
    {
        public string Type { get; set; } = string.Empty;
        public string Quality { get; set; } = string.Empty;
        public double Rate { get; set; }
        public DateTime LastProduced { get; set; }
        public double TotalLifetimeProduction { get; set; }
    }

    public class BreedingState
    {
        public int MaturityAge { get; set; }
        public DateTime? LastBred { get; set; }
        // Typed pregnancy status to track conception and duration
        public PregnancyStatus? PregnancyStatus { get; set; }
        // Cooldown window in seconds after breeding during which the animal cannot breed again
        public double CooldownSeconds { get; set; } = 0.0;
        public double BreedingValue { get; set; }
        public List<string>? Offspring { get; set; }
    }

    public class PregnancyStatus
    {
        // Ids of parents to allow resolution when birth occurs
        public string ParentAId { get; set; } = string.Empty;
        public string ParentBId { get; set; } = string.Empty;
        // Conception time
        public DateTime Start { get; set; }
        // Duration in seconds for pregnancy
        public double DurationSeconds { get; set; }
        // Optionally precomputed child genetics so birth is deterministic
        public Dictionary<string, object>? ChildGenetics { get; set; }
    }

    public class BehaviorState
    {
        public string Personality { get; set; } = string.Empty;
        public string Mood { get; set; } = string.Empty;
        public string Activity { get; set; } = string.Empty;
        public List<string> SocialBonds { get; set; } = new();
    }

    // Species configuration simplified
    public class SpeciesConfig
    {
        public string Species { get; set; } = string.Empty;
        public string DisplayName { get; set; } = string.Empty;
        public string BaseSpecies { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Rarity { get; set; } = string.Empty;
        public PhysicalTraits PhysicalTraits { get; set; } = new();
        public ProductionConfig Production { get; set; } = new();
        // Default cooldown in seconds applied to animals of this species after breeding
        public double DefaultBreedingCooldownSeconds { get; set; } = 5.0;
        // Contagion parameters (squared units for range to avoid sqrt in hot paths)
        // RangeUnitsSquared: squared distance threshold for contagion (default ~5 units => 25)
        public double ContagionRangeUnitsSquared { get; set; } = 25.0;
        // Base transmissibility multiplier in [0,1] applied before severity scaling
        public double ContagionBaseTransmissibility { get; set; } = 0.2;
    }

    public class PhysicalTraits
    {
        public string Size { get; set; } = string.Empty;
        public int Lifespan { get; set; }
        public int MaturityAge { get; set; }
        public GenderRatio GenderRatio { get; set; } = new();
    }

    public class GenderRatio
    {
        public double Male { get; set; }
        public double Female { get; set; }
    }

    public class ProductionConfig
    {
        public ProductionPrimary Primary { get; set; } = new();
    }

    public class ProductionPrimary
    {
        public string Type { get; set; } = string.Empty;
        public double BaseRate { get; set; }
    }
}
