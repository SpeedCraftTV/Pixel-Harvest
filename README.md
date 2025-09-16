# Pixel-Harvest

Pixel Harvest est un jeu de farm 3D relax en ligne. Plante, fais pousser et récolte tes cultures pour gagner des points. Profite d'un cycle jour/nuit immersif et d'un gameplay simple au clic. Objectif : faire prospérer ta parcelle et battre ton record de récoltes !

## 🎮 Fonctionnalités Actuelles

- **Agriculture 3D**: Système de plantation et récolte avec croissance automatique des cultures
- **Cycle Jour/Nuit**: Environnement dynamique avec effets visuels immersifs
- **Système Météorologique**: Météo changeante affectant la croissance des plantes
- **Saisons**: Quatre saisons avec effets différents sur l'agriculture
- **Animaux de Ferme**: Poules, vaches et cochons avec production de ressources
- **Marché**: Système d'achat/vente avec économie dynamique
- **Objectifs**: Système de progression avec défis et récompenses
- **Customisation**: Interface personnalisable et contrôles adaptatifs
- **Support Mobile**: Interface tactile optimisée pour appareils mobiles

## 🚀 Fonctionnalités Planifiées

Le développement futur de Pixel-Harvest s'articule autour de cinq axes majeurs d'amélioration :

### 🌐 Mode Multijoueur ([#24](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/24))
- **Coopération**: Gestion collaborative de fermes partagées
- **Compétition**: Défis agricoles entre joueurs
- **Communication**: Système de chat et d'interaction sociale
- **Synchronisation**: Temps réel pour une expérience fluide

### 🌪️ Événements Saisonniers ([#25](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/25))
- **Événements Dynamiques**: Tempêtes, festivals agricoles, conditions météo spéciales
- **Défis Aléatoires**: Invasions de nuisibles, catastrophes naturelles
- **Récompenses Uniques**: Items exclusifs et bonus temporaires
- **Calendrier d'Événements**: Événements programmés et surprises

### 🎨 Système de Personnalisation ([#26](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/26))
- **Avatar**: Personnalisation complète de l'apparence du personnage
- **Ferme**: Décorations, bâtiments et thèmes personnalisables
- **Déblocables**: Contenu cosmétique lié à la progression
- **Créativité**: Outils de design et partage de créations

### 🐄 Animaux Avancés ([#27](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/27))
- **Élevage**: Système de reproduction avec traits génétiques
- **Soins Avancés**: Santé, bonheur et besoins spécifiques
- **Nouvelles Espèces**: Moutons, chevaux, abeilles et plus
- **Spécialisation**: Animaux de concours, de travail et de compagnie

### 📋 Missions Dynamiques ([#28](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/28))
- **Quêtes Procédurales**: Objectifs générés automatiquement
- **Défis Communautaires**: Objectifs globaux pour tous les joueurs
- **Système d'Achievements**: Accomplissements à long terme
- **Progression Narrative**: Histoires et missions guidées

## 🗺️ Roadmap de Développement

Pour une vue détaillée du planning et des priorités de développement, consultez le [ROADMAP.md](ROADMAP.md).

### Phases de Développement

1. **Phase 1** - Fondations et Architecture Modulaire
2. **Phase 2** - Fonctionnalités Sociales (Multijoueur)
3. **Phase 3** - Systèmes Environnementaux (Événements)
4. **Phase 4** - Personnalisation et Créativité
5. **Phase 5** - Gameplay Étendu (Animaux et Quêtes)

## 🤝 Comment Contribuer

### Pour les Développeurs

1. **Consultez la Documentation**
   - [Spécifications Techniques](design/FEATURE-SPECS.md)
   - [Documentation des Modules](src/features/)
   - [Configuration des Fonctionnalités](data/features.json)

2. **Choisissez un Module**
   - `src/features/multiplayer/` - Système multijoueur
   - `src/features/seasons/` - Événements saisonniers
   - `src/features/customization/` - Personnalisation
   - `src/features/animals/` - Système d'animaux avancé
   - `src/features/quests/` - Missions et quêtes

3. **Workflow de Développement**
   - Créez une branche : `feature/[module]-[fonctionnalité]`
   - Suivez le [template de PR](.github/PULL_REQUEST_TEMPLATE.md)
   - Testez sur mobile et desktop
   - Documentez vos changements

### Pour la Communauté

- **Feedback**: Testez les nouvelles fonctionnalités et partagez vos retours
- **Idées**: Proposez des améliorations dans les [issues](https://github.com/SpeedCraftTV/Pixel-Harvest/issues)
- **Documentation**: Aidez à améliorer la documentation utilisateur
- **Traduction**: Contribuez aux traductions multilingues

## 📋 Prérequis Techniques

- **Navigateurs Supportés**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Appareils Mobiles**: iOS Safari, Android Chrome
- **Fonctionnalités**: WebGL, LocalStorage, WebSocket (pour multijoueur)

## 🔧 Installation et Développement

```bash
# Cloner le repository
git clone https://github.com/SpeedCraftTV/Pixel-Harvest.git
cd Pixel-Harvest

# Aucune installation requise - ouvrir directement dans le navigateur
open index.html

# Ou utiliser un serveur local pour le développement
python -m http.server 8000
# Puis aller sur http://localhost:8000
```

## 📊 Statut des Fonctionnalités

| Fonctionnalité | Statut | Version | Documentation |
|---|---|---|---|
| 🌐 Multijoueur | 🔄 En développement | 0.1.0 | [Specs](src/features/multiplayer/README.md) |
| 🌪️ Événements Saisonniers | ✅ Activé | 1.0.0 | [Specs](src/features/seasons/README.md) |
| 🎨 Personnalisation | ✅ Activé | 0.8.0 | [Specs](src/features/customization/README.md) |
| 🐄 Animaux Avancés | 🔄 En développement | 0.1.0 | [Specs](src/features/animals/README.md) |
| 📋 Missions Dynamiques | ✅ Activé | 0.9.0 | [Specs](src/features/quests/README.md) |

## 📞 Support et Contact

- **Issues**: [GitHub Issues](https://github.com/SpeedCraftTV/Pixel-Harvest/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SpeedCraftTV/Pixel-Harvest/discussions)
- **Développeur**: [@SpeedCraftTV](https://github.com/SpeedCraftTV)

---

**🌱 Rejoignez-nous pour faire grandir Pixel-Harvest en une expérience agricole riche et engageante ! 🚜**