(function () {
  'use strict';

  const FORM_ID = 'sa-student-enquiry-form';
  const EMAIL = 'grassrootedtech@gmail.com';
  const THANK_YOU = 'https://www.saraswatacademy.in/thank-you-tutor.html';
  const FORM_ACTION = 'https://formsubmit.co/' + EMAIL;

  function removeOldFormsAndWhatsAppCards() {
    document.querySelectorAll('form').forEach(function (form) {
      if (form.id === FORM_ID) return;
      const section = form.closest('section');
      if (section && (section.id === 'enquiry' || section.id === 'hire-form' ||
          section.classList.contains('form-section') || section.querySelectorAll('form').length === 1)) {
        section.remove();
      } else {
        form.remove();
      }
    });

    document.querySelectorAll('a, button, [role="button"]').forEach(function (node) {
      const href = (node.getAttribute('href') || '').toLowerCase();
      const label = (node.innerText || node.getAttribute('aria-label') || '').toLowerCase();
      if (!(href.includes('wa.me') || href.includes('whatsapp.com') ||
            (label.includes('whatsapp') && (label.includes('connect') || label.includes('chat') || label.includes('message'))))) return;
      const card = node.closest('.whatsapp-card, .connect-card, .contact-card, .cta-card, article, .card');
      if (card) card.remove();
      else node.remove();
    });

    document.querySelectorAll('[class*="whatsapp"], [id*="whatsapp"], [class*="whats-app"], [id*="whats-app"]').forEach(function (node) {
      if (node.id === FORM_ID || node.closest('#' + FORM_ID)) return;
      node.remove();
    });
  }

  function buildFormSection() {
    const section = document.createElement('section');
    section.className = 'sa-enquiry-section';
    section.id = 'enquiry';
    section.innerHTML = `
      <div class="sa-enquiry-shell">
        <div class="sa-enquiry-intro">
          <span class="sa-enquiry-kicker">PERSONALISED LEARNING SUPPORT</span>
          <h2>Let’s Find the Right Tutor for Your Child</h2>
          <p>Share a few details and our team will review your requirement and contact you to discuss suitable tuition options.</p>
          <div class="sa-enquiry-points">
            <span><b>✓</b> Classes 1–12</span>
            <span><b>✓</b> School boards &amp; subjects</span>
            <span><b>✓</b> Home or online options</span>
          </div>
          <div class="sa-enquiry-note"><span aria-hidden="true">🔒</span><span>Your information is used to respond to this tuition enquiry.</span></div>
        </div>
        <div class="sa-enquiry-card">
          <div class="sa-enquiry-card-head">
            <span class="sa-enquiry-step">STUDENT ENQUIRY</span>
            <h3>Tell Us About Your Child</h3>
            <p>Fields marked <span aria-hidden="true">*</span> are required.</p>
          </div>
          <form id="${FORM_ID}" action="${FORM_ACTION}" method="POST" accept-charset="UTF-8">
            <input type="hidden" name="_subject" value="New Home Tuition Enquiry | Saraswat Academy">
            <input type="hidden" name="_template" value="table">
            <input type="hidden" name="_captcha" value="true">
            <input type="hidden" name="_next" value="${THANK_YOU}">
            <input type="hidden" name="Enquiry Page" id="sa-enquiry-page" value="">
            <div class="sa-enquiry-grid">
              <div class="sa-field">
                <label for="sa-parent-name">Parent / Guardian Name <span>*</span></label>
                <input id="sa-parent-name" name="Parent / Guardian Name" type="text" autocomplete="name" placeholder="Your full name" required>
              </div>
              <div class="sa-field">
                <label for="sa-mobile">Mobile Number <span>*</span></label>
                <input id="sa-mobile" name="Mobile Number" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile number" pattern="[6-9][0-9]{9}" minlength="10" maxlength="10" title="Enter a valid 10-digit Indian mobile number" required>
              </div>
              <div class="sa-field">
                <label for="sa-email">Email Address <span>*</span></label>
                <input id="sa-email" name="Email Address" type="email" autocomplete="email" placeholder="you@example.com" required>
              </div>
              <div class="sa-field">
                <label for="sa-student-name">Student Name <span>*</span></label>
                <input id="sa-student-name" name="Student Name" type="text" autocomplete="off" placeholder="Student’s full name" required>
              </div>
              <div class="sa-field">
                <label for="sa-class">Student’s Class <span>*</span></label>
                <select id="sa-class" name="Student Class" required>
                  <option value="">Select class</option>
                  ${Array.from({length:12}, (_,i) => '<option value="Class ' + (i+1) + '">Class ' + (i+1) + '</option>').join('')}
                </select>
              </div>
              <div class="sa-field">
                <label for="sa-board">Student’s Board <span>*</span></label>
                <select id="sa-board" name="Student Board" required>
                  <option value="">Select board</option>
                  <option>CBSE</option><option>RBSE / Rajasthan Board</option>
                  <option>ICSE / ISC</option><option>IB</option>
                  <option>Cambridge / IGCSE</option><option>Other</option>
                </select>
              </div>
              <div class="sa-field sa-field-full">
                <label for="sa-school">School Name <span class="sa-optional">(optional)</span></label>
                <input id="sa-school" name="School Name" type="text" placeholder="Enter current school name (if applicable)">
              </div>
              <div class="sa-field sa-field-full">
                <label for="sa-subjects">Subjects Required <span>*</span></label>
                <input id="sa-subjects" name="Subjects Required" type="text" placeholder="e.g. Mathematics, Science, English" required>
              </div>
              <div class="sa-field sa-field-full">
                <label for="sa-address">Full Address <span>*</span></label>
                <textarea id="sa-address" name="Full Address" rows="3" autocomplete="street-address" placeholder="House / flat, street, area, city and PIN code" required></textarea>
              </div>
              <div class="sa-field sa-field-full">
                <label for="sa-query">Any Other Query <span class="sa-optional">(optional)</span></label>
                <textarea id="sa-query" name="Any Other Query" rows="3" placeholder="Tell us about learning goals, preferred timings or anything else we should know"></textarea>
              </div>
            </div>
            <button class="sa-enquiry-submit" type="submit">Submit Enquiry <span aria-hidden="true">→</span></button>
            <p class="sa-enquiry-privacy">By submitting, you agree that Saraswat Academy may contact you about this enquiry.</p>
          </form>
        </div>
      </div>`;

    const pageField = section.querySelector('#sa-enquiry-page');
    if (pageField) pageField.value = window.location.href;
    return section;
  }

  function initialise() {
    if (!document.body || !window.location.pathname.includes('/home-tutor/')) return;
    if (window.location.pathname.endsWith('/join-as-a-tutor.html')) return;
    if (document.getElementById(FORM_ID)) return;

    removeOldFormsAndWhatsAppCards();
    const section = buildFormSection();
    const footer = document.getElementById('footer');
    const main = document.querySelector('main');
    const testimonials = document.querySelector('section.sa-tutor-testimonials');
    const areaDirectory = document.querySelector('section.areas#areas');
    // Place the enquiry before testimonials and the area directory, matching the
    // intended page flow and keeping the shared form on every area-wise page.
    if (testimonials && testimonials.parentNode) testimonials.parentNode.insertBefore(section, testimonials);
    else if (areaDirectory && areaDirectory.parentNode) areaDirectory.parentNode.insertBefore(section, areaDirectory);
    else if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
    else if (main) main.appendChild(section);
    else document.body.appendChild(section);

    // Keep every existing enquiry CTA pointed at the single replacement form.
    document.querySelectorAll('a[href="#hire-form"], a[href="#enquiry"], a[href="#form"], a[href="#student-enquiry"]').forEach(function (link) {
      link.setAttribute('href', '#enquiry');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
})();