/**
 * Main JavaScript com Bulma CSS
 * Sistema completo de marketplace com leilões reversos
 */

// Capturar erros globais
window.addEventListener('error', function(e) {
    console.error('❌ Erro Global:', e.message, e.filename, e.lineno);
});

// Estado global da aplicação
const AppState = {
    currentUser: null,
    currentPage: 'home',
    notifications: [],
    walletBalance: 0,
    liveAuctions: []
};

// ==================== INICIALIZAÇÃO ====================

$(document).ready(function() {
    console.log('🚀 Kadesh Frontend iniciando...');
    console.log('jQuery:', typeof jQuery);
    console.log('API_URL:', typeof API_URL !== 'undefined' ? API_URL : 'NÃO DEFINIDA');
    
    try {
        // Remover page loader IMEDIATAMENTE para debug
        console.log('Removendo page loader...');
        $('#pageLoader').removeClass('is-active');
        
        // Inicializar componentes Bulma
        console.log('Inicializando componentes Bulma...');
        initBulmaComponents();
        
        // Verificar autenticação (não bloquear se falhar)
        console.log('Verificando autenticação...');
        checkAuth();
        
        // Carregar página inicial APÓS um pequeno delay
        setTimeout(() => {
            console.log('Carregando página home...');
            loadPage('home');
        }, 100);
        
        // Configurar roteamento
        console.log('Configurando roteamento...');
        setupRouting();
        
        // Configurar event listeners globais
        console.log('Configurando event listeners...');
        setupGlobalListeners();
        
        // Atualizar notificações periodicamente
        if (AppState.currentUser) {
            setInterval(updateNotifications, 30000); // 30 segundos
        }
        
        console.log('✅ Kadesh Frontend iniciado com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao iniciar frontend:', error);
        // Mesmo com erro, remover o loader
        $('#pageLoader').removeClass('is-active');
        $('#app').html(`
            <section class="section">
                <div class="container">
                    <div class="notification is-danger">
                        <p class="title">Erro ao carregar aplicação</p>
                        <p>${error.message}</p>
                    </div>
                </div>
            </section>
        `);
    }
});

// ==================== COMPONENTES BULMA ====================

function initBulmaComponents() {
    // Navbar burger menu
    $('.navbar-burger').click(function() {
        $(this).toggleClass('is-active');
        $('.navbar-menu').toggleClass('is-active');
    });
    
    // Modal close buttons
    $(document).on('click', '.modal-background, .modal-close, .modal-card-head .delete', function() {
        $(this).closest('.modal').removeClass('is-active');
    });
    
    // Notification delete buttons
    $(document).on('click', '.notification .delete', function() {
        $(this).parent().addClass('animate__animated animate__fadeOut');
        setTimeout(() => {
            $(this).parent().remove();
        }, 500);
    });
    
    // Tabs
    $(document).on('click', '.tabs li', function() {
        const target = $(this).data('tab');
        $(this).addClass('is-active').siblings().removeClass('is-active');
        $('.tab-content').hide();
        $(`#${target}`).show();
    });
}

// ==================== AUTENTICAÇÃO ====================

function checkAuth() {
    console.log('checkAuth: Iniciando verificação...');
    $.ajax({
        url: `${API_URL}/user`,
        method: 'GET',
        xhrFields: { withCredentials: true },
        timeout: 5000 // 5 segundos de timeout
    }).done(function(response) {
        console.log('checkAuth: Resposta recebida', response);
        if (response.user) {
            AppState.currentUser = response.user;
            updateUIForLoggedUser();
            loadWalletBalance();
            updateNotifications();
        } else {
            updateUIForGuest();
        }
    }).fail(function(xhr, status, error) {
        console.log('checkAuth: Falhou', status, error);
        updateUIForGuest();
    });
}

function updateUIForLoggedUser() {
    $('#navGuest').hide();
    $('#navUser').show();
    $('#navDashboard').show();
    $('#navNotifications').show();
    $('#navWallet').show();
    $('#userName').text(AppState.currentUser.name);
}

