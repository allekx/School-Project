/* ================================================================
   SCRIPT.JS - LANDING PAGE PRÉ-MATRÍCULA INSTITUIÇÃO CELUS
   Código limpo, modular e bem comentado
   ================================================================ */

// ========== CONFIGURAÇÕES GLOBAIS ==========

/**
 * URL do formulário de pré-matrícula do ActiveSoft
 * Altere este link conforme necessário
 */
const activeSoftURL = "https://siga.activesoft.com.br/ficha_inscricao_novatos/?instituicao=ESCOLACELUS";

/**
 * Objeto com referências aos elementos principais do DOM
 * Evita múltiplas buscas repetidas
 */
const DOM = {
    // Navbar (fallback to header if .navbar is not present)
    navbar: document.querySelector('.navbar') || document.querySelector('header'),
    navMenu: document.getElementById('navMenu'),
    menuToggle: document.getElementById('menuToggle'),
    navLinks: document.querySelectorAll('.nav-link'),
    navMatriculaBtn: document.getElementById('navMatriculaBtn'),

    // Hero
    heroMatriculaBtn: document.getElementById('heroMatriculaBtn'),
    heroDiferenciaisBtn: document.getElementById('heroDiferenciaisBtn'),

    // Outros
    estruturaBtn: document.getElementById('estruturaBtn'),
    ctaMatriculaBtn: document.getElementById('ctaMatriculaBtn'),

    // Modal
    matriculaModal: document.getElementById('matriculaModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalContinueBtn: document.getElementById('modalContinueBtn'),

    // FAQ
    accordionHeaders: document.querySelectorAll('.accordion-header'),

    // Back to top
    backToTopBtn: document.getElementById('backToTopBtn'),

    // Números (contadores)
    numeroValues: document.querySelectorAll('.numero-value'),

    // Timeline
    timelineItems: document.querySelectorAll('.timeline-item'),

    // Cards
    cards: document.querySelectorAll('.card-diferencial'),

    // Galeria
    galeriaItems: document.querySelectorAll('.galeria-item'),
};

// ========== GERENCIAMENTO DE MODAL ==========

/**
 * Abre o modal de pré-matrícula
 */
function openMatriculaModal() {
    DOM.matriculaModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de pré-matrícula
 */
function closeMatriculaModal() {
    DOM.matriculaModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/**
 * Redireciona para o formulário do ActiveSoft
 */
function redirectToActivesoft() {
    closeMatriculaModal();
    window.open(activeSoftURL, '_blank');
}

/**
 * Fecha modal ao clicar fora dele
 */
DOM.matriculaModal.addEventListener('click', (e) => {
    if (e.target === DOM.matriculaModal) {
        closeMatriculaModal();
    }
});

/**
 * Fecha modal ao pressionar ESC
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && DOM.matriculaModal.getAttribute('aria-hidden') === 'false') {
        closeMatriculaModal();
    }
});

// Event Listeners do Modal
DOM.modalCloseBtn.addEventListener('click', closeMatriculaModal);
DOM.modalCancelBtn.addEventListener('click', closeMatriculaModal);
DOM.modalContinueBtn.addEventListener('click', redirectToActivesoft);

// ========== BOTÕES DE MATRÍCULA ==========

/**
 * Adiciona event listeners a todos os botões de matrícula
 */
const matriculaButtons = [
    DOM.navMatriculaBtn,
    DOM.heroMatriculaBtn,
    DOM.ctaMatriculaBtn,
];

matriculaButtons.forEach((btn) => {
    if (btn) {
        btn.addEventListener('click', openMatriculaModal);
    }
});

// Botões que redirecionam
if (DOM.heroDiferenciaisBtn) {
    DOM.heroDiferenciaisBtn.addEventListener('click', () => {
        const diferenciaisSection = document.getElementById('diferenciais');
        if (diferenciaisSection) {
            diferenciaisSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

if (DOM.estruturaBtn) {
    DOM.estruturaBtn.addEventListener('click', () => {
        const galeriaSection = document.getElementById('galeria');
        if (galeriaSection) {
            galeriaSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ========== NAVBAR COM SCROLL ==========

/**
 * Atualiza o estilo da navbar ao fazer scroll
 */
function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (!DOM.navbar) return;
    if (scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
    } else {
        DOM.navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// ========== MENU MOBILE ==========

/**
 * Toggle do menu mobile (só adiciona listeners se os elementos existirem)
 */
if (DOM.menuToggle) {
    DOM.menuToggle.addEventListener('click', () => {
        DOM.menuToggle.classList.toggle('active');
        if (DOM.navMenu) DOM.navMenu.classList.toggle('active');
        const isActive = DOM.menuToggle.classList.contains('active');
        DOM.menuToggle.setAttribute('aria-expanded', isActive);
    });

    // Fecha o menu ao clicar em um link (navLinks é sempre NodeList)
    DOM.navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            DOM.menuToggle.classList.remove('active');
            if (DOM.navMenu) DOM.navMenu.classList.remove('active');
            DOM.menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========== ACCORDION (FAQ) ==========

/**
 * Gerencia o accordion do FAQ
 */
function initAccordion() {
    DOM.accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const contentId = header.getAttribute('aria-controls');
            const content = document.getElementById(contentId);

            if (!isExpanded) {
                // Fecha todos os outros itens
                DOM.accordionHeaders.forEach((h) => {
                    if (h !== header) {
                        h.setAttribute('aria-expanded', 'false');
                        const id = h.getAttribute('aria-controls');
                        const el = document.getElementById(id);
                        if (el) {
                            el.hidden = true;
                        }
                    }
                });

                // Abre o item atual
                header.setAttribute('aria-expanded', 'true');
                if (content) {
                    content.hidden = false;
                }
            } else {
                // Fecha o item atual
                header.setAttribute('aria-expanded', 'false');
                if (content) {
                    content.hidden = true;
                }
            }
        });
    });
}

initAccordion();

// ========== INTERSECTION OBSERVER (ANIMAÇÕES DE SCROLL) ==========

/**
 * Configuração do Intersection Observer
 * Anima elementos quando entram na viewport
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            // Opcional: desanima após entrar (para evitar animação novamente ao scroll)
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observa cards de diferenciais
DOM.cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Observa itens da timeline
DOM.timelineItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.15}s`;
    observer.observe(item);
});

// Observa itens da galeria
DOM.galeriaItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Observa números para iniciar contadores
DOM.numeroValues.forEach((number) => {
    observer.observe(number);
});

// ========== CONTADORES ANIMADOS ==========

/**
 * Anima um contador de número
 * @param {HTMLElement} element - Elemento que conterá o número
 * @param {number} target - Número alvo
 * @param {number} duration - Duração da animação em ms
 * @param {string} suffix - Sufixo do número (ex: +, %)
 */
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

/**
 * Inicia os contadores quando a seção fica visível
 */
function initCounters() {
    let countersStarted = false;

    const numeroSection = document.getElementById('numeros');
    if (!numeroSection) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                DOM.numeroValues.forEach((el) => {
                    const target = parseInt(el.getAttribute('data-target'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    animateCounter(el, target, 2000, suffix);
                });
                counterObserver.unobserve(numeroSection);
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(numeroSection);
}

initCounters();

// ========== BACK TO TOP BUTTON ==========

/**
 * Mostra/esconde o botão back to top conforme o scroll
 */
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        DOM.backToTopBtn.removeAttribute('hidden');
    } else {
        DOM.backToTopBtn.setAttribute('hidden', '');
    }
}, { passive: true });

/**
 * Volta ao topo ao clicar no botão
 */
DOM.backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});

// ========== LAZY LOADING DE IMAGENS ==========

/**
 * Implementa lazy loading nativo para imagens
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

initLazyLoading();

// ========== SMOOTH SCROLL NATIVO ==========

/**
 * Garante scroll smooth em navegadores que não suportam nativamente
 * (Já definido no HTML com scroll-behavior: smooth no CSS)
 */

// ========== ACESSIBILIDADE ==========

/**
 * Garante navegação por teclado para elementos interativos
 */
function ensureKeyboardNavigation() {
    // Todos os botões e links já são nativamente acessíveis
    // Esta função é um placeholder para validações futuras
}

ensureKeyboardNavigation();

// ========== PERFORMANCE E OTIMIZAÇÕES ==========

/**
 * Desabilita animações se o usuário prefere movimento reduzido
 */
function respectReducedMotionPreference() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.documentElement.style.setProperty('--transition-base', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
        document.documentElement.style.setProperty('--transition-fast', '0ms');
    }
}

respectReducedMotionPreference();

// ========== INICIALIZAÇÃO ==========

/**
 * Função de inicialização geral
 */
function init() {
    console.log('Landing Page Instituição Celus inicializada com sucesso!');
}

// Executa a inicialização após o DOM estar carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ========== SERVICE WORKER (OPCIONAL) ==========

/**
 * Registra um service worker para melhor performance e offline support
 * Descomente se desejar implementar caching avançado
 */
/*
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.warn('Service Worker registration failed:', error);
    });
}
*/

// ========== ANALYTICS (OPCIONAL) ==========

/**
 * Rastreia eventos importantes (descomente se usar Google Analytics ou similar)
 */
/*
function trackEvent(eventName, eventData = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Rastreia cliques em botões de matrícula
matriculaButtons.forEach((btn) => {
    if (btn) {
        btn.addEventListener('click', () => {
            trackEvent('matricula_click');
        });
    }
});
*/

// ========== VALIDAÇÕES E LOGS ==========

/**
 * Log para validar se a página está funcionando corretamente
 */
console.log('%cCelus Landing Page', 'font-size: 20px; font-weight: bold; color: #2E7D32;');
console.log('✓ HTML carregado');
console.log('✓ CSS aplicado');
console.log('✓ JavaScript ativo');
console.log('URL do ActiveSoft configurada:', activeSoftURL !== 'https://LINK_DO_ACTIVESOFT' ? '✓ Configurada' : '⚠️ Não configurada - altere no script.js');

// ========== FIM DO SCRIPT ==========
