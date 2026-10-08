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


    // Bind immediately when possible and also after the page/header is ready.
  function runTutorPageEnhancements() {
    bindHeaderNavigation();
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

  }, { once: true });
})();