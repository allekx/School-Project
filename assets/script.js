const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const carousel = document.querySelector("[data-carousel]");
const track = document.querySelector("[data-carousel-track]");
const slides = Array.from(track.children);
const prevButton = document.querySelector("[data-carousel-prev]");
const nextButton = document.querySelector("[data-carousel-next]");
const indicators = Array.from(
  document.querySelectorAll("[data-carousel-indicator]")
);
const animatedElements = document.querySelectorAll("[data-animate]");
const growthSection = document.querySelector(".indicadores");
const growthNumbers = document.querySelectorAll(".indicador-card__numero");
const form = document.querySelector(".contato__form");
const feedback = document.querySelector(".form-feedback");
const yearSpan = document.querySelector("#current-year");

let currentSlide = 0;
let autoplayInterval;
let startX = 0;
let isDragging = false;
let growthHasAnimated = false;

const updateNavState = () => {
  menuToggle?.setAttribute(
    "aria-expanded",
    nav?.classList.contains("is-open").toString()
  );
};

menuToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
  updateNavState();
});

const setSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;
  const amountToMove = slides[currentSlide].offsetLeft;
  track.style.transform = `translateX(-${amountToMove}px)`;

  indicators.forEach((indicator) =>
    indicator.classList.remove("is-active")
  );
  indicators[currentSlide]?.classList.add("is-active");
};

const nextSlide = () => setSlide(currentSlide + 1);
const prevSlide = () => setSlide(currentSlide - 1);

nextButton?.addEventListener("click", () => {
  nextSlide();
  restartAutoplay();
});

prevButton?.addEventListener("click", () => {
  prevSlide();
  restartAutoplay();
});

indicators.forEach((indicator) => {
  indicator.addEventListener("click", () => {
    const index = Number(indicator.dataset.carouselIndicator);
    setSlide(index);
    restartAutoplay();
  });
});

const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 5000);
};

const stopAutoplay = () => clearInterval(autoplayInterval);

const restartAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
}

carousel?.addEventListener("mouseover", stopAutoplay);
carousel?.addEventListener("mouseout", startAutoplay);

carousel?.addEventListener("touchstart", (event) => {
  stopAutoplay();
  startX = event.touches[0].clientX;
  isDragging = true;
});

carousel?.addEventListener("touchmove", (event) => {
  if (!isDragging) return;
  const currentX = event.touches[0].clientX;
  const diff = startX - currentX;
  if (diff > 50) {
    nextSlide();
    isDragging = false;
  } else if (diff < -50) {
    prevSlide();
    isDragging = false;
  }
});

carousel?.addEventListener("touchend", () => {
  isDragging = false;
  startAutoplay();
});

const validateForm = () => {
  if (!form) return false;
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (validateForm()) {
    feedback.textContent = "Mensagem enviada com sucesso!";
    feedback.style.color = "var(--green)";
    form.reset();
  } else {
    feedback.textContent = "Por favor, preencha os campos corretamente.";
    feedback.style.color = "var(--blue)";
  }
});

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

setSlide(0);
startAutoplay();

const animateNumber = (element) => {
  const target = Number(element.dataset.target) || 0;
  const duration = 1500;
  const startTime = performance.now();
  const prefix = element.dataset.prefix ?? "";
  const suffix = element.dataset.suffix ?? "";

  // easeOutQuad
  const easeOut = (t) => 1 - (1 - t) * (1 - t);

  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const progress = easeOut(rawProgress);
    const value = Math.round(progress * target);
    // format with thousands separator for readability
    const formatted = value.toLocaleString('pt-BR');
    element.textContent = `${prefix}${formatted}${suffix}`;
    if (rawProgress < 1) {
      requestAnimationFrame(update);
    } else {
      // final state: ensure exact target
      element.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
      element.classList.add('count-done');
    }
  };

  requestAnimationFrame(update);
};

// Number animation trigger
if ("IntersectionObserver" in window && growthNumbers.length) {
  // On small screens, animate each card individually as it scrolls into view.
  const isMobileView = window.matchMedia('(max-width: 767px)').matches;

  if (isMobileView) {
    const cardObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // find the number inside the card and animate it
            const numberEl = entry.target.querySelector('.indicador-card__numero') || entry.target;
            if (numberEl && !numberEl.classList.contains('count-done')) {
              animateNumber(numberEl);
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    const cards = document.querySelectorAll('.indicador-card');
    cards.forEach((card) => cardObserver.observe(card));
  } else if (growthSection) {
    // Desktop / tablet: keep the original behavior (animate all when the section appears)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !growthHasAnimated) {
            growthNumbers.forEach((number) => animateNumber(number));
            growthHasAnimated = true;
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(growthSection);
  }
} else {
  // Fallback for older browsers: animate all immediately
  growthNumbers.forEach((number) => animateNumber(number));
}

  // Make .segment-card clickable using its data-link attribute (opens in new tab)
  document.addEventListener('click', (e) => {
    const card = e.target.closest && e.target.closest('.segment-card');
    if (!card) return;
    const url = card.dataset.link;
    if (!url || url === 'LINK_CADASTRO_AQUI') return;
    // open in a new tab safely
    window.open(url, '_blank', 'noopener');
  });

