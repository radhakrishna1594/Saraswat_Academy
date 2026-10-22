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

    const areas = [{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-bani-park-jaipur.html","name":"bani-park"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-c-scheme-jaipur.html","name":"c-scheme"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-chitrakoot-jaipur.html","name":"chitrakoot"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-civil-lines-jaipur.html","name":"civil-lines"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-durgapura-jaipur.html","name":"durgapura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-gopalpura-jaipur.html","name":"gopalpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jagatpura-jaipur.html","name":"jagatpura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-jhotwara.html","name":"jhotwara.html"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-lalkothi-jaipur.html","name":"lalkothi"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-malviya-nagar-jaipur.html","name":"malviya-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-mansarovar-jaipur.html","name":"mansarovar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-murlipura-jaipur.html","name":"murlipura"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-pratap-nagar-jaipur.html","name":"pratap-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-raja-park-jaipur.html","name":"raja-park"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sanganer-jaipur.html","name":"sanganer"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-shastri-nagar-jaipur.html","name":"shastri-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sikar-road-jaipur.html","name":"sikar-road"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-sodala-jaipur.html","name":"sodala"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-tonk-phatak-jaipur.html","name":"tonk-phatak"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vaishali-nagar-jaipur.html","name":"vaishali-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vidhyadhar-nagar-jaipur.html","name":"vidhyadhar-nagar"},{"path":"home-tutor/best-tutor-area-wise/best-home-tutor-in-vki-jaipur.html","name":"vki"}];
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


  // Remove the legacy WhatsApp enquiry section on area pages so the shared
  // FormSubmit form is the only enquiry form. The shared form script is loaded
  // immediately after this function by loadTutorEnquiryExperience().
  function migrateLegacyTutorEnquiryForm() {
    const path = window.location.pathname || '';
    if (!path.includes('/home-tutor/best-tutor-area-wise/')) return;
    if (document.getElementById('sa-student-enquiry-form')) return;

    const legacy = document.getElementById('enquiryForm');
    const placeholder = document.querySelector('.legacy-form-replaced');
    const section = (legacy && (legacy.closest('section#enquiry') || legacy.closest('section.enquiry') || legacy.closest('section'))) ||
                    (placeholder && placeholder.closest('section#enquiry')) ||
                    document.querySelector('section#enquiry');
    if (section) section.remove();
  }

  // Load shared home-tutor enquiry and testimonial assets on all tutor pages.
  // The enquiry script loads first so the carousel can position itself before the form.
  function loadTutorEnquiryExperience() {
    const pathname = window.location.pathname || '';
    if (!pathname.includes('/home-tutor/') || pathname.endsWith('/join-as-a-tutor.html')) return;

    function ensureStylesheet(id, href) {
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }

    function ensureScript(id, src, onReady) {
      const existing = document.getElementById(id);
      if (existing) {
        if (existing.dataset.loaded === 'true') {
          if (onReady) onReady();
        } else if (onReady) {
          existing.addEventListener('load', onReady, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = false;
      script.onload = function () {
        script.dataset.loaded = 'true';
        if (onReady) onReady();
      };
      script.onerror = function () {
        console.error('Unable to load tutor page asset:', src);
        if (onReady) onReady();
      };
      document.head.appendChild(script);
    }

    ensureStylesheet('sa-tutor-enquiry-style', '/assets/tutor-enquiry.css');
    ensureStylesheet('sa-tutor-testimonials-style', '/assets/tutor-testimonials.css');

    ensureScript('sa-tutor-enquiry-script', '/assets/tutor-enquiry.js?v=20261022-areaformfix3', function () {
      ensureScript('sa-tutor-testimonials-script', '/assets/tutor-testimonials.js');
    });
  }

    // Bind immediately when possible and also after the page/header is ready.
  function runTutorPageEnhancements() {
    bindHeaderNavigation();
    setupAreaWiseTutorLinks();
    migrateLegacyTutorEnquiryForm();
    loadTutorEnquiryExperience();
  }
  runTutorPageEnhancements();

  document.addEventListener('saraswat-header-loaded', runTutorPageEnhancements);

  document.addEventListener('DOMContentLoaded', function () {
    runTutorPageEnhancements();

    // Give loader.js time to finish injecting shared content.
    window.setTimeout(runTutorPageEnhancements, 150);
    window.setTimeout(runTutorPageEnhancements, 600);
    window.setTimeout(runTutorPageEnhancements, 1200);

  }, { once: true });
})();