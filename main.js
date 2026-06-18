/* =============================================
   Tesra Travel Agency – Main JavaScript
   ============================================= */

/* === Dark Mode Toggle === */
const darkToggle = document.getElementById('darkModeToggle');
const darkToggleMobile = document.getElementById('darkModeToggleMobile');
const body = document.body;

// Load saved preference
if (localStorage.getItem('darkMode') === 'enabled') {
  body.classList.add('dark-mode');
  updateToggleBtn(true);
}

function handleToggleClick() {
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
  updateToggleBtn(isDark);
}

if (darkToggle) darkToggle.addEventListener('click', handleToggleClick);
if (darkToggleMobile) darkToggleMobile.addEventListener('click', handleToggleClick);

function updateToggleBtn(isDark) {
  if (darkToggle) {
    darkToggle.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i> Light'
      : '<i class="bi bi-moon-fill"></i> Dark';
  }
  if (darkToggleMobile) {
    darkToggleMobile.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';
  }
}

/* === Back to Top Button === */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
});
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* === Destination Filter (for destinations.html & index) === */
function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-category]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
initFilter();

/* === Contact Form Validation === */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const rules = {
    name:    { el: form.querySelector('#name'),    min: 2, msg: 'Please enter your full name (at least 2 characters).' },
    email:   { el: form.querySelector('#email'),   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Please enter a valid email address.' },
    phone:   { el: form.querySelector('#phone'),   pattern: /^[\d\s\+\-\(\)]{7,}$/, msg: 'Please enter a valid phone number.', optional: true },
    subject: { el: form.querySelector('#subject'), min: 3, msg: 'Please enter a subject.' },
    message: { el: form.querySelector('#message'), min: 20, msg: 'Message must be at least 20 characters.' },
  };

  function validate(key) {
    const rule = rules[key];
    if (!rule || !rule.el) return true;
    const val = rule.el.value.trim();
    let valid = true;
    if (rule.optional && !val) { clearError(rule.el); return true; }
    if (rule.pattern) valid = rule.pattern.test(val);
    else if (rule.min) valid = val.length >= rule.min;
    showError(rule.el, valid ? '' : rule.msg);
    return valid;
  }

  Object.keys(rules).forEach(key => {
    if (rules[key].el) {
      rules[key].el.addEventListener('blur', () => validate(key));
      rules[key].el.addEventListener('input', () => {
        if (rules[key].el.classList.contains('is-invalid')) validate(key);
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = Object.keys(rules).map(validate).every(Boolean);
    if (allValid) {
      showSuccess();
    }
  });

  function showError(el, msg) {
    const err = el.closest('.mb-3')?.querySelector('.error-msg');
    if (!msg) { el.classList.remove('is-invalid'); el.classList.add('is-valid'); if (err) err.classList.remove('show'); return; }
    el.classList.add('is-invalid'); el.classList.remove('is-valid');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }
  function clearError(el) {
    el.classList.remove('is-invalid', 'is-valid');
    const err = el.closest('.mb-3')?.querySelector('.error-msg');
    if (err) err.classList.remove('show');
  }
  function showSuccess() {
    const successDiv = document.getElementById('formSuccess');
    if (successDiv) { successDiv.style.display = 'block'; form.reset(); form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid')); setTimeout(() => successDiv.style.display = 'none', 5000); }
  }
}
initContactForm();

/* === Booking Form Validation === */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(el => {
      if (!el.value.trim()) {
        el.classList.add('is-invalid');
        valid = false;
      } else {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
      }
    });
    if (valid) {
      const successDiv = document.getElementById('bookingSuccess');
      if (successDiv) {
        successDiv.style.display = 'block';
        form.reset();
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        setTimeout(() => successDiv.style.display = 'none', 6000);
      }
    }
  });
  // Clear invalid on input
  form.querySelectorAll('[required]').forEach(el => {
    el.addEventListener('input', () => { if (el.value.trim()) { el.classList.remove('is-invalid'); el.classList.add('is-valid'); } });
  });
}
initBookingForm();

/* === Live Search (Destinations Page) === */
function initLiveSearch() {
  const searchInput = document.getElementById('destinationSearch');
  const cards = document.querySelectorAll('[data-name]');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      card.style.display = name.includes(q) ? '' : 'none';
    });
  });
}
initLiveSearch();

/* === Smooth reveal on scroll (IntersectionObserver) === */
function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  targets.forEach(t => io.observe(t));
}
initReveal();

/* === FAQ Search (faq.html) === */
function initFaqSearch() {
  const faqSearch = document.getElementById('faqSearch');
  const items = document.querySelectorAll('.accordion-item');
  if (!faqSearch) return;
  faqSearch.addEventListener('input', () => {
    const q = faqSearch.value.toLowerCase();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });
}
initFaqSearch();

/* === Newsletter Form === */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailEl = form.querySelector('input[type="email"]');
    if (!emailEl || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl?.classList.add('is-invalid');
      return;
    }
    emailEl.classList.remove('is-invalid');
    const msg = document.getElementById('newsletterMsg');
    if (msg) { msg.style.display = 'block'; form.reset(); setTimeout(() => msg.style.display = 'none', 4000); }
  });
}
initNewsletter();

/* === Gallery Lightbox (gallery.html) === */
function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImg');
  if (!items.length || !modal) return;
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        new bootstrap.Modal(modal).show();
      }
    });
  });
}
initGallery();

/* CSS keyframe injection */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .reveal.revealed { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
