function toggleDropdown(event) {
  const dropdownMenu = event.currentTarget.nextElementSibling;
  dropdownMenu.classList.toggle('active'); // Alterna a exibição do dropdown
}

function checkScreenSize() {
  const dropdownToggles = document.querySelectorAll('.toggle-dropdown');

  dropdownToggles.forEach(toggle => {
    if (window.innerWidth >= 768) { // Ajuste para seu breakpoint de desktop
      toggle.removeEventListener('click', toggleDropdown); // Remove o evento de clique
    } else {
      toggle.addEventListener('click', toggleDropdown); // Adiciona o evento de clique
    }
  });
}

// Inicializa ao carregar a página
checkScreenSize();

// Atualiza ao redimensionar a janela
window.addEventListener('resize', checkScreenSize);

//



// Simula o carregamento de conteúdo
window.addEventListener('load', function() {
  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  // Remove o loading após 2 segundos
  setTimeout(function() {
      loading.style.display = 'none';
      content.style.display = 'block';
  }, 990); // Altere o tempo conforme necessário
});

//função para o menu
function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('active'); // Adiciona ou remove a classe "active"
}

function toggleDropdown(event) {
  const dropdown = event.currentTarget.nextElementSibling;
  dropdown.classList.toggle('active'); // Alterna a exibição do dropdown
}



//slide
const slider = document.querySelectorAll('.slider');
const btnPrev = document.getElementById('prev-button');
const btnNext = document.getElementById('next-button');

let currentSlide = 0; 

function hideSlider() {
  slider.forEach(item => item.classList.remove('on'));
}

function showSlider() {
  slider[currentSlide].classList.add('on');
}

function nextSlider() {
  hideSlider();
  if(currentSlide === slider.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  showSlider();
}

function prevSlider() {
  hideSlider();
  if(currentSlide === 0) {
    currentSlide = slider.length - 1;
  } else {
    currentSlide--;
  }
  showSlider();
}

btnNext.addEventListener('click', nextSlider);
btnPrev.addEventListener('click', prevSlider);

// Inicia a exibição do primeiro slide
showSlider();

// Função para avançar os slides automaticamente a cada 3 segundos
setInterval(nextSlider, 3500); // Mude  para o intervalo desejado em milissegundos



//esportes

const slidesEsportes = document.querySelectorAll('.esporteSlide');
const btnPrevEsporte = document.getElementById('prev-button-esporte');
const btnNextEsporte = document.getElementById('next-button-esporte');

let currentSlideEsporte = 0;

function hideEsportes() {
    slidesEsportes.forEach(item => item.style.opacity = '0');
}

function showEsportes() {
    slidesEsportes[currentSlideEsporte].style.opacity = '1';
}

function nextEsportes() {
    hideEsportes();
    currentSlideEsporte = (currentSlideEsporte + 1) % slidesEsportes.length;
    showEsportes();
}

function prevEsportes() {
    hideEsportes();
    currentSlideEsporte = (currentSlideEsporte - 1 + slidesEsportes.length) % slidesEsportes.length;
    showEsportes();
}

btnNextEsporte.addEventListener('click', nextEsportes);
btnPrevEsporte.addEventListener('click', prevEsportes);

// Inicializa a exibição do primeiro slide de esportes
showEsportes();

// Função para avançar os slides automaticamente a cada 3 segundos
setInterval(nextEsportes, 3000); // Altere para o intervalo desejado em milissegundos


function toggleDropdown(event) {
  event.preventDefault(); // Cancela a ação padrão do link
  const dropdownMenu = event.target.nextElementSibling;

  // Alterna a visibilidade do menu
  if (dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none'; // Oculta se já estiver visível
  } else {
    dropdownMenu.style.display = 'block'; // Mostra se estiver oculto
  }
}

// Fecha o dropdown se clicar fora dele
document.addEventListener('click', function(event) {
  const target = event.target;
  const dropdown = document.querySelector('.dropdown-menu');

  // Verifica se o clique foi fora do dropdown
  if (!target.closest('.dropdown')) {
    dropdown.style.display = 'none'; // Oculta o dropdown
  }
});

