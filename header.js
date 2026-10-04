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

  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mobileNav');
    if (!menu) return;
    setMenuState(!menu.classList.contains('open'));
  };

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

  // Home Tutor — replace the old Online Classes card site-wide with a WhatsApp enquiry card.
  function setupTutorConnectCard() {
    if (!document.body) return;

    if (!document.getElementById('tutor-connect-card-style')) {
      const style = document.createElement('style');
      style.id = 'tutor-connect-card-style';
      style.textContent = \`\
        .tutor-connect-card {\
          position: relative;\
          overflow: hidden;\
          background: linear-gradient(135deg, #ffffff 0%, #f4fbf8 100%);\
          border: 1px solid rgba(22, 163, 74, .16);\
          box-shadow: 0 18px 45px rgba(15, 23, 42, .08);\
        }\
        .tutor-connect-card::before {\
          content: '';\
          position: absolute;\
          width: 180px;\
          height: 180px;\
          right: -70px;\
          top: -70px;\
          border-radius: 50%;\
          background: rgba(34, 197, 94, .10);\
        }\
        .tutor-connect-card::after {\
          content: '';\
          position: absolute;\
          width: 120px;\
          height: 120px;\
          left: -55px;\
          bottom: -55px;\
          border-radius: 50%;\
          background: rgba(245, 158, 11, .09);\
        }\
        .tutor-connect-card .connect-icon {\
          width: 74px;\
          height: 74px;\
          display: grid;\
          place-items: center;\
          border-radius: 22px;\
          background: #e9f9ef;\
          border: 1px solid #c9efd8;\
          font-size: 34px;\
          margin-bottom: 24px;\
        }\
        .tutor-connect-card h3 {\
          position: relative;\
          z-index: 1;\
          color: #102a43;\
          margin-bottom: 12px;\
        }\
        .tutor-connect-card p {\
          position: relative;\
          z-index: 1;\
          color: #526477;\
          margin-bottom: 20px;\
        }\
        .tutor-connect-card .connect-points {\
          position: relative;\
          z-index: 1;\
          display: grid;\
          gap: 10px;\
          margin: 0 0 24px;\
          padding: 0;\
          list-style: none;\
        }\
        .tutor-connect-card .connect-points li {\
          color: #34495e;\
        }\
        .tutor-connect-card .connect-points li::before {\
          content: '✓';\
          color: #16a34a;\
          font-weight: 800;\
          margin-right: 9px;\
        }\
        .tutor-connect-card .whatsapp-btn {\
          position: relative;\
          z-index: 2;\
          display: inline-flex;\
          align-items: center;\
          justify-content: center;\
          gap: 10px;\
          width: 100%;\
          min-height: 52px;\
          padding: 13px 20px;\
          border-radius: 14px;\
          background: #25d366;\
          color: #fff !important;\
          font-weight: 800;\
          text-decoration: none !important;\
          box-shadow: 0 10px 24px rgba(37, 211, 102, .25);\
          transition: transform .2s ease, box-shadow .2s ease;\
        }\
        .tutor-connect-card .whatsapp-btn:hover {\
          transform: translateY(-2px);\
          box-shadow: 0 14px 30px rgba(37, 211, 102, .32);\
        }\
        .tutor-connect-card .connect-small {\
          position: relative;\
          z-index: 1;\
          display: block;\
          margin-top: 12px;\
          text-align: center;\
          color: #718096;\
          font-size: .86rem;\
        }\
        @media (max-width: 600px) {\
          .tutor-connect-card .connect-icon { width: 64px; height: 64px; font-size: 29px; margin-bottom: 20px; }\
          .tutor-connect-card h3 { font-size: 1.55rem; line-height: 1.25; }\
          .tutor-connect-card p { font-size: .98rem; line-height: 1.7; }\
        }\
      \`;
      document.head.appendChild(style);
    }

    document.querySelectorAll('.service-card').forEach(function (card) {
      const heading = card.querySelector('h3');
      if (!heading || heading.textContent.trim().toLowerCase() !== 'online classes') return;
      if (card.classList.contains('tutor-connect-card')) return;

      card.classList.add('tutor-connect-card');
      card.innerHTML = \`
        <div class="connect-icon" aria-hidden="true">🎓</div>
        <h3>Connect with Us to Find the Perfect Tutor</h3>
        <p>Looking for the right tutor for your child? Tell us your child's class, subject, location and preferred timings. We will help you find a suitable tutor.</p>
        <ul class="connect-points">
          <li>Personalised tutor matching</li>
          <li>Home tuition options</li>
          <li>Classes 1 to 12</li>
          <li>Quick response on WhatsApp</li>
        </ul>
        <a class="whatsapp-btn" href="https://wa.me/917073468838?text=Hello%20Saraswat%20Academy%2C%20I%20am%20looking%20for%20a%20suitable%20tutor%20for%20my%20child.%20Please%20help%20me%20with%20available%20tutors." target="_blank" rel="noopener noreferrer" aria-label="Connect with Saraswat Academy on WhatsApp">💬 WhatsApp Us to Find a Tutor</a>
        <span class="connect-small">Usually the fastest way to enquire</span>
      \`;
    });

    // Add the replacement card even on pages where the old Online Classes card was already removed.
    document.querySelectorAll('.service-grid').forEach(function (grid) {
      if (grid.querySelector('.tutor-connect-card')) return;
      const card = document.createElement('article');
      card.className = 'service-card tutor-connect-card';
      card.innerHTML = \`
        <div class="connect-icon" aria-hidden="true">🎓</div>
        <h3>Connect with Us to Find the Perfect Tutor</h3>
        <p>Looking for the right tutor for your child? Tell us your child's class, subject, location and preferred timings. We will help you find a suitable tutor.</p>
        <ul class="connect-points">
          <li>Personalised tutor matching</li>
          <li>Home tuition options</li>
          <li>Classes 1 to 12</li>
          <li>Quick response on WhatsApp</li>
        </ul>
        <a class="whatsapp-btn" href="https://wa.me/917073468838?text=Hello%20Saraswat%20Academy%2C%20I%20am%20looking%20for%20a%20suitable%20tutor%20for%20my%20child.%20Please%20help%20me%20with%20available%20tutors." target="_blank" rel="noopener noreferrer" aria-label="Connect with Saraswat Academy on WhatsApp">💬 WhatsApp Us to Find a Tutor</a>
        <span class="connect-small">Usually the fastest way to enquire</span>
      \`;
      grid.appendChild(card);
    });
  }

  // Bind immediately when possible and also on DOMContentLoaded.
  // This works whether header.js loads before or after loader.js injects the header.
  bindHeaderNavigation();
  setupTutorConnectCard();

  // loader.js injects the shared header after DOMContentLoaded on many pages.
  // Re-run the tutor card setup after that injection.
  document.addEventListener('saraswat-header-loaded', function () {
    bindHeaderNavigation();
    setupTutorConnectCard();
  });

  document.addEventListener('DOMContentLoaded', function () {
    bindHeaderNavigation();
    setupTutorConnectCard();
  }, { once: true });
})();