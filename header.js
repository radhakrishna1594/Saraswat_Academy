(() => {
  let websiteZoom = 1;
  let navigationBound = false;

  function setMenuState(open) {
    const button = document.getElementById('hamburger');
    const menu = document.getElementById('mobileNav');
    if (!button || !menu) return;

    button.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function bindHeaderNavigation() {
    if (navigationBound) return;
    navigationBound = true;

    // The shared header is injected dynamically by loader.js, so use
    // event delegation rather than depending on the header already existing.
    document.addEventListener('click', function (event) {
      const button = event.target.closest('#hamburger');

      if (button) {
        event.preventDefault();
        event.stopPropagation();

        const menu = document.getElementById('mobileNav');
        if (menu) {
          setMenuState(!menu.classList.contains('open'));
        }
        return;
      }

      if (event.target.closest('#mobileNav a')) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenuState(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) setMenuState(false);
    });
  }

  window.changeZoom = function (amount) {
    websiteZoom = Math.min(1.3, Math.max(0.8, websiteZoom + amount));
    document.body.style.zoom = websiteZoom;
  };

  window.resetZoom = function () {
    websiteZoom = 1;
    document.body.style.zoom = '1';
  };

  // Bind immediately when possible and also on DOMContentLoaded.
  // This works whether header.js loads before or after loader.js injects the header.
  bindHeaderNavigation();
  document.addEventListener('DOMContentLoaded', bindHeaderNavigation, { once: true });
})();