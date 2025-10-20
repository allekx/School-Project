// Menu mobile
/*const navToggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}*/

// Ano do rodapé
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll suave para âncoras internas
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof Element && target.matches('a[href^="#"]')) {
    const href = target.getAttribute('href');
    if (!href) return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }
});

// Animações de entrada simples
const animated = Array.from(document.querySelectorAll('section, .team-card, .project-card, .feature-card'));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('anim-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
animated.forEach((el) => {
  el.setAttribute('data-anim', '');
  io.observe(el);
});

// Validação simples de formulário
const form = document.getElementById('contactForm');
const feedback = document.querySelector('.form-feedback');
function setError(id, message) {
  const span = document.querySelector(`.error[data-for="${id}"]`);
  if (span) span.textContent = message || '';
}
function clearErrors() {
  document.querySelectorAll('.error').forEach((el) => el.textContent = '');
}
function isEmail(v) {
  return /.+@.+\..+/.test(v);
}
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    const nome = /** @type {HTMLInputElement} */(document.getElementById('nome')).value.trim();
    const email = /** @type {HTMLInputElement} */(document.getElementById('email')).value.trim();
    const serie = /** @type {HTMLSelectElement} */(document.getElementById('serie')).value;
    const mensagem = /** @type {HTMLTextAreaElement} */(document.getElementById('mensagem')).value.trim();
    let ok = true;
    if (!nome) { setError('nome', 'Informe seu nome.'); ok = false; }
    if (!email || !isEmail(email)) { setError('email', 'E-mail inválido.'); ok = false; }
    if (!serie) { setError('serie', 'Selecione a série.'); ok = false; }
    if (!mensagem) { setError('mensagem', 'Escreva sua mensagem.'); ok = false; }
    if (!ok) return;
    if (feedback) {
      feedback.textContent = 'Mensagem enviada! Retornaremos em breve.';
    }
    form.reset();
  });
}

// Cursor custom e foco em elementos interativos
(() => {
  const dot = document.querySelector('.cursor-dot');
  const outline = document.querySelector('.cursor-outline');
  if (!dot || !outline) return;
  let visible = false;
  function setPos(e) {
    const x = e.clientX;
    const y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    outline.style.transform = `translate(${x}px, ${y}px)`;
  }
  function show() { if (!visible) { dot.style.opacity = '1'; outline.style.opacity = '1'; visible = true; } }
  function hide() { dot.style.opacity = '0'; outline.style.opacity = '0'; visible = false; }
  window.addEventListener('mousemove', (e) => { setPos(e); show(); });
  window.addEventListener('mouseout', hide);
  // ampliar sobre elementos clicáveis
  const interactive = 'a, button, .btn, .team-card, .project-card, .feature-card, input, select, textarea';
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest(interactive)) {
      document.body.classList.add('cursor--active');
    } else {
      document.body.classList.remove('cursor--active');
    }
  });

  // realce sutil que segue o mouse nos cards da equipe
  document.querySelectorAll('.team-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
})();

// Carregamento opcional de fotos de perfil nas avatars via data-photo
(() => {
  const avatars = document.querySelectorAll('.avatar');
  avatars.forEach((avatar) => {
    const photo = avatar.getAttribute('data-photo');
    const alt = avatar.getAttribute('data-alt') || 'Foto de perfil';
    if (!photo) return; // mantém iniciais
    const img = new Image();
    img.loading = 'lazy';
    img.alt = alt;
    img.decoding = 'async';
    img.src = photo;
    img.addEventListener('load', () => {
      avatar.classList.add('has-photo');
      avatar.appendChild(img);
    }, { once: true });
    img.addEventListener('error', () => {
      // se falhar, mantém as iniciais
    }, { once: true });
  });
})();


