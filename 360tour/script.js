// Tour 360° - Funcionalidade JavaScript com Visualizador Panorâmico
class Panorama360 {
    constructor() {
        this.locations = [
            { id: 'area',  name: 'area',  image: 'imgs/img360-1.svg', description: 'Área de recepção principal' },
            { id: 'area2', name: 'area2', image: 'imgs/img360-2.svg', description: 'Espaço principal de convivência' },
            { id: 'area3', name: 'area3', image: 'imgs/img360-3.svg', description: 'Espaço para reuniões e apresentações' },
            { id: 'area4', name: 'area4', image: 'imgs/img360-4.svg', description: 'Sala de aula / Atividades' },
            { id: 'area5', name: 'area5', image: 'imgs/img360-5.svg', description: 'Quadra / Ginásio' },
            { id: 'area6', name: 'area6', image: 'imgs/img360-6.svg', description: 'Biblioteca / Leitura' },
            { id: 'area7', name: 'area7', image: 'imgs/img360-7.svg', description: 'Refeitório / Alimentação' },
            { id: 'area8', name: 'area8', image: 'imgs/img360-8.svg', description: 'Maternal / Espaço infantil' },
        ];
        
        this.currentIndex = 0;
        this.isLoading = false;
        
        // Estado do viewer Pannellum
        this.viewer = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateUI();
        this.setupPanorama();
    }
    
    initializeElements() {
        this.mainImage = document.getElementById('main-image');
        this.panoramaContainer = document.getElementById('panorama-container');
        this.pano = document.getElementById('pano');
        this.currentLocationSpan = document.getElementById('current-location');
        this.currentLocationInfo = document.getElementById('current-location-info');
        this.progressFill = document.getElementById('progress-fill');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.locationItems = document.querySelectorAll('.location-item');
        
        // Panorama controls
        this.zoomInBtn = document.getElementById('zoom-in');
        this.zoomOutBtn = document.getElementById('zoom-out');
        this.resetViewBtn = document.getElementById('reset-view');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
    }
    
    setupPanorama() {
    const current = this.locations[this.currentIndex];
    // Inicializa o Pannellum
    this.viewer = pannellum.viewer(this.pano, {
        type: 'equirectangular',
        panorama: current.image,
        autoLoad: true,
        crossOrigin: 'anonymous',
        showZoomCtrl: false,
        compass: false,
        keyboardZoom: true,
        hfov: 110, // campo de visão inicial
        minHfov: 50,
        maxHfov: 120,
        pitch: 0,
        yaw: 0,
        minPitch: 20,   // 🔒 Limite inferior (não olha pra baixo)
        maxPitch: 0,   // 🔒 Limite superior (não olha pra cima)

         // 🔒 Limites horizontais (não girar além do desejado)
        minYaw: -175, 
        maxYaw: 170,  
    });

    // Eventos de carregamento/erro para feedback
    this.viewer.on('load', () => {
        this.hideLoading();
    });
    this.viewer.on('error', (e) => {
        console.error('Erro Pannellum:', e);
        this.hideLoading();
    });

    this.addPanoramaEvents();
}
    
    addPanoramaEvents() {
        // Controles customizados conectados ao Pannellum
        this.panoramaContainer.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    // Zoom e reset usando a API do Pannellum
    handleWheel(e) { /* mantido para compatibilidade mas não usado */ }
    updatePanoramaBackground() { /* não usado com Pannellum */ }
    
    bindEvents() {
        // Botões de navegação
        this.prevBtn.addEventListener('click', () => this.previousLocation());
        this.nextBtn.addEventListener('click', () => this.nextLocation());
        
        // Clique nos itens da sidebar
        this.locationItems.forEach((item, index) => {
            item.addEventListener('click', () => this.goToLocation(index));
        });
        
        // Controles do panorama
        this.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.resetViewBtn.addEventListener('click', () => this.resetView());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousLocation();
            if (e.key === 'ArrowRight') this.nextLocation();
            if (e.key === 'r' || e.key === 'R') this.resetView();
            if (e.key === '+') this.zoomIn();
            if (e.key === '-') this.zoomOut();
        });
        
