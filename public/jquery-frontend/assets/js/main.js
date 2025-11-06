// Kadesh Frontend - Lógica Principal e Roteamento

$(document).ready(function() {
    // Configuração inicial
    handleRouting();
    updateNav();

    // Escutar mudanças de hash para roteamento
    $(window).on('hashchange', handleRouting);

    // ================== MANIPULADORES DE EVENTOS ==================

    // Registro de Usuário
    $(document).on('submit', '#register-form', handleRegistration);

    // Login de Usuário
    $(document).on('submit', '#login-form', handleLogin);

    // Login de Administrador
    $(document).on('submit', '#admin-login-form', handleAdminLogin);

    // Logout de Usuário
    $(document).on('click', '#logout-link', handleLogout);

    // Formulário de Criar Projeto
    $(document).on('submit', '#create-project-form', handleCreateProject);

    // Formulário de Proposta
    $(document).on('submit', '#bid-form', handleCreateBid);

    // Formulário de Criar Marco
    $(document).on('submit', '#create-milestone-form', handleCreateMilestone);

    // Botão de Financiar Marco
    $(document).on('click', '.fund-milestone-btn', handleFundMilestone);

    // Botão de Liberar Marco
    $(document).on('click', '.release-milestone-btn', handleReleaseMilestone);
});

// ================== ROTEAMENTO ==================

function handleRouting() {
    const hash = window.location.hash.replace('#', '');
    const page = hash.split('/')[0] || 'home';
    const param = hash.split('/')[1];

    if (page.startsWith('admin')) {
        loadAdminContent(page, param);
    } else {
        loadPublicContent(page, param);
    }
}

function loadPublicContent(page, param) {
    $('#content').load(`${page}.html`, function(response, status) {
        if (status === "error") {
            $('#content').html('<h2>Página Não Encontrada</h2>');
            return;
        }
        // Carregar dados específicos da página
        switch (page) {
            case 'home':
                loadProjects();
                break;
            case 'project-details':
                if (param) loadProjectDetails(param);
                break;
            case 'dashboard':
                loadDashboard();
                break;
        }
    });
}

function loadAdminContent(page, param) {
    // Verificar se o admin está logado, caso contrário redirecionar para login
    if (!sessionStorage.getItem('kadesh_admin') && page !== 'admin-login') {
        window.location.hash = 'admin-login';
        return;
    }

    // Carregar o layout principal do admin se ainda não foi carregado
    if ($('#admin-sidebar').length === 0) {
        $('#content').load('admin.html', function() {
            loadAdminSection(page, param);
        });
    } else {
        loadAdminSection(page, param);
    }
}

function loadAdminSection(page, param) {
    const section = page.split('/')[1] || 'dashboard';
    $('#admin-main-content').load(`admin-${section}.html`, function() {
        // Carregar dados específicos da seção
        switch (section) {
            case 'dashboard':
                loadAdminDashboard();
                break;
            case 'users':
                loadAdminUsers();
                break;
            case 'projects':
                loadAdminProjects();
                break;
        }
    });
}


// ================== FUNÇÕES DE MANIPULAÇÃO DE EVENTOS ==================

