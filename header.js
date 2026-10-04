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


  // Parent Home Tuition WhatsApp CTA — place a dedicated enquiry card
  // directly above the existing "Hire a Tutor" card on all home-tutor pages.
  function setupParentsHomeTuitionWhatsAppCard() {
    if (!document.body) return;

    if (!document.getElementById('parents-home-tuition-whatsapp-style')) {
      const style = document.createElement('style');
      style.id = 'parents-home-tuition-whatsapp-style';
      style.textContent = \`
        .parents-home-tuition-whatsapp-card {
          grid-column: 1 / -1;
          position: relative;
          overflow: hidden;
          display: grid !important;
          grid-template-columns: 74px minmax(0, 1fr);
          gap: 24px;
          text-decoration: none !important;
          color: #fff !important;
          background:
            radial-gradient(circle at 92% 10%, rgba(37, 211, 102, .22), transparent 26%),
            radial-gradient(circle at 3% 94%, rgba(244, 185, 66, .18), transparent 24%),
            linear-gradient(135deg, #0d2138 0%, #123653 58%, #105348 100%);
          border: 1px solid rgba(101, 230, 160, .24);
          box-shadow: 0 26px 70px rgba(11, 23, 41, .18);
          transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
        }

        .parents-home-tuition-whatsapp-card::before {
          content: '';
          position: absolute;
          width: 180px;
          height: 180px;
          right: -78px;
          bottom: -92px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, .10);
        }

        .parents-home-tuition-whatsapp-card:hover {
          transform: translateY(-4px);
          border-color: rgba(103, 231, 159, .55);
          box-shadow: 0 34px 82px rgba(11, 23, 41, .24);
        }

        .parents-home-tuition-whatsapp-card .tutor-option-icon {
          background: rgba(37, 211, 102, .14);
          border-color: rgba(127, 237, 170, .34);
          box-shadow: 0 10px 22px rgba(0, 0, 0, .14);
        }

        .parents-home-tuition-whatsapp-card .tutor-option-label {
          color: #a8efc1;
        }

        .parents-home-tuition-whatsapp-card .parents-cta-lead {
          max-width: 780px;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, .84);
        }

        .parents-home-tuition-whatsapp-card .parents-cta-list {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 9px;
          margin: 0 0 22px;
          padding: 0;
          list-style: none;
          color: rgba(255, 255, 255, .92);
          font-size: 14px;
        }

        .parents-home-tuition-whatsapp-card .parents-cta-list li::before {
          content: '✓';
          color: #79e7a6;
          font-weight: 900;
          margin-right: 9px;
        }

        .parents-home-tuition-whatsapp-card .parents-cta-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 12px 18px;
          border-radius: 13px;
          background: #25d366;
          color: #fff !important;
          font-weight: 900;
          text-decoration: none !important;
          box-shadow: 0 10px 25px rgba(37, 211, 102, .26);
          transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
        }

        .parents-home-tuition-whatsapp-card:hover .parents-cta-btn {
          background: #20c95f;
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(37, 211, 102, .32);
        }

        .parents-home-tuition-whatsapp-card .parents-cta-small {
          position: relative;
          z-index: 1;
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, .62);
          font-size: 11px;
        }

        @media (max-width: 760px) {
          .parents-home-tuition-whatsapp-card {
            grid-column: auto;
            grid-template-columns: 58px minmax(0, 1fr);
            gap: 16px;
            padding: 24px;
          }

          .parents-home-tuition-whatsapp-card .parents-cta-lead {
            font-size: .98rem;
            line-height: 1.7;
          }

          .parents-home-tuition-whatsapp-card .parents-cta-list {
            font-size: 13px;
          }

          .parents-home-tuition-whatsapp-card .parents-cta-btn {
            width: 100%;
            min-height: 50px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .parents-home-tuition-whatsapp-card,
          .parents-home-tuition-whatsapp-card .parents-cta-btn {
            transition: none;
          }

          .parents-home-tuition-whatsapp-card:hover,
          .parents-home-tuition-whatsapp-card:hover .parents-cta-btn {
            transform: none;
          }
        }
      \`;
      document.head.appendChild(style);
    }

    const whatsappMessage =
      "Hello Saraswat Academy, I am looking for home tuition for my child. " +
      "Please help me find a suitable tutor.";

    const whatsappHref =
      "https://wa.me/917073468838?text=" +
      encodeURIComponent(whatsappMessage);

    document.querySelectorAll('.tutor-options-container').forEach(function (container) {
      if (container.querySelector('.parents-home-tuition-whatsapp-card')) return;

      const hireCard = container.querySelector('.hire-card');
      if (!hireCard) return;

      const card = document.createElement('a');
      card.className = 'tutor-option-card parents-home-tuition-whatsapp-card';
      card.href = whatsappHref;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.setAttribute(
        'aria-label',
        'Contact Saraswat Academy on WhatsApp for home tuition'
      );

      card.innerHTML = \`
        <div class="tutor-option-icon" aria-hidden="true">💬</div>

        <div class="tutor-option-content">
          <span class="tutor-option-label">FOR PARENTS</span>

          <h3>Find the Right Home Tuition for Your Child</h3>

          <p class="parents-cta-lead">
            Looking for a caring tutor, clear explanations and personal attention?
            Tell us your child's class, subjects, area and preferred timings —
            we'll help you explore suitable home tuition options.
          </p>

          <ul class="parents-cta-list">
            <li>Home Tuition at Your Doorstep</li>
            <li>Classes 1 to 12 • Major Subjects</li>
            <li>Personalised Attention &amp; Doubt Support</li>
            <li>Flexible Timings</li>
          </ul>

          <span class="parents-cta-btn">
            💬 Talk to Us on WhatsApp <span>→</span>
          </span>

          <span class="parents-cta-small">
            Tap anywhere on this card to start your WhatsApp enquiry
          </span>
        </div>
      \`;

      container.insertBefore(card, hireCard);
    });
  }

  // Bind immediately when possible and also on DOMContentLoaded.
  // This works whether header.js loads before or after loader.js injects the header.
  bindHeaderNavigation();
  setupTutorConnectCard();
  setupParentsHomeTuitionWhatsAppCard();

  // loader.js injects the shared header after DOMContentLoaded on many pages.
  // Re-run the tutor card setup after that injection.
  document.addEventListener('saraswat-header-loaded', function () {
    bindHeaderNavigation();
    setupTutorConnectCard();
    setupParentsHomeTuitionWhatsAppCard();
  });

  document.addEventListener('DOMContentLoaded', function () {
    bindHeaderNavigation();
    setupTutorConnectCard();
    setupParentsHomeTuitionWhatsAppCard();
  }, { once: true });
})();