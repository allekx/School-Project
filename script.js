// Mostra o menu 
function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('active');

}


// Adiciona um evento de clique no documento
document.addEventListener('click', (event) => {
  const menu = document.querySelector('.menu');
  const menuButton = document.querySelector('.menu-hamburguer');

  // Verifica se o menu está ativo e se o clique não foi no menu ou no botão
  if (menu.classList.contains('active') && !menu.contains(event.target) && !menuButton.contains(event.target)) {
    menu.classList.remove('active'); // Fecha o menu
  }
});

const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(event) {
      event.preventDefault(); // Previne a ação padrão do link
      const dropdownMenu = this.nextElementSibling; // Seleciona o próximo elemento que é o dropdown-menu
      
      // Alterna a exibição do menu dropdown
      dropdownMenu.style.display = dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '' ? 'block' : 'none';
    });
  });

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
setInterval(nextSlider, 4000); // Mude  para o intervalo desejado em milissegundos



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
setInterval(nextEsportes, 4000); // Altere para o intervalo desejado em milissegundos


