PixelHarvest.Core - POC C# port of core game logic

This folder contains a small .NET console project used as a proof-of-concept to port Pixel Harvest core logic from JavaScript to C#.

What's included:
- `InternationalizationSystem.cs` - a minimal port of the JS i18n system that loads JSON translation files from `data/localization`.
- `Program.cs` - a small demo that loads translations and displays a sample key in two languages.
- `PixelHarvest.Core.csproj` - project file targeting .NET 8.

How to run (Windows, PowerShell):

```powershell
cd src_cs/PixelHarvest.Core
dotnet build
dotnet run --configuration Debug
```

Notes:
- This is intentionally a small, engine-agnostic core library. The next step is to port game modules (Animals, Tutorial) and then adapt to s&box addon structure.
- JSON localization files are copied to output during build via csproj include.
