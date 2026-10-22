(function () {
  'use strict';
  if (!document.body || !window.location.pathname.includes('/home-tutor/')) return;
  if (window.location.pathname.endsWith('/join-as-a-tutor.html')) return;
  if (document.getElementById('sa-testimonials')) return;

  const students = [
    ['Mannat Sharma','Learning feels less stressful when a tutor explains each step patiently and gives me time to practise.'],
    ['Samarth Singh','A home tutor can focus on the topics I find difficult and help me build confidence before tests.'],
    ['Aditya Pareek','Regular practice and clear explanations make it easier to understand concepts instead of memorising answers.'],
    ['Himanshu Sharma','One-to-one attention helps me ask questions freely and work through mistakes without feeling rushed.'],
    ['Harsh Nirwan','A planned study routine at home helps me stay consistent with homework, revision and exam preparation.'],
    ['Rajvardhan','Breaking a difficult chapter into smaller steps makes learning more manageable and less confusing.'],
    ['Deepika','Personalised support helps me revise important topics and understand where I need a little more practice.'],
    ['Devansh','A tutor who adapts the explanation to my pace makes new concepts easier to follow.'],
    ['Vikram Singh','Working through examples together helps me learn the method and then try similar questions independently.'],
    ['Monika Nathawat','Focused tuition time gives me a chance to clear doubts that I may not ask during a busy classroom lesson.'],
    ['Aman Deep','Short practice sessions and regular feedback help me notice progress and keep improving step by step.'],
    ['Payal Shekhawat','Learning at home can be comfortable and focused, especially when lessons follow my school syllabus.'],
    ['Tanishaka Mudgal','Extra explanation and guided revision help me approach assignments and upcoming tests with more confidence.'],
    ['Deependra Singh','A tutor can help identify gaps in understanding and revisit them before moving on to harder questions.'],
    ['Kismat','Having time to ask questions and solve examples makes study sessions feel more useful and interactive.'],
    ['Isha Prajapat','Consistent guidance helps me organise my study time and keep up with schoolwork across subjects.'],
    ['Sneha Poonia','When a topic is explained in different ways, I can find the approach that makes the most sense to me.'],
    ['Yuvraj Singh','Practising with support first and then solving questions on my own helps me become more independent.'],
    ['Manvendra Singh','A home tuition plan built around my learning needs can make revision more focused and structured.'],
    ['Anurag','Going over mistakes calmly helps me understand the reason behind an answer and avoid repeating the same error.'],
    ['Ashok','Regular doubt-clearing and revision can help students prepare steadily rather than leaving everything until the last moment.']
  ];

  const section = document.createElement('section');
  section.id = 'sa-testimonials';
  section.className = 'sa-testimonials';
  section.setAttribute('aria-label', 'Student home tuition testimonial carousel');
  section.innerHTML = `
    <div class="sa-testimonials__inner">
      <div class="sa-testimonials__heading">
        <span class="sa-testimonials__eyebrow">LEARNING, ONE STEP AT A TIME</span>
        <h2>Student Experiences with Home Tuition</h2>
        <p>Personal attention, patient explanations and a study routine that fits the student.</p>
      </div>
      <div class="sa-testimonials__carousel" aria-roledescription="carousel">
        <button class="sa-testimonials__arrow sa-testimonials__prev" type="button" aria-label="Previous testimonial">‹</button>
        <div class="sa-testimonials__viewport" tabindex="0" aria-live="polite">
          <article class="sa-testimonials__card">
            <div class="sa-testimonials__avatar" aria-hidden="true"><span class="sa-testimonials__photo-sign">♙</span></div>
            <div class="sa-testimonials__stars" aria-hidden="true">✦ ✦ ✦</div>
            <blockquote class="sa-testimonials__message"></blockquote>
            <div class="sa-testimonials__person"></div>
            <div class="sa-testimonials__class">Class details to be confirmed</div>
            <p class="sa-testimonials__draft-note">Illustrative draft message — confirm with the student or parent before publishing as a testimonial.</p>
          </article>
        </div>
        <button class="sa-testimonials__arrow sa-testimonials__next" type="button" aria-label="Next testimonial">›</button>
      </div>
      <div class="sa-testimonials__controls">
        <span class="sa-testimonials__count" aria-live="polite"></span>
        <div class="sa-testimonials__dots" aria-label="Choose a testimonial"></div>
      </div>
      <p class="sa-testimonials__footnote">Names were supplied for this section. Please verify each student's class and obtain approval for the final wording before presenting these drafts as genuine feedback.</p>
    </div>`;

  const cards = Array.from(section.querySelectorAll('.sa-testimonials__card'));
  const message = section.querySelector('.sa-testimonials__message');
  const person = section.querySelector('.sa-testimonials__person');
  const classLabel = section.querySelector('.sa-testimonials__class');
  const avatar = section.querySelector('.sa-testimonials__photo-sign');
  const count = section.querySelector('.sa-testimonials__count');
  const dots = section.querySelector('.sa-testimonials__dots');
  const viewport = section.querySelector('.sa-testimonials__viewport');
  let current = 0;
  let startX = null;

  students.forEach(function (student, index) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'sa-testimonials__dot';
    dot.setAttribute('aria-label', 'Show testimonial ' + (index + 1));
    dot.addEventListener('click', function () { show(index); });
    dots.appendChild(dot);
  });

  function show(index) {
    current = (index + students.length) % students.length;
    const student = students[current];
    message.textContent = '“' + student[1] + '”';
    person.textContent = student[0];
    classLabel.textContent = 'Class details to be confirmed';
    avatar.textContent = student[0].split(/\\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 2);
    count.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(students.length).padStart(2, '0');
    dots.querySelectorAll('button').forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  section.querySelector('.sa-testimonials__prev').addEventListener('click', function () { show(current - 1); });
  section.querySelector('.sa-testimonials__next').addEventListener('click', function () { show(current + 1); });
  viewport.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  viewport.addEventListener('touchstart', function (event) { startX = event.changedTouches[0].clientX; }, {passive:true});
  viewport.addEventListener('touchend', function (event) {
    if (startX === null) return;
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) show(current + (delta < 0 ? 1 : -1));
    startX = null;
  }, {passive:true});

  show(0);
  const footer = document.getElementById('footer');
  const enquiry = document.getElementById('enquiry');
  if (enquiry && enquiry.parentNode) enquiry.parentNode.insertBefore(section, enquiry);
  else if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
  else {
    const main = document.querySelector('main');
    if (main) main.appendChild(section);
    else document.body.appendChild(section);
  }
})();