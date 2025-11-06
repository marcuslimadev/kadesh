/**
 * Projetos com Bulma CSS
 */

// Carregar página de projetos
function loadProjectsPage() {
    const html = `
        <section class="section">
            <div class="container">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <h1 class="title is-3">
                                <i class="fas fa-folder-open has-text-primary"></i>
                                Projetos
                            </h1>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            ${AppState.currentUser ? `
                                <a href="#new-project" class="button is-primary">
                                    <span class="icon"><i class="fas fa-plus"></i></span>
                                    <span>Novo Projeto</span>
                                </a>
                            ` : `
                                <a href="#login" class="button is-primary">
                                    <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                                    <span>Entrar para Criar Projeto</span>
                                </a>
                            `}
                        </div>
                    </div>
                </div>

                <div class="box">
                    <div class="tabs is-boxed">
                        <ul>
                            <li class="is-active" data-filter="all">
                                <a>
                                    <span class="icon"><i class="fas fa-list"></i></span>
                                    <span>Todos</span>
                                </a>
                            </li>
                            <li data-filter="open">
                                <a>
                                    <span class="icon"><i class="fas fa-door-open"></i></span>
                                    <span>Abertos</span>
                                </a>
                            </li>
                            <li data-filter="in_progress">
                                <a>
                                    <span class="icon"><i class="fas fa-spinner"></i></span>
                                    <span>Em Andamento</span>
                                </a>
                            </li>
                            <li data-filter="completed">
                                <a>
                                    <span class="icon"><i class="fas fa-check-circle"></i></span>
                                    <span>Concluídos</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="field has-addons">
                        <div class="control is-expanded">
                            <input class="input" type="text" id="searchProjects" placeholder="Buscar projetos...">
                        </div>
                        <div class="control">
                            <button class="button is-primary">
                                <span class="icon"><i class="fas fa-search"></i></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div id="projectsList" class="columns is-multiline">
                    <div class="column is-12 has-text-centered">
                        <button class="button is-loading is-large is-ghost"></button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Configurar event listeners
    setupProjectsListeners();
    
    // Carregar projetos
    loadAllProjects();
}

// Configurar listeners da página de projetos
function setupProjectsListeners() {
    // Filtros por tabs
    $('.tabs li').on('click', function() {
        $(this).addClass('is-active').siblings().removeClass('is-active');
        const filter = $(this).data('filter');
        filterProjects(filter);
    });
    
    // Busca
    $('#searchProjects').on('input', function() {
        const query = $(this).val().toLowerCase();
        searchProjects(query);
    });
}

// Carregar todos os projetos
function loadAllProjects(filter = 'all') {
    $.ajax({
        url: `${API_URL}/projects`,
        method: 'GET'
    }).done(function(projects) {
        if (projects.length === 0) {
            $('#projectsList').html(`
                <div class="column is-12">
                    <div class="notification is-info is-light">
                        <p class="has-text-centered">
                            <span class="icon is-large"><i class="fas fa-2x fa-inbox"></i></span>
                        </p>
                        <p class="has-text-centered">Nenhum projeto encontrado</p>
                    </div>
                </div>
            `);
            return;
        }
        
        displayProjects(projects);
    }).fail(function() {
        $('#projectsList').html(`
            <div class="column is-12">
                <div class="notification is-danger">
                    <p class="has-text-centered">Erro ao carregar projetos</p>
                </div>
            </div>
        `);
    });
}

// Exibir projetos
function displayProjects(projects) {
    let html = '';
    
    projects.forEach(project => {
        html += createProjectCard(project);
    });
    
    $('#projectsList').html(html);
}

// Filtrar projetos
function filterProjects(filter) {
    if (filter === 'all') {
        $('.project-card-col').show();
    } else {
        $('.project-card-col').hide();
        $(`.project-card-col[data-status="${filter}"]`).show();
    }
}

// Buscar projetos
function searchProjects(query) {
    $('.project-card-col').each(function() {
        const title = $(this).find('.title').text().toLowerCase();
        const description = $(this).find('.subtitle').text().toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

// Criar card de projeto (override para adicionar data-status)
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
        <div class="column is-4 project-card-col" data-status="${project.status}">
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

// Carregar "Meus Projetos"
function loadMyProjectsPage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <h1 class="title is-3">
                                <i class="fas fa-briefcase has-text-primary"></i>
                                Meus Projetos
                            </h1>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <a href="#new-project" class="button is-primary">
                                <span class="icon"><i class="fas fa-plus"></i></span>
                                <span>Novo Projeto</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="tabs is-boxed">
                    <ul>
                        <li class="is-active" data-tab="my-projects">
                            <a>
                                <span class="icon"><i class="fas fa-folder"></i></span>
                                <span>Como Cliente</span>
                            </a>
                        </li>
                        <li data-tab="my-bids">
                            <a>
                                <span class="icon"><i class="fas fa-gavel"></i></span>
                                <span>Minhas Propostas</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div id="my-projects" class="tab-content">
                    <div class="columns is-multiline" id="myProjectsList">
                        <div class="column is-12 has-text-centered">
                            <button class="button is-loading is-large is-ghost"></button>
                        </div>
                    </div>
                </div>

                <div id="my-bids" class="tab-content" style="display:none;">
                    <div class="columns is-multiline" id="myBidsList">
                        <div class="column is-12 has-text-centered">
                            <button class="button is-loading is-large is-ghost"></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Carregar projetos do usuário
    loadUserProjects();
    loadUserBids();
}

// Carregar projetos do usuário
function loadUserProjects() {
    $.ajax({
        url: `${API_URL}/projects/my`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(projects) {
        if (projects.length === 0) {
            $('#myProjectsList').html(`
                <div class="column is-12">
                    <div class="notification is-info is-light">
                        <p class="has-text-centered">Você ainda não criou nenhum projeto</p>
                    </div>
                </div>
            `);
        } else {
            let html = '';
            projects.forEach(project => {
                html += createProjectCard(project);
            });
            $('#myProjectsList').html(html);
        }
    }).fail(function() {
        $('#myProjectsList').html(`
            <div class="column is-12">
                <div class="notification is-danger">Erro ao carregar projetos</div>
            </div>
        `);
    });
}

// Carregar propostas do usuário
function loadUserBids() {
    $.ajax({
        url: `${API_URL}/bids/my`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(bids) {
        if (bids.length === 0) {
            $('#myBidsList').html(`
                <div class="column is-12">
                    <div class="notification is-info is-light">
                        <p class="has-text-centered">Você ainda não fez nenhuma proposta</p>
                    </div>
                </div>
            `);
        } else {
            let html = '';
            bids.forEach(bid => {
                html += createBidCard(bid);
            });
            $('#myBidsList').html(html);
        }
    });
}

// Criar card de proposta
function createBidCard(bid) {
    const statusClass = {
        'pending': 'badge-pending',
        'accepted': 'badge-success',
        'rejected': 'badge-danger'
    }[bid.status] || 'badge-pending';
    
    return `
        <div class="column is-4">
            <div class="card">
                <div class="card-content">
                    <span class="project-badge ${statusClass}">${bid.status}</span>
                    <p class="title is-5">${bid.project_title}</p>
                    <p class="subtitle is-6">Proposta: R$ ${parseFloat(bid.amount).toFixed(2)}</p>
                    <p class="content">${bid.description}</p>
                </div>
                <footer class="card-footer">
                    <a href="#project-${bid.project_id}" class="card-footer-item">
                        Ver Projeto
                    </a>
                </footer>
            </div>
        </div>
    `;
}
