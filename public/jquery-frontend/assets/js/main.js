// Kadesh Frontend - Main Logic & Routing

$(document).ready(function() {
    // Initial setup
    handleRouting();
    updateNav();

    // Listen to hash changes for routing
    $(window).on('hashchange', handleRouting);

    // ================== EVENT HANDLERS ==================

    // User Registration
    $(document).on('submit', '#register-form', handleRegistration);

    // User Login
    $(document).on('submit', '#login-form', handleLogin);

    // Admin Login
    $(document).on('submit', '#admin-login-form', handleAdminLogin);

    // User Logout
    $(document).on('click', '#logout-link', handleLogout);

    // Create Project Form
    $(document).on('submit', '#create-project-form', handleCreateProject);

    // Bid Form
    $(document).on('submit', '#bid-form', handleCreateBid);

    // Create Milestone Form
    $(document).on('submit', '#create-milestone-form', handleCreateMilestone);

    // Fund Milestone Button
    $(document).on('click', '.fund-milestone-btn', handleFundMilestone);

    // Release Milestone Button
    $(document).on('click', '.release-milestone-btn', handleReleaseMilestone);
});

// ================== ROUTING ==================

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
            $('#content').html('<h2>Page Not Found</h2>');
            return;
        }
        // Load page-specific data
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
    // Check if admin is logged in, otherwise redirect to admin login
    if (!sessionStorage.getItem('kadesh_admin') && page !== 'admin-login') {
        window.location.hash = 'admin-login';
        return;
    }

    // Load the main admin layout if not already loaded
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
        // Load section-specific data
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


// ================== EVENT HANDLER FUNCTIONS ==================

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
        .fail(err => alert('Registration failed: ' + err.responseJSON.message));
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
        .fail(err => alert('Login failed: ' + err.responseJSON.message));
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
        .fail(err => alert('Admin login failed: ' + err.responseJSON.message));
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
            alert('Project created!');
            window.location.hash = `project-details/${project.id}`;
        })
        .fail(err => alert('Failed to create project: ' + err.responseJSON.message));
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
        alert('Bid placed!');
        loadProjectDetails(projectId);
    })
    .fail(err => alert('Failed to place bid: ' + err.responseJSON.message));
}

function handleCreateMilestone(e) {
    e.preventDefault();
    const projectId = window.location.hash.split('/')[1];
    createMilestone(projectId, {
        description: $('#milestone-description').val(),
        amount: $('#milestone-amount').val()
    })
    .done(() => {
        alert('Milestone created!');
        loadProjectDetails(projectId);
    })
    .fail(err => alert('Failed to create milestone: ' + err.responseJSON.message));
}

function handleFundMilestone() {
    const milestoneId = $(this).data('id');
    fundMilestone(milestoneId)
        .done(response => {
            if (response.checkout_url) {
                window.location.href = response.checkout_url;
            }
        })
        .fail(err => alert('Failed to fund milestone: ' + err.responseJSON.message));
}

function handleReleaseMilestone() {
    const milestoneId = $(this).data('id');
    const projectId = window.location.hash.split('/')[1];
    releaseMilestone(milestoneId)
        .done(() => {
            alert('Milestone released!');
            loadProjectDetails(projectId);
        })
        .fail(err => alert('Failed to release milestone: ' + err.responseJSON.message));
}


// ================== DATA LOADING FUNCTIONS ==================

function loadProjects() {
    getProjects().done(projects => {
        const list = $('#project-list').empty();
        if (!projects || projects.length === 0) {
            list.html('<p>No projects found.</p>');
            return;
        }
        projects.forEach(p => {
            list.append(`
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${p.title}</h5>
                            <p class="card-text">${p.description.substring(0, 100)}...</p>
                            <p class="card-text"><strong>Budget:</strong> R$ ${p.max_budget}</p>
                            <a href="#project-details/${p.id}" class="btn btn-primary">View</a>
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
                <hr><h3>Create Milestone</h3>
                <form id="create-milestone-form">
                    <input type="text" id="milestone-description" placeholder="Description" required>
                    <input type="number" id="milestone-amount" placeholder="Amount" required>
                    <button type="submit">Create</button>
                </form>
            `);
        }
    });

    getMilestones(projectId).done(milestones => {
        const list = $('#milestone-list').empty();
        milestones.forEach(m => {
            let actions = '';
            if (user && m.status === 'pending') {
                actions = `<button class="fund-milestone-btn" data-id="${m.id}">Fund</button>`;
            } else if (user && m.status === 'funded') {
                actions = `<button class="release-milestone-btn" data-id="${m.id}">Release</button>`;
            }
            list.append(`<div>${m.description} - R$ ${m.amount} (${m.status}) ${actions}</div>`);
        });
    });

    getProjectBids(projectId).done(bids => {
        const list = $('#bid-list').empty();
        bids.forEach(b => list.append(`<div>${b.proposal} - R$ ${b.amount} by ${b.user_name}</div>`));
    });
}

function loadDashboard() {
    const user = getUserSession();
    if (!user) {
        window.location.hash = 'login';
        return;
    }
    $('#dashboard-content').html(`
        <h3>Welcome, ${user.name}!</h3>
        <a href="#create-project" class="btn btn-primary">New Project</a>
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
                <td><button>View</button></td>
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
                <td><button>View</button></td>
            </tr>
        `));
    });
}

// ================== HELPERS ==================

function updateNav() {
    const user = getUserSession();
    const nav = $('#navbarNav .navbar-nav.ms-auto').empty();
    if (user) {
        nav.append(`
            <li class="nav-item"><a class="nav-link" href="#dashboard">Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logout-link">Logout</a></li>
        `);
    } else {
        nav.append(`
            <li class="nav-item"><a class="nav-link" href="#login">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="#register">Register</a></li>
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
