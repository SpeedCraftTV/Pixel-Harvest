// Rend le fix résilient face aux stacking contexts parents.
// Déplace #unifiedMenu comme enfant direct de <body> et nettoie z-index inline.
document.addEventListener('DOMContentLoaded', function () {
  try {
    var menu = document.getElementById('unifiedMenu');
    if (!menu) return;

    // Supprime z-index inline pour s'appuyer sur la feuille de styles
    if (menu.style && menu.style.zIndex) {
      menu.style.zIndex = '';
    }

    // Assurer que le menu capte les événements pointer/click
    if (menu.style) {
      menu.style.pointerEvents = 'auto';
    }

    // Si le menu n'est pas déjà un enfant direct de body, le déplacer
    if (menu.parentElement !== document.body) {
      document.body.appendChild(menu);
    }
  } catch (e) {
    // Ne pas bloquer l'application si erreur
    console.error('unified-menu-fix error:', e);
  }
});
