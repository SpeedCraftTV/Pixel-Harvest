Pixel Harvest Core (C#) — README (src_cs)

But

Ce fichier README décrit le format JSON utilisé pour l'export/import par le cœur C# (méthodes `AnimalsModule.ExportAllAnimalsToJson` / `ImportAnimalsFromJson`). Le JSON exporté correspond à la sérialisation complète du modèle `Animal` en mémoire et sert principalement pour la persistance en round-trip et comme point de départ pour l'import vers d'autres systèmes (par exemple s&box). Ce n'est pas un schéma d'échange garanti stable — envisagez d'ajouter un champ de version si vous avez besoin de compatibilité à long terme.

Structure générale

L'export est un tableau d'objets `Animal`. Chaque objet contient l'état d'exécution et les champs de configuration. Champs importants (liste non exhaustive) :

- `id` (string) : identifiant unique attribué par `AnimalsModule`. Peut être régénéré lors de l'import si collision.
- `name` (string)
- `species` (string) : clé d'espèce (par exemple `"cow_holstein"`). Assurez-vous que le système cible reconnaît cette clé ou mappez-la lors de l'import.
- `gender` (string) : `"male"` ou `"female"`.
- `traits` (object) : `AnimalTraits` incluant `physicalTraits` et `stats`. Les données génétiques se trouvent sous `traits.genetics` comme dictionnaire.
- `stats` (object) : `AnimalStats` (santé, faim, âge, etc.).
- `breedingState` (object) : état de reproduction (`maturityAge`, `cooldownSeconds`, `lastBred`, `pregnancyStatus`). `pregnancyStatus` peut être `null` ou contenir `ChildGenetics` et des champs d'`elapsed`/`duration`.
- `offspring` (array) : liste de références vers les enfants (peut contenir des placeholders temporaires pour les naissances en attente).

Remarques et précautions

- Identifiants et références : les animaux importés conservent leur champ `id`. Si vous importez vers un système qui exige un format d'ID différent, mappez ou régénérez les IDs et mettez à jour les références croisées.
- Grossesse et naissances différées : le cœur C# utilise des naissances différées : `Breed()` marque une femelle comme enceinte ; `Update()` finalise la naissance et crée l'`Animal` enfant. L'export d'un animal en cours de grossesse contiendra `PregnancyStatus` avec `ChildGenetics` et informations de durée. L'import conservera cet état, mais attention : si vous l'importez dans une timeline différente, vous devrez peut-être ajuster les valeurs d'`elapsed`/`duration`.
- Génétique : la génétique est un dictionnaire qui associe des clés de traits à des valeurs numériques. Les génétiques des descendants sont calculées par moyenne et mutation à partir des parents.
- Champs runtime uniquement : certains champs (timers transitoires, caches en mémoire) peuvent être présents. Pour un import s&box plus léger, filtrez ces champs avant export.

Utilisation rapide (C#)

```csharp
// Export
string json = animalsModule.ExportAllAnimalsToJson();

// Import
animalsModule.ClearAllAnimals();
animalsModule.ImportAnimalsFromJson(json);
```

Import vers s&box — points à vérifier

- Mapping des espèces : assurez-vous que les clés d'espèce correspondent aux assets/entités dans s&box, ou fournissez une table de correspondance.
- Mapping d'ID : s&box peut exiger un format d'ID spécifique — remappez les IDs si nécessaire.
- Sécurité : ne considérez pas les JSON importés comme sûrs. Validez et whitelist les champs avant d'importer dans un environnement réseau.

Prochaines étapes suggérées

- Envisager la versioning du format d'export (ex. { "version": 1, "animals": [...] }).
- Ajouter un filtre d'export qui retire les champs runtime pour les imports s&box.

Si vous voulez, je peux aussi générer un exemple JSON composé de 1–2 animaux pour montrer la structure concrète.

Un exemple concret d'export est disponible dans `sample-animals-export.json` (deux animaux d'exemple) pour vous aider à démarrer.

Modèle de contagion (rappel rapide)

- Transmission : le `HealthSystem` supporte la propagation d'une maladie d'un animal à un autre lors d'une passe d'update. La probabilité d'infection dépend de la sévérité de la maladie source, d'une transmissibilité de base et de la résistance génétique de la cible.
- Portée : la contagion peut être limitée par une distance (utilisez la position de l'animal). Par défaut la mise en œuvre de test utilise une portée courte pour éviter des infections globales non désirées.
- API : `HealthSystem` expose une méthode de propagation invocable depuis `AnimalsModule.Update` et une méthode `ForceInfect(...)` utile pour les tests déterministes.

Ces mécanismes sont principalement pensés pour les tests et la simulation locale ; la logique est simple et extensible (contagion basée sur la proximité, variants, périodes d'épidémie, etc.).
