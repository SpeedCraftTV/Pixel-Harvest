Modèle de maladies — Pixel Harvest Core (src_cs)

Objectif

Ce document décrit le modèle de maladies implémenté dans `HealthSystem` et les points d'API utiles pour les développeurs et testeurs.

Concepts clés

- DiseaseStatus : objet stocké par animal décrivant une maladie active.
  - Name : identifiant de la maladie (ex. "generic_infection").
  - Type : `Acute` ou `Chronic`.
  - Severity : valeur (0.0 - 1.0) représentant l'impact de la maladie.
  - IncubationSeconds : durée avant que la sévérité commence à affecter réellement la santé.
  - Start : horodatage UTC du moment de la contagion.

- Effets sur la santé :
  - Avant incubation : la maladie est marquée mais n'applique pas d'effets (seulement diagnostics visibles via `CheckHealth`).
  - Après incubation : la santé est dégradée proportionnellement à la `Severity` et au type (les maladies chroniques ajoutent un impact constant additionnel).

- Acquisition :
  - Un animal vulnérable (santé basse & faim élevée) peut acquérir une maladie pendant `UpdateHealth`.
  - La probabilité d'acquisition est réduite par `genetics["disease_resistance"]` si présente.
  - Le type (aigu/chronique) et la sévérité sont dérivés du tirage aléatoire injectable.

API principale

- `HealthSystem.UpdateHealth(Animal animal, double deltaTime)`
  - Appelée par `AnimalsModule.Update` pour simuler la progression de la santé et des maladies.
  - Applique la décroissance liée à la faim et les effets des maladies déjà activées (après incubation).

- `HealthSystem.CheckHealth(Animal animal) : HealthReport`
  - Retourne la santé courante, un booléen `IsDiseased` et le `DiseaseStatus` si présent.

- `HealthSystem.TreatDisease(Animal animal, string treatment)`
  - Applique un traitement réduit la `Severity`. Si `Severity` descend en dessous d'un seuil, la maladie est supprimée.
  - Le traitement restaure aussi une partie de la santé et met à jour `animal.Care.LastVetVisit`.

- `HealthSystem.ApplyPreventiveCare(Animal animal)`
  - Ajoute une vaccination (`standard_vaccine`) et donne un petit boost de santé.

Testabilité

- La classe `HealthSystem` accepte une fonction de tirage `Func<double>` ou un `Random` injecté pour rendre le comportement déterministe dans les tests unitaires.
- Tests fournis :
  - `HealthSystemTests.cs` : couvre les cas de base (décroissance, traitement, résistance génétique).
  - `HealthSystemExtendedTests.cs` : couvre incubation, maladie chronique et effets cumulatifs, et traitement répété.

Notes et extensions possibles

- Contagion : améliorer le modèle pour propager les maladies entre animaux proches (nécessite gestion de position et portée).
- Variants de traitements : effets secondaires, coût, temps de récupération variable.
- Traçabilité / métriques : exposer un journal d'événements pour faciliter le debugging des épidémies en simulation.

Fin
