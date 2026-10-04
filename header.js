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

  // Home Tutor area pages — keep the complete area directory linked on every page.
  function setupAreaWiseTutorLinks() {
    if (!document.body || !window.location.pathname.includes('/home-tutor/best-tutor-area-wise/')) return;

    const areas = [{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-adarsh-nagar-jaipur.html","name":"adarsh-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-agra-road-jaipur.html","name":"agra-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-ajmer-road-jaipur.html","name":"ajmer-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-ambabari-jaipur.html","name":"ambabari"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-amer-jaipur.html","name":"amer"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-ashok-nagar-jaipur.html","name":"ashok-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bais-godam-jaipur.html","name":"bais-godam"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bajaj-nagar-jaipur.html","name":"bajaj-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bani-park-jaipur.html","name":"bani-park"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bapu-nagar-jaipur.html","name":"bapu-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-benar-road-jaipur.html","name":"benar-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bhankrota-jaipur.html","name":"bhankrota"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bindayaka-jaipur.html","name":"bindayaka"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-brahmpuri-jaipur.html","name":"brahmpuri"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-c-scheme-jaipur.html","name":"c-scheme"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-chandpol-jaipur.html","name":"chandpol"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-chitrakoot-jaipur.html","name":"chitrakoot"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-civil-lines-jaipur.html","name":"civil-lines"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-durgapura-jaipur.html","name":"durgapura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-gandhi-path-jaipur.html","name":"gandhi-path"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-gopalbari-jaipur.html","name":"gopalbari"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-gopalpura-jaipur.html","name":"gopalpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-govindpura-jaipur.html","name":"govindpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-hasanpura-jaipur.html","name":"hasanpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-hathoj-jaipur.html","name":"hathoj"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-heerapura-jaipur.html","name":"heerapura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jagatpura-jaipur.html","name":"jagatpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jal-mahal-jaipur.html","name":"jal-mahal"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jhalana-jaipur.html","name":"jhalana"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jhotwara.html","name":"jhotwara.html"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jln-marg-jaipur.html","name":"jln-marg"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-kanakpura-jaipur.html","name":"kanakpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-kanota-jaipur.html","name":"kanota"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-kukas-jaipur.html","name":"kukas"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-lalarpura-jaipur.html","name":"lalarpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-lalkothi-jaipur.html","name":"lalkothi"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-mahal-road-jaipur.html","name":"mahal-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-mahapura-jaipur.html","name":"mahapura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-malpura-jaipur.html","name":"malpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-malviya-nagar-jaipur.html","name":"malviya-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-mansarovar-jaipur.html","name":"mansarovar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-mi-road-jaipur.html","name":"mi-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-muhana-mandi-jaipur.html","name":"muhana-mandi"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-murlipura-jaipur.html","name":"murlipura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-nirman-nagar-jaipur.html","name":"nirman-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-niwaru-road-jaipur.html","name":"niwaru-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-officers-campus-jaipur.html","name":"officers-campus"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-patrakar-colony-jaipur.html","name":"patrakar-colony"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-pratap-nagar-jaipur.html","name":"pratap-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-raja-park-jaipur.html","name":"raja-park"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sanganer-jaipur.html","name":"sanganer"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-shahpura-jaipur.html","name":"shahpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-shastri-nagar-jaipur.html","name":"shastri-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-shyam-nagar-jaipur.html","name":"shyam-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sikar-road-jaipur.html","name":"sikar-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sindhi-camp-jaipur.html","name":"sindhi-camp"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sirsi-road-jaipur.html","name":"sirsi-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sitapura-jaipur.html","name":"sitapura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sodala-jaipur.html","name":"sodala"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-subhash-nagar-jaipur.html","name":"subhash-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-tilak-nagar-jaipur.html","name":"tilak-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-tonk-phatak-jaipur.html","name":"tonk-phatak"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-transport-nagar-jaipur.html","name":"transport-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-triveni-nagar-jaipur.html","name":"triveni-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vaishali-nagar-jaipur.html","name":"vaishali-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vidhyadhar-nagar-jaipur.html","name":"vidhyadhar-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vki-jaipur.html","name":"vki"}];
    const section = document.querySelector('section.areas#areas');
    if (!section) return;

    const list = section.querySelector('ul');
    if (!list) return;

    list.innerHTML = areas.map(function (area) {
      const label = area.name.split('-').map(function (word) {
        return word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');
      return '<li><a href="/' + area.path + '"><strong>Home Tuition in ' + label + '</strong></a></li>';
    }).join('');
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

  // Bind immediately when possible and also after the page/header is ready.
  // The parent WhatsApp CTA uses a small DOM observer because loader.js and
  // other shared scripts can inject/rebuild parts of the page asynchronously.
  function runTutorPageEnhancements() {
    bindHeaderNavigation();
    setupTutorConnectCard();
    setupParentsHomeTuitionWhatsAppCard();
    setupAreaWiseTutorLinks();
  }

  runTutorPageEnhancements();

  document.addEventListener('saraswat-header-loaded', runTutorPageEnhancements);

  document.addEventListener('DOMContentLoaded', function () {
    runTutorPageEnhancements();

    // Give loader.js time to finish injecting shared content.
    window.setTimeout(runTutorPageEnhancements, 150);
    window.setTimeout(runTutorPageEnhancements, 600);
    window.setTimeout(runTutorPageEnhancements, 1200);

    // Keep watching briefly so the CTA is inserted even if the tutor section
    // is rendered after DOMContentLoaded.
    if (document.body && !window.__saTutorCTAObserver) {
      window.__saTutorCTAObserver = new MutationObserver(function () {
        setupParentsHomeTuitionWhatsAppCard();
      });

      window.__saTutorCTAObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      window.setTimeout(function () {
        if (window.__saTutorCTAObserver) {
          window.__saTutorCTAObserver.disconnect();
          window.__saTutorCTAObserver = null;
        }
      }, 5000);
    }
  }, { once: true });
})();