(function () {
  'use strict';

  const path = window.location.pathname || '';
  if (!path.includes('/home-tutor/') || path.endsWith('/join-as-a-tutor.html')) return;
  if (document.getElementById('sa-testimonials')) return;

  // Class labels and messages are draft suggestions and must be confirmed before publication.
  const students = [
    { name: 'Mannat Sharma', className: 'Class 10', message: 'Patient explanations at home give me time to understand each step, ask questions freely and practise until a topic feels clearer.', photo: '/assets/home-tutor/students/mannat-sharma.jpg' },
    { name: 'Samarth Singh', className: 'Class 9', message: 'With one-to-one guidance, I can spend extra time on the chapters I find difficult instead of moving ahead with unanswered questions.', photo: '/assets/home-tutor/students/samarth-singh.jpg' },
    { name: 'Aditya Pareek', className: 'Class 10', message: 'Working through examples and then trying similar questions on my own helps me understand the method, not just remember an answer.', photo: '/assets/home-tutor/students/aditya-pareek.jpg' },
    { name: 'Himanshu Sharma', className: 'Class 12', message: 'A planned home-tuition session can keep revision organised, with time for exam-style questions and the topics that need more practice.', photo: '/assets/home-tutor/students/himanshu-sharma.jpg' },
    { name: 'Harsh Nirwan', className: 'Class 9', message: 'A steady study routine at home helps me balance school homework, revision and practice without leaving everything until the last minute.' },
    { name: 'Rajvardhan', className: 'Class 8', message: 'When a difficult lesson is broken into smaller steps, I can follow the explanation more easily and build understanding one concept at a time.' },
    { name: 'Deepika', className: 'Class 10', message: 'Personal attention makes it easier to revisit important topics, identify mistakes and practise the questions that need more work.' },
    { name: 'Devansh', className: 'Class 7', message: 'Learning at my own pace means I can ask for another explanation when a new concept is confusing, then try it again with guidance.' },
    { name: 'Vikram Singh', className: 'Class 11', message: 'Solving worked examples together helps me connect concepts with questions and gradually become more independent in my practice.' },
    { name: 'Monika Nathawat', className: 'Class 12', message: 'Focused tuition time can make board preparation more structured, especially when I need to clear doubts and revisit a topic carefully.' },
    { name: 'Aman Deep', className: 'Class 9', message: 'Regular feedback on my practice helps me notice where I went wrong and understand how to approach a similar question next time.' },
    { name: 'Payal Shekhawat', className: 'Class 10', message: 'Following the school syllabus with planned revision helps me keep up with lessons and prepare steadily for class tests.' },
    { name: 'Tanishaka Mudgal', className: 'Class 8', message: 'Guided practice gives me a chance to try a question, discuss a mistake and then solve it again with a clearer understanding.' },
    { name: 'Deependra Singh', className: 'Class 11', message: 'Extra time on difficult chapters can help me strengthen the basics before moving to more challenging problems.' },
    { name: 'Kismat', className: 'Class 7', message: 'A calm explanation followed by a few practice questions makes homework feel more manageable and helps me prepare for the next lesson.' },
    { name: 'Isha Prajapat', className: 'Class 9', message: 'Short revision sessions at home can help me remember previous chapters while keeping up with what is being taught at school.' },
    { name: 'Sneha Poonia', className: 'Class 10', message: 'Seeing a concept explained in more than one way helps me find the approach that makes the most sense to me.', photo: '/assets/home-tutor/students/sneha-poonia.jpg' },
    { name: 'Yuvraj Singh', className: 'Class 8', message: 'Practising with guidance first and then attempting questions independently helps me work towards solving problems on my own.', photo: '/assets/home-tutor/students/yuvraj-singh.jpg' },
    { name: 'Manvendra Singh', className: 'Class 12', message: 'A tuition plan built around revision goals and exam-style practice can make study time more focused during the board-year schedule.', photo: '/assets/home-tutor/students/manvendra-singh.jpg' },
    { name: 'Anurag', className: 'Class 6', message: 'Going through mistakes without being rushed helps me understand why an answer is wrong and how to try the next question.' },
    { name: 'Ashok', className: 'Class 11', message: 'Regular doubt-clearing and practice can help me revisit difficult concepts consistently instead of cramming just before a test.' }
  ];

  function initialise() {
    if (!document.body || document.getElementById('sa-testimonials')) return;

    const section = document.createElement('section');
    section.id = 'sa-testimonials';
    section.className = 'sa-testimonials';
    section.setAttribute('aria-labelledby', 'sa-testimonials-title');
    section.innerHTML = [
      '<div class="sa-testimonials__inner">',
        '<header class="sa-testimonials__heading">',
          '<span class="sa-testimonials__eyebrow">LEARNING, ONE STEP AT A TIME</span>',
          '<h2 id="sa-testimonials-title">Student Experiences with Home Tuition</h2>',
          '<p>Personal attention, patient explanations and a study routine that suits each learner.</p>',
        '</header>',
        '<div class="sa-testimonials__carousel" role="region" aria-roledescription="carousel" aria-label="Student testimonial drafts">',
          '<button class="sa-testimonials__arrow sa-testimonials__prev" type="button" aria-label="Previous testimonial">‹</button>',
          '<div class="sa-testimonials__viewport" tabindex="0" aria-label="Use left and right arrow keys to browse testimonials" aria-live="polite">',
            '<article class="sa-testimonials__card">',
              '<div class="sa-testimonials__avatar" aria-label="Student photo">',
                '<img class="sa-testimonials__photo" alt="" loading="lazy" decoding="async">',
                '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="24" cy="18" r="7" fill="currentColor"/><path d="M10.5 38c1.9-7 6.8-10.5 13.5-10.5S35.6 31 37.5 38" fill="currentColor"/></svg>',
                '<span class="sa-testimonials__photo-sign">PHOTO</span>',
              '</div>',
              '<div class="sa-testimonials__person"></div>',
              '<div class="sa-testimonials__class"></div>',
              '<span class="sa-testimonials__draft-badge">SAMPLE DRAFT</span>',
              '<blockquote class="sa-testimonials__message"></blockquote>',
            '</article>',
          '</div>',
          '<button class="sa-testimonials__arrow sa-testimonials__next" type="button" aria-label="Next testimonial">›</button>',
        '</div>',
        '<div class="sa-testimonials__controls">',
          '<span class="sa-testimonials__count" aria-live="polite"></span>',
          '<div class="sa-testimonials__progress" role="progressbar" aria-label="Testimonial progress" aria-valuemin="1" aria-valuemax="' + students.length + '" aria-valuenow="1"><span></span></div>',
        '</div>',
        '<p class="sa-testimonials__footnote">Preview copy only: the class labels and messages are illustrative drafts, not verified student quotations. Please confirm every class and final wording with the student or parent/guardian, and obtain permission before publishing as genuine feedback.</p>',
      '</div>'
    ].join('');

    const message = section.querySelector('.sa-testimonials__message');
    const person = section.querySelector('.sa-testimonials__person');
    const classLabel = section.querySelector('.sa-testimonials__class');
    const avatar = section.querySelector('.sa-testimonials__avatar');
    const photo = section.querySelector('.sa-testimonials__photo');
    const photoFallback = avatar.querySelector('svg');
    const photoSign = avatar.querySelector('.sa-testimonials__photo-sign');
    const count = section.querySelector('.sa-testimonials__count');
    const progress = section.querySelector('.sa-testimonials__progress');
    const progressBar = progress.querySelector('span');
    const viewport = section.querySelector('.sa-testimonials__viewport');
    const card = section.querySelector('.sa-testimonials__card');
    let current = 0;
    let startX = null;

    function show(index) {
      current = (index + students.length) % students.length;
      const student = students[current];

      person.textContent = student.name;
      classLabel.textContent = student.className + ' · provisional';
      if (student.photo) {
        photo.src = student.photo;
        photo.alt = 'Photo of ' + student.name;
        photo.hidden = false;
        photoFallback.hidden = true;
        photoSign.hidden = true;
        avatar.setAttribute('aria-label', 'Photo of ' + student.name);
      } else {
        photo.removeAttribute('src');
        photo.alt = '';
        photo.hidden = true;
        photoFallback.hidden = false;
        photoSign.hidden = false;
        avatar.setAttribute('aria-label', 'Student photo placeholder');
      }
      message.textContent = student.message;
      count.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(students.length).padStart(2, '0');

      const percentage = ((current + 1) / students.length) * 100;
      progressBar.style.width = percentage + '%';
      progress.setAttribute('aria-valuenow', String(current + 1));

      card.classList.remove('is-entering');
      void card.offsetWidth;
      card.classList.add('is-entering');
    }

    section.querySelector('.sa-testimonials__prev').addEventListener('click', function () {
      show(current - 1);
    });
    section.querySelector('.sa-testimonials__next').addEventListener('click', function () {
      show(current + 1);
    });
    viewport.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        show(current - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + 1);
      }
    });
    viewport.addEventListener('touchstart', function (event) {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });
    viewport.addEventListener('touchend', function (event) {
      if (startX === null) return;
      const delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1));
      startX = null;
    }, { passive: true });

    show(0);

    // Keep the carousel immediately above the single shared enquiry form.
    const enquiry = document.getElementById('sa-student-enquiry-form');
    const footer = document.getElementById('footer');
    const main = document.querySelector('main');

    if (enquiry) {
      const enquirySection = enquiry.closest('.sa-enquiry-section');
      if (enquirySection && enquirySection.parentNode) enquirySection.parentNode.insertBefore(section, enquirySection);
      else if (enquiry.parentNode) enquiry.parentNode.insertBefore(section, enquiry);
      else document.body.appendChild(section);
    } else if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else if (main) {
      main.appendChild(section);
    } else {
      document.body.appendChild(section);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();