        // Preload das imagens
        this.preloadImages();
    }
    
    zoomIn() {
        if (this.viewer) {
            this.viewer.setHfov(Math.max(50, this.viewer.getHfov() - 5));
        }
    }
    
    zoomOut() {
        if (this.viewer) {
            this.viewer.setHfov(Math.min(120, this.viewer.getHfov() + 5));
        }
    }
    
    resetView() {
        if (this.viewer) {
            this.viewer.setYaw(0);
            this.viewer.setPitch(0);
            this.viewer.setHfov(100);
        }
    }
    
    toggleFullscreen() {
        const viewer = document.querySelector('.panorama-viewer');
        if (!document.fullscreenElement) {
            viewer.requestFullscreen().catch(err => {
                console.log('Erro ao entrar em tela cheia:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    preloadImages() {
        this.locations.forEach(location => {
            const img = new Image();
            img.src = location.image;
        });
    }
    
    showLoading() {
        this.isLoading = true;
        this.loadingOverlay.classList.add('show');
    }
    
    hideLoading() {
        this.isLoading = false;
        this.loadingOverlay.classList.remove('show');
    }
    
    async changeImage(newIndex) {
        if (this.isLoading || newIndex === this.currentIndex) return;
        
        this.showLoading();
        // Desabilita navegação durante a troca
        this.prevBtn.disabled = true;
        this.nextBtn.disabled = true;
        // Pequeno delay visual
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const newLocation = this.locations[newIndex];
        
        const onLoaded = () => {
            this.currentIndex = newIndex;
            this.resetView();
            this.updateUI();
            this.hideLoading();
            // Reabilita navegação
            this.prevBtn.disabled = this.currentIndex === 0;
            this.nextBtn.disabled = this.currentIndex === this.locations.length - 1;
        };

        const recreateViewer = () => {
            try { if (this.viewer && this.viewer.destroy) this.viewer.destroy(); } catch (_) {}
            this.viewer = pannellum.viewer(this.pano, {
                type: 'equirectangular',
                panorama: newLocation.image,
                autoLoad: true,
                crossOrigin: 'anonymous',
                showZoomCtrl: false,
                compass: false,
                keyboardZoom: true,
                hfov: 50,
                minHfov: 50,
                maxHfov: 120,
                pitch: 0,
                yaw: 0,
                minPitch: 20,   // 🔒 Limite inferior (não olha pra baixo)
                maxPitch: 0,   // 🔒 Limite superior (não olha pra cima)

         // 🔒 Limites horizontais (não girar além do desejado)
                minYaw: -175, 
                maxYaw: 170, 
            });
            this.viewer.on('load', onLoaded);
            this.viewer.on('error', () => onLoaded());
        };

        try {
            if (this.viewer && this.viewer.setPanorama) {
                this.viewer.setPanorama(
                    newLocation.image,
                    { type: 'equirectangular', autoLoad: true, crossOrigin: 'anonymous' },
                    onLoaded
                );
                setTimeout(() => { if (this.isLoading) recreateViewer(); }, 2000);
            } else {
                recreateViewer();
            }
        } catch (err) {
            console.error('Falha ao trocar panorama, recriando viewer...', err);
            recreateViewer();
        }
    }
    
    nextLocation() {
        if (this.currentIndex < this.locations.length - 1) {
            this.changeImage(this.currentIndex + 1);
        }
    }
    
    previousLocation() {
        if (this.currentIndex > 0) {
            this.changeImage(this.currentIndex - 1);
        }
    }
    
    goToLocation(index) {
        if (index >= 0 && index < this.locations.length) {
            this.changeImage(index);
        }
    }
    
    updateUI() {
        const currentLocation = this.locations[this.currentIndex];
        
        // Atualiza informações do local atual
        this.currentLocationSpan.textContent = currentLocation.name;
        this.currentLocationInfo.textContent = `${this.currentIndex + 1} de ${this.locations.length}`;
        
        // Atualiza progresso
        const progressPercentage = ((this.currentIndex + 1) / this.locations.length) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;
        
        // Atualiza botões de navegação
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.locations.length - 1;
        
        // Atualiza itens da sidebar
        this.locationItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    // Método para adicionar indicadores de navegação
    addNavigationIndicators() {
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.className = 'navigation-indicators';
        indicatorsContainer.innerHTML = this.locations.map((_, index) => 
            `<span class="indicator ${index === this.currentIndex ? 'active' : ''}" 
                   data-index="${index}"></span>`
        ).join('');
        
        document.querySelector('.viewer-container').appendChild(indicatorsContainer);
        
        // Adiciona eventos aos indicadores
        indicatorsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                const index = parseInt(e.target.dataset.index);
                this.goToLocation(index);
            }
        });
    }
}

// Inicializa o tour quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const tour = new Panorama360();
    
    // Adiciona indicadores de navegação
    tour.addNavigationIndicators();
    
    // Adiciona estilos para os indicadores
    const style = document.createElement('style');
    style.textContent = `
        .navigation-indicators {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }
        
        .indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #a9dfbf;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .indicator.active {
            background: #27ae60;
            transform: scale(1.2);
        }
        
        .indicator:hover {
            background: #73c6b6;
        }
    `;
    document.head.appendChild(style);
    
    // Adiciona informações de debug no console
    console.log('Tour 360° Panorâmico inicializado com sucesso!');
    console.log('Locais disponíveis:', tour.locations.length);
    console.log('Controles: Arraste para navegar, Scroll para zoom, R para reset');
    console.log('Teclas: ← → para navegar, +/- para zoom, R para reset');

    // --- Mobile sidebar toggle / drawer behavior ---
    try {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const tourSidebar = document.querySelector('.tour-sidebar');
        const sidebarBackdrop = document.getElementById('sidebar-backdrop');

        const openSidebar = () => {
            if (tourSidebar) tourSidebar.classList.add('open');
            if (sidebarBackdrop) sidebarBackdrop.classList.add('show');
            if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'true');
            // prevent body scroll when sidebar open
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            if (tourSidebar) tourSidebar.classList.remove('open');
            if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
            if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        };

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
                if (expanded) closeSidebar(); else openSidebar();
            });
        }

        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener('click', () => closeSidebar());
        }

        // Close sidebar when a location is selected (the Panorama360 class already handles navigation)
        if (tour && tour.locationItems && tour.locationItems.forEach) {
            tour.locationItems.forEach(item => {
                item.addEventListener('click', () => {
                    // slight delay so the navigation feels immediate
                    setTimeout(() => closeSidebar(), 120);
                });
            });
        }

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSidebar();
        });
    } catch (err) {
        console.warn('Erro ao inicializar o sidebar móvel:', err);
    }
});