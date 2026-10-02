(() => {
  let websiteZoom = 1;

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

  function initHeaderNavigation() {
    const button = document.getElementById('hamburger');
    const menu = document.getElementById('mobileNav');
    if (!button || !menu || button.dataset.bound === 'true') return;

    button.dataset.bound = 'true';

    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      setMenuState(!menu.classList.contains('open'));
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuState(false);
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

  document.addEventListener('DOMContentLoaded', initHeaderNavigation, { once: true });
})();