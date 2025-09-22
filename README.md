# Pixel-Harvest

Pixel Harvest est un jeu de farm 3D relax en ligne. Plante, fais pousser et récolte tes cultures pour gagner des points. Profite d'un cycle jour/nuit immersif et d'un gameplay simple au clic. Objectif : faire prospérer ta parcelle et battre ton record de récoltes !

## 🎮 Fonctionnalités Actuelles

- **Agriculture 3D**: Système de plantation et récolte avec croissance automatique des cultures
- **Cycle Jour/Nuit**: Environnement dynamique avec effets visuels immersifs
- **Système Météorologique**: Météo changeante affectant la croissance des plantes
- **Saisons Dynamiques**: Quatre saisons avec événements saisonniers et effets environnementaux
- **Animaux Avancés**: Système complet d'élevage avec génétique, reproduction, soins et santé
- **Marché**: Système d'achat/vente avec économie dynamique
- **Missions Dynamiques**: Quêtes quotidiennes générées automatiquement avec système de progression
- **Personnalisation**: Customisation du personnage et décorations de ferme avec déblocables
- **Support Mobile Complet**: Interface tactile optimisée avec joystick virtuel et contrôles gestuels
- **Tutoriel Interactif**: Système de tutoriel complet avec 24 étapes guidées et support multilingue
- **Système Multilingue**: Support complet pour français, anglais et espagnol
- **Sauvegarde Automatique**: Persistance des données avec sauvegarde toutes les 10 secondes

## 🚀 Fonctionnalités Planifiées

Le développement futur de Pixel-Harvest continue avec le multijoueur en cours de développement, tandis que plusieurs fonctionnalités majeures ont déjà été implémentées :

### 🌐 Mode Multijoueur ([#24](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/24)) 🔄 **EN DÉVELOPPEMENT**
- **Coopération**: Gestion collaborative de fermes partagées
- **Compétition**: Défis agricoles entre joueurs
- **Communication**: Système de chat et d'interaction sociale
- **Synchronisation**: Temps réel pour une expérience fluide

### 🌪️ Événements Saisonniers ([#25](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/25)) ✅ **IMPLÉMENTÉ**
- **Événements Dynamiques**: Tempêtes, festivals agricoles, conditions météo spéciales ✅
- **Défis Saisonniers**: Événements aléatoires et récompenses uniques ✅
- **Système Météorologique**: Intégration complète avec les cycles de croissance ✅
- **Calendrier d'Événements**: Événements programmés selon les saisons ✅

### 🎨 Système de Personnalisation ([#26](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/26)) ✅ **IMPLÉMENTÉ**
- **Personnalisation d'Avatar**: Apparence et équipements du personnage ✅
- **Décorations de Ferme**: Bâtiments, décorations et thèmes personnalisables ✅
- **Contenu Déblocable**: Cosmétiques liés à la progression du jeu ✅
- **Système de Thèmes**: Support pour différents styles visuels ✅

### 🐄 Animaux Avancés ([#27](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/27)) ✅ **IMPLÉMENTÉ**
- **Élevage**: Système de reproduction avec traits génétiques ✅
- **Soins Avancés**: Santé, bonheur et besoins spécifiques ✅
- **Génétique**: Système de traits héréditaires et amélioration des races ✅
- **Système de Soins**: Alimentation, santé et bien-être automatisés ✅

### 📋 Missions Dynamiques ([#28](https://github.com/SpeedCraftTV/Pixel-Harvest/issues/28)) ✅ **IMPLÉMENTÉ**
- **Quêtes Quotidiennes**: Objectifs générés automatiquement chaque jour ✅
- **Système de Progression**: Suivi des accomplissements et récompenses ✅
- **Défis Variés**: Missions d'agriculture, d'élevage et de collection ✅
- **Récompenses Dynamiques**: Coins et bonus de progression ✅

## 🗺️ Roadmap de Développement

Pour une vue détaillée du planning et des priorités de développement, consultez le [ROADMAP.md](ROADMAP.md).

### Statut Actuel du Développement

1. **Phase 1** - Fondations et Architecture Modulaire ✅ **COMPLÉTÉ**
2. **Phase 2** - Systèmes Environnementaux (Événements) ✅ **COMPLÉTÉ**
3. **Phase 3** - Personnalisation et Créativité ✅ **COMPLÉTÉ**
4. **Phase 4** - Gameplay Étendu (Animaux et Quêtes) ✅ **COMPLÉTÉ**
5. **Phase 5** - Fonctionnalités Sociales (Multijoueur) 🔄 **EN COURS**

## 🤝 Comment Contribuer

### Pour les Développeurs

1. **Consultez la Documentation**
   - [Spécifications Techniques](design/FEATURE-SPECS.md)
   - [Documentation des Modules](src/features/)
   - [Configuration des Fonctionnalités](data/features.json)
   - [Documentation du Tutoriel](docs/TUTORIAL.md)
   - [Système d'Internationalisation](src/internationalization.js)

2. **Choisissez un Module**
   - `src/features/multiplayer/` - Système multijoueur (en développement)
   - `src/features/seasons/` - Événements saisonniers (implémenté)
   - `src/features/customization/` - Personnalisation (implémenté)
   - `src/features/animals/` - Système d'animaux avancé (implémenté)
   - `src/features/quests/` - Missions et quêtes (implémenté)
   - `src/tutorial/` - Système de tutoriel (complet)

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
- **Appareils Mobiles**: Support complet iOS Safari et Android Chrome avec contrôles tactiles optimisés
- **Fonctionnalités Requises**: WebGL, LocalStorage, WebSocket (pour multijoueur à venir)
- **Stockage Local**: Système de sauvegarde automatique persistant
- **Performance**: Ciblage 60 FPS avec qualité adaptative selon l'appareil
- **Accessibilité**: Support clavier, lecteurs d'écran et navigation par touches

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
| 🌪️ Événements Saisonniers | ✅ Implémenté | 1.0.0 | [Specs](src/features/seasons/README.md) |
| 🎨 Personnalisation | ✅ Implémenté | 0.8.0 | [Specs](src/features/customization/README.md) |
| 🐄 Animaux Avancés | ✅ Implémenté | 0.1.0 | [Specs](src/features/animals/README.md) |
| 📋 Missions Dynamiques | ✅ Implémenté | 0.9.0 | [Specs](src/features/quests/README.md) |
| 🎓 Système de Tutoriel | ✅ Complet | 1.0.0 | [Documentation](docs/TUTORIAL.md) |
| 🌍 Internationalisation | ✅ Actif | 1.0.0 | [Support](src/internationalization.js) |

## 📞 Support et Contact

- **Issues**: [GitHub Issues](https://github.com/SpeedCraftTV/Pixel-Harvest/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SpeedCraftTV/Pixel-Harvest/discussions)
- **Développeur**: [@SpeedCraftTV](https://github.com/SpeedCraftTV)

---

**🌱 Rejoignez-nous pour faire grandir Pixel-Harvest en une expérience agricole riche et engageante ! 🚜**