function updateUIForGuest() {
    $('#navGuest').show();
    $('#navUser').hide();
    $('#navDashboard').hide();
    $('#navNotifications').hide();
    $('#navWallet').hide();
}

// ==================== ROTEAMENTO ====================

function setupRouting() {
    // Capturar cliques em links com #
    $(document).on('click', 'a[href^="#"]', function(e) {
        e.preventDefault();
        const page = $(this).attr('href').substring(1);
        loadPage(page);
        window.location.hash = page;
        
        // Fechar menu mobile
        $('.navbar-burger').removeClass('is-active');
        $('.navbar-menu').removeClass('is-active');
    });
    
    // Tratar navegação do navegador
    $(window).on('hashchange', function() {
        const page = window.location.hash.substring(1) || 'home';
        loadPage(page);
    });
}

// ==================== CARREGAMENTO DE PÁGINAS ====================

function loadPage(page) {
    AppState.currentPage = page;
    
    // Mostrar loader
    showPageLoader();
    
    // Rolar para o topo
    $('html, body').animate({ scrollTop: 0 }, 300);
    
    // Carregar conteúdo baseado na página
    setTimeout(() => {
        switch(page) {
            case 'home':
                loadHomePage();
                break;
            case 'login':
                loadLoginPage();
                break;
            case 'register':
                loadRegisterPage();
                break;
            case 'projects':
                loadProjectsPage();
                break;
            case 'auctions':
                loadAuctionsPage();
                break;
            case 'dashboard':
                loadDashboardPage();
                break;
            case 'wallet':
                loadWalletPage();
                break;
            case 'reputation':
                loadReputationPage();
                break;
            case 'profile':
                loadProfilePage();
                break;
            case 'my-projects':
                loadMyProjectsPage();
                break;
            default:
                load404Page();
        }
        hidePageLoader();
    }, 300);
}

// ==================== PÁGINA HOME ====================

function loadHomePage() {
    const html = `
        <section class="hero hero-pattern is-medium">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title is-1 has-text-white animate__animated animate__fadeInDown">
                        <i class="fas fa-gavel"></i> Bem-vindo ao Kadesh
                    </h1>
                    <p class="subtitle is-3 has-text-white animate__animated animate__fadeInUp">
                        Marketplace de Leilões Reversos
                    </p>
                    <p class="is-size-5 has-text-white mb-5 animate__animated animate__fadeIn">
                        Conecte-se com os melhores profissionais através de leilões transparentes
                    </p>
                    <div class="buttons is-centered animate__animated animate__fadeInUp animate__delay-1s">
                        <a href="#register" class="button is-large is-white is-rounded">
                            <span class="icon"><i class="fas fa-rocket"></i></span>
                            <span>Começar Agora</span>
                        </a>
                        <a href="#auctions" class="button is-large is-ghost has-text-white is-rounded">
                            <span class="icon"><i class="fas fa-search"></i></span>
                            <span>Ver Leilões</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="columns is-multiline">
                    <div class="column is-4">
                        <div class="stat-card animate__animated animate__fadeInLeft">
                            <div class="stat-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <p class="title is-3" id="statsUsers">1,234</p>
                            <p class="subtitle is-6 has-text-grey">Usuários Ativos</p>
                        </div>
                    </div>
                    
                    <div class="column is-4">
                        <div class="stat-card animate__animated animate__fadeInUp">
                            <div class="stat-icon">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <p class="title is-3" id="statsProjects">567</p>
                            <p class="subtitle is-6 has-text-grey">Projetos Concluídos</p>
                        </div>
                    </div>
                    
                    <div class="column is-4">
                        <div class="stat-card animate__animated animate__fadeInRight">
                            <div class="stat-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <p class="title is-3" id="statsVolume">R$ 2.5M</p>
                            <p class="subtitle is-6 has-text-grey">Volume Transacionado</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2 class="title is-2 has-text-centered mb-6">Como Funciona</h2>
                
                <div class="columns is-vcentered">
                    <div class="column is-3 has-text-centered">
                        <div class="box">
                            <span class="icon is-large has-text-primary">
                                <i class="fas fa-3x fa-file-alt"></i>
                            </span>
                            <h3 class="title is-5 mt-3">1. Crie seu Projeto</h3>
                            <p>Descreva o que precisa e defina o orçamento</p>
                        </div>
                    </div>
                    
                    <div class="column is-3 has-text-centered">
                        <div class="box">
                            <span class="icon is-large has-text-info">
                                <i class="fas fa-3x fa-gavel"></i>
                            </span>
                            <h3 class="title is-5 mt-3">2. Receba Propostas</h3>
                            <p>Profissionais fazem lances competitivos</p>
                        </div>
                    </div>
                    
                    <div class="column is-3 has-text-centered">
                        <div class="box">
                            <span class="icon is-large has-text-success">
                                <i class="fas fa-3x fa-handshake"></i>
                            </span>
                            <h3 class="title is-5 mt-3">3. Escolha o Melhor</h3>
                            <p>Selecione baseado em preço e reputação</p>
                        </div>
                    </div>
                    
                    <div class="column is-3 has-text-centered">
                        <div class="box">
                            <span class="icon is-large has-text-warning">
                                <i class="fas fa-3x fa-trophy"></i>
                            </span>
                            <h3 class="title is-5 mt-3">4. Pagamento Seguro</h3>
                            <p>Sistema de escrow protege ambas as partes</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section has-background-light">
            <div class="container">
                <h2 class="title is-2 has-text-centered mb-6">Leilões em Destaque</h2>
                <div id="featuredAuctions" class="columns is-multiline">
                    <div class="column is-12 has-text-centered">
                        <button class="button is-loading is-large is-ghost"></button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Carregar estatísticas reais
    loadHomeStats();
    
    // Carregar leilões em destaque
    loadFeaturedAuctions();
}

function loadHomeStats() {
    // TODO: Implementar chamada real à API
    setTimeout(() => {
        $('#statsUsers').text('1,234');
        $('#statsProjects').text('567');
        $('#statsVolume').text('R$ 2.5M');
    }, 500);
}

function loadFeaturedAuctions() {
    console.log('loadFeaturedAuctions: Carregando projetos...');
    $.ajax({
        url: `${API_URL}/projects`,
        method: 'GET',
        timeout: 5000
    }).done(function(projects) {
        console.log('loadFeaturedAuctions: Projetos recebidos', projects.length);
        if (projects.length === 0) {
            $('#featuredAuctions').html(`
                <div class="column is-12 has-text-centered">
                    <p class="subtitle">Nenhum leilão ativo no momento</p>
                </div>
            `);
            return;
        }
        
        let html = '';
        projects.slice(0, 6).forEach(project => {
            html += createProjectCard(project);
        });
        
        $('#featuredAuctions').html(html);
    }).fail(function(xhr, status, error) {
        console.error('loadFeaturedAuctions: Erro', status, error);
        $('#featuredAuctions').html(`
            <div class="column is-12 has-text-centered">
                <p class="has-text-danger">Erro ao carregar leilões</p>
            </div>
        `);
    });
}

// ==================== CRIAR CARD DE PROJETO ====================

function createProjectCard(project) {
    const statusClass = {
        'open': 'badge-open',
        'in_progress': 'badge-in-progress',
        'completed': 'badge-completed'
    }[project.status] || 'badge-open';
    
    const statusText = {
        'open': 'Aberto',
        'in_progress': 'Em Andamento',
        'completed': 'Concluído'
    }[project.status] || 'Aberto';
    
    return `
        <div class="column is-4">
            <div class="card animate__animated animate__fadeIn">
                <div class="card-content">
                    <div class="level is-mobile mb-3">
                        <div class="level-left">
                            <span class="project-badge ${statusClass}">${statusText}</span>
                        </div>
                        <div class="level-right">
                            <span class="icon has-text-warning">
                                <i class="fas fa-clock"></i>
                            </span>
                        </div>
                    </div>
                    
                    <p class="title is-5">${project.title}</p>
                    <p class="subtitle is-6 has-text-grey">${project.description ? project.description.substring(0, 100) + '...' : ''}</p>
                    
                    <div class="level is-mobile">
                        <div class="level-left">
                            <div class="level-item">
                                <div>
                                    <p class="heading">Orçamento Máximo</p>
                                    <p class="title is-6 has-text-success">R$ ${parseFloat(project.max_budget).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <div>
                                    <p class="heading">Propostas</p>
                                    <p class="title is-6 has-text-info">${project.bids_count || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer class="card-footer">
                    <a href="#project-${project.id}" class="card-footer-item has-text-primary">
                        <span class="icon"><i class="fas fa-eye"></i></span>
                        <span>Ver Detalhes</span>
                    </a>
                    <a href="#bid-${project.id}" class="card-footer-item has-text-success">
                        <span class="icon"><i class="fas fa-gavel"></i></span>
                        <span>Fazer Proposta</span>
                    </a>
                </footer>
            </div>
        </div>
    `;
}

// ==================== NOTIFICAÇÕES E CARTEIRA ====================

function updateNotifications() {
    if (!AppState.currentUser) return;
    
    $.ajax({
        url: `${API_URL}/notifications`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(notifications) {
        AppState.notifications = notifications;
        const unreadCount = notifications.filter(n => !n.is_read).length;
        $('#notificationCount').text(unreadCount);
        
        if (unreadCount > 0) {
            $('#notificationCount').show();
        } else {
            $('#notificationCount').hide();
        }
    });
}

function loadWalletBalance() {
    if (!AppState.currentUser) return;
    
    $.ajax({
        url: `${API_URL}/wallet/balance`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        AppState.walletBalance = response.balance || 0;
        $('#walletBalance').text(`R$ ${AppState.walletBalance.toFixed(2)}`);
    });
}

// ==================== HELPERS ====================

function showPageLoader() {
    $('#pageLoader').addClass('is-active');
}

function hidePageLoader() {
    $('#pageLoader').removeClass('is-active');
}

function showNotification(message, type = 'info') {
    const colors = {
        'success': 'is-success',
        'error': 'is-danger',
        'warning': 'is-warning',
        'info': 'is-info'
    };
    
    const notification = $(`
        <div class="notification ${colors[type]} animate__animated animate__fadeInRight" style="position: fixed; top: 80px; right: 20px; z-index: 1000; min-width: 300px;">
            <button class="delete"></button>
            ${message}
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.addClass('animate__fadeOutRight');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// ==================== LISTENERS GLOBAIS ====================

function setupGlobalListeners() {
    // Logout
    $(document).on('click', '#btnLogout', function(e) {
        e.preventDefault();
        logout();
    });
}

function logout() {
    $.ajax({
        url: `${API_URL}/logout`,
        method: 'POST',
        xhrFields: { withCredentials: true }
    }).always(function() {
        AppState.currentUser = null;
        updateUIForGuest();
        loadPage('home');
        showNotification('Logout realizado com sucesso!', 'success');
    });
}

// ==================== PÁGINAS ADICIONAIS (STUBS) ====================

// As páginas de autenticação são implementadas em `auth-bulma.js`.
// Removemos os stubs daqui para que as implementações reais (carregadas antes)
// sejam utilizadas. As chamadas a `loadLoginPage()` e `loadRegisterPage()` na
// função `loadPage()` continuarão funcionando com as versões definidas em
// `auth-bulma.js`.


// ==================== PÁGINAS IMPLEMENTADAS EM MÓDULOS ====================
// As seguintes páginas estão implementadas nos módulos -bulma.js:
// - loadProjectsPage() → projects-bulma.js
// - loadAuctionsPage() → auctions-bulma.js  
// - loadDashboardPage() → auctions-bulma.js
// - loadWalletPage() → wallet-bulma.js
// - loadReputationPage() → reputation-bulma.js
// - loadProfilePage() → reputation-bulma.js
// - loadMyProjectsPage() → projects-bulma.js
//
// Esses módulos são carregados no index.html e definem as funções globalmente.

function load404Page() {
    $('#app').html(`
        <section class="hero is-fullheight">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title is-1">404</h1>
                    <p class="subtitle">Página não encontrada</p>
                    <a href="#home" class="button is-primary">Voltar ao Início</a>
                </div>
            </div>
        </section>
    `);
}