function handleRegistration(e) {
    e.preventDefault();
    const name = $('#register-name').val();
    const email = $('#register-email').val();
    const password = $('#register-password').val();
    const type = $('#register-user-type').val();

    registerUser(name, email, password, type)
        .done(response => {
            saveUserSession(response.user);
            updateNav();
            window.location.hash = 'dashboard';
        })
        .fail(err => alert('Falha no registro: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleLogin(e) {
    e.preventDefault();
    const email = $('#login-email').val();
    const password = $('#login-password').val();

    loginUser(email, password)
        .done(response => {
            saveUserSession(response.user);
            updateNav();
            window.location.hash = 'dashboard';
        })
        .fail(err => alert('Falha no login: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleAdminLogin(e) {
    e.preventDefault();
    const email = $('#admin-login-email').val();
    const password = $('#admin-login-password').val();

    loginAdmin(email, password)
        .done(response => {
            sessionStorage.setItem('kadesh_admin', JSON.stringify(response.admin));
            window.location.hash = 'admin/dashboard';
        })
        .fail(err => alert('Falha no login do administrador: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}


function handleLogout(e) {
    e.preventDefault();
    logoutUser().done(() => {
        clearUserSession();
        updateNav();
        window.location.hash = 'home';
    });
}

function handleCreateProject(e) {
    e.preventDefault();
    const projectData = {
        title: $('#project-title').val(),
        description: $('#project-description').val(),
        max_budget: $('#project-budget').val(),
        project_deadline: $('#project-deadline').val()
    };
    createProject(projectData)
        .done(project => {
            alert('Projeto criado com sucesso!');
            window.location.hash = `project-details/${project.id}`;
        })
        .fail(err => alert('Falha ao criar projeto: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleCreateBid(e) {
    e.preventDefault();
    const projectId = window.location.hash.split('/')[1];
    createBid({
        project_id: projectId,
        amount: $('#bid-amount').val(),
        proposal: $('#bid-proposal').val()
    })
    .done(() => {
        alert('Proposta enviada com sucesso!');
        loadProjectDetails(projectId);
    })
    .fail(err => alert('Falha ao enviar proposta: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleCreateMilestone(e) {
    e.preventDefault();
    const projectId = window.location.hash.split('/')[1];
    createMilestone(projectId, {
        description: $('#milestone-description').val(),
        amount: $('#milestone-amount').val()
    })
    .done(() => {
        alert('Marco criado com sucesso!');
        loadProjectDetails(projectId);
    })
    .fail(err => alert('Falha ao criar marco: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleFundMilestone() {
    const milestoneId = $(this).data('id');
    fundMilestone(milestoneId)
        .done(response => {
            if (response.checkout_url) {
                window.location.href = response.checkout_url;
            }
        })
        .fail(err => alert('Falha ao financiar marco: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}

function handleReleaseMilestone() {
    const milestoneId = $(this).data('id');
    const projectId = window.location.hash.split('/')[1];
    releaseMilestone(milestoneId)
        .done(() => {
            alert('Marco liberado com sucesso!');
            loadProjectDetails(projectId);
        })
        .fail(err => alert('Falha ao liberar marco: ' + (err.responseJSON?.message || 'Erro desconhecido')));
}


// ================== FUNÇÕES DE CARREGAMENTO DE DADOS ==================

function loadProjects() {
    getProjects().done(projects => {
        const list = $('#project-list').empty();
        if (!projects || projects.length === 0) {
            list.html('<p>Nenhum projeto encontrado.</p>');
            return;
        }
        projects.forEach(p => {
            list.append(`
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${p.title}</h5>
                            <p class="card-text">${p.description.substring(0, 100)}...</p>
                            <p class="card-text"><strong>Orçamento:</strong> R$ ${p.max_budget}</p>
                            <a href="#project-details/${p.id}" class="btn btn-primary">Ver Detalhes</a>
                        </div>
                    </div>
                </div>
            `);
        });
    });
}

function loadProjectDetails(projectId) {
    const user = getUserSession();

    getProjectDetails(projectId).done(project => {
        $('#project-title').text(project.title);
        $('#project-description').text(project.description);
        $('#project-budget').text(`R$ ${project.max_budget}`);

        if (user && user.id === project.contractor_id) {
            $('#create-milestone-area').html(`
                <hr><h3>Criar Marco</h3>
                <form id="create-milestone-form">
                    <input type="text" id="milestone-description" placeholder="Descrição" required>
                    <input type="number" id="milestone-amount" placeholder="Valor" required>
                    <button type="submit">Criar</button>
                </form>
            `);
        }
    });

    getMilestones(projectId).done(milestones => {
        const list = $('#milestone-list').empty();
        milestones.forEach(m => {
            let actions = '';
            if (user && m.status === 'pending') {
                actions = `<button class="fund-milestone-btn btn btn-sm btn-success" data-id="${m.id}">Financiar</button>`;
            } else if (user && m.status === 'funded') {
                actions = `<button class="release-milestone-btn btn btn-sm btn-primary" data-id="${m.id}">Liberar</button>`;
            }
            list.append(`<div class="mb-2">${m.description} - R$ ${m.amount} (${m.status}) ${actions}</div>`);
        });
    });

    getProjectBids(projectId).done(bids => {
        const list = $('#bid-list').empty();
        bids.forEach(b => list.append(`<div class="mb-2">${b.proposal} - R$ ${b.amount} por ${b.user_name}</div>`));
    });
}

function loadDashboard() {
    const user = getUserSession();
    if (!user) {
        window.location.hash = 'login';
        return;
    }
    $('#dashboard-content').html(`
        <h3>Bem-vindo, ${user.name}!</h3>
        <a href="#create-project" class="btn btn-primary">Novo Projeto</a>
    `);
}

function loadAdminDashboard() {
    getAdminStats().done(stats => {
        $('#stats-total-users').text(stats.users.total);
        $('#stats-total-projects').text(stats.projects.total);
        $('#stats-total-revenue').text(`R$ ${stats.payments.total_amount.toFixed(2)}`);
    });
}

function loadAdminUsers() {
    getAdminUsers().done(users => {
        const list = $('#admin-user-list').empty();
        users.forEach(u => list.append(`
            <tr>
                <td>${u.id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.user_type}</td>
                <td><button class="btn btn-sm btn-info">Ver</button></td>
            </tr>
        `));
    });
}

function loadAdminProjects() {
    getAdminProjects().done(projects => {
        const list = $('#admin-project-list').empty();
        projects.forEach(p => list.append(`
            <tr>
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.contractor_name}</td>
                <td>${p.status}</td>
                <td><button class="btn btn-sm btn-info">Ver</button></td>
            </tr>
        `));
    });
}

// ================== AUXILIARES ==================

function updateNav() {
    const user = getUserSession();
    const nav = $('#navbarNav .navbar-nav.ms-auto').empty();
    if (user) {
        nav.append(`
            <li class="nav-item"><a class="nav-link" href="#dashboard">Painel</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logout-link">Sair</a></li>
        `);
    } else {
        nav.append(`
            <li class="nav-item"><a class="nav-link" href="#login">Entrar</a></li>
            <li class="nav-item"><a class="nav-link" href="#register">Cadastrar</a></li>
        `);
    }
}

function saveUserSession(userData) {
    sessionStorage.setItem('kadesh_user', JSON.stringify(userData));
}

function getUserSession() {
    return JSON.parse(sessionStorage.getItem('kadesh_user'));
}

function clearUserSession() {
    sessionStorage.removeItem('kadesh_user');
    sessionStorage.removeItem('kadesh_admin');
}
