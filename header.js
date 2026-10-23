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

  // Keep the area-wise tutor directory at the very end of every student-facing
  // home-tutor page, immediately before the footer. Never move it on tutor signup.
  function setupAreaWiseTutorLinks() {
    const path = window.location.pathname || '';
    if (!path.includes('/home-tutor/') || path.endsWith('/join-as-a-tutor.html')) return;

    const areas = [
      {path:'best-home-tutor-in-bani-park-jaipur.html', name:'Bani Park'},
      {path:'best-home-tutor-in-c-scheme-jaipur.html', name:'C Scheme'},
      {path:'best-home-tutor-in-chitrakoot-jaipur.html', name:'Chitrakoot'},
      {path:'best-home-tutor-in-civil-lines-jaipur.html', name:'Civil Lines'},
      {path:'best-home-tutor-in-durgapura-jaipur.html', name:'Durgapura'},
      {path:'best-home-tutor-in-gopalpura-jaipur.html', name:'Gopalpura'},
      {path:'best-home-tutor-in-jagatpura-jaipur.html', name:'Jagatpura'},
      {path:'best-home-tutor-in-jhotwara.html', name:'Jhotwara'},
      {path:'best-home-tutor-in-lalkothi-jaipur.html', name:'Lal Kothi'},
      {path:'best-home-tutor-in-malviya-nagar-jaipur.html', name:'Malviya Nagar'},
      {path:'best-home-tutor-in-mansarovar-jaipur.html', name:'Mansarovar'},
      {path:'best-home-tutor-in-murlipura-jaipur.html', name:'Murlipura'},
      {path:'best-home-tutor-in-pratap-nagar-jaipur.html', name:'Pratap Nagar'},
      {path:'best-home-tutor-in-raja-park-jaipur.html', name:'Raja Park'},
      {path:'best-home-tutor-in-sanganer-jaipur.html', name:'Sanganer'},
      {path:'best-home-tutor-in-shastri-nagar-jaipur.html', name:'Shastri Nagar'},
      {path:'best-home-tutor-in-sikar-road-jaipur.html', name:'Sikar Road'},
      {path:'best-home-tutor-in-sodala-jaipur.html', name:'Sodala'},
      {path:'best-home-tutor-in-tonk-phatak-jaipur.html', name:'Tonk Phatak'},
      {path:'best-home-tutor-in-vaishali-nagar-jaipur.html', name:'Vaishali Nagar'},
      {path:'best-home-tutor-in-vidhyadhar-nagar-jaipur.html', name:'Vidhyadhar Nagar'},
      {path:'best-home-tutor-in-vki-jaipur.html', name:'VKI'}
    ];

    let section = document.getElementById('sa-area-wise-directory');
    if (!section) {
      section = document.createElement('section');
      section.id = 'sa-area-wise-directory';
      section.className = 'section areas';
    }

    section.innerHTML = '<div class="container">' +
      '<div class="eyebrow">Areas We Serve</div>' +
      '<h2 class="section-title">Find Home Tutors Area-Wise in Jaipur</h2>' +
      '<p class="section-intro">Choose your locality to explore tuition information for that area. Tutor availability depends on the student’s class, subjects, exact location and schedule.</p>' +
      '<ul>' + areas.map(function (area) {
        const href = '/home-tutor/best-tutor-area-wise/' + area.path;
        if (window.location.pathname === href) return '<li><strong>Home Tuition in ' + area.name + ' (Current Area)</strong></li>';
        return '<li><a href="' + href + '"><strong>Home Tuition in ' + area.name + '</strong></a></li>';
      }).join('') + '</ul></div>';

    const footer = document.getElementById('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      const main = document.querySelector('main');
      if (main) main.appendChild(section);
    }
  }

  // Remove outdated area-page enquiry markup before the shared FormSubmit form loads.
  function migrateLegacyTutorEnquiryForm() {
    const path = window.location.pathname || '';
    if (!path.includes('/home-tutor/best-tutor-area-wise/')) return;
    if (document.getElementById('sa-student-enquiry-form')) return;

    // All older area pages contain this one enquiry section, even where the
    // WhatsApp form was already removed. Remove it so no blank placeholder remains.
    const section = document.querySelector('section#enquiry');
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

    ensureScript('sa-tutor-enquiry-script', '/assets/tutor-enquiry.js?v=20261023-whatsapp', function () {
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