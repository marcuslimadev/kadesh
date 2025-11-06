// Kadesh Frontend - Lógica do Painel Administrativo

/**
 * Realiza o login do administrador.
 * @param {string} email - Email do administrador.
 * @param {string} password - Senha do administrador.
 */
function loginAdmin(email, password) {
    return $.ajax({
        url: `${API_URL}/admin/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        dataType: 'json'
    });
}

/**
 * Busca as estatísticas do painel administrativo.
 */
function getAdminStats() {
    return $.ajax({
        url: `${API_URL}/admin/stats`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Busca a lista de todos os usuários.
 */
function getAdminUsers() {
    return $.ajax({
        url: `${API_URL}/admin/users`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Busca a lista de todos os projetos.
 */
function getAdminProjects() {
    return $.ajax({
        url: `${API_URL}/admin/projects`,
        method: 'GET',
        dataType: 'json'
    });
}
