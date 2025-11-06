// Kadesh Frontend - Lógica de Autenticação

/**
 * Realiza o registro de um novo usuário.
 * @param {string} name - Nome do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 * @param {string} type - Tipo do usuário ('contractor', 'provider', 'both').
 */
function registerUser(name, email, password, type) {
    return $.ajax({
        url: `${API_URL}/register`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ name, email, password, type }),
        dataType: 'json'
    });
}

/**
 * Realiza o login do usuário.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha do usuário.
 */
function loginUser(email, password) {
    return $.ajax({
        url: `${API_URL}/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        dataType: 'json'
    });
}

/**
 * Realiza o logout do usuário.
 */
function logoutUser() {
    return $.ajax({
        url: `${API_URL}/logout`,
        method: 'POST',
    });
}

/**
 * Verifica se um usuário está logado.
 * Armazena os dados do usuário no sessionStorage.
 */
function checkUserStatus() {
    return $.ajax({
        url: `${API_URL}/user`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Salva os dados do usuário no sessionStorage.
 * @param {object} userData - Objeto com os dados do usuário da API.
 */
function saveUserSession(userData) {
    sessionStorage.setItem('kadesh_user', JSON.stringify(userData));
}

/**
 * Recupera os dados do usuário do sessionStorage.
 * @returns {object|null} Objeto com os dados do usuário ou null se não estiver logado.
 */
function getUserSession() {
    const user = sessionStorage.getItem('kadesh_user');
    return user ? JSON.parse(user) : null;
}

/**
 * Limpa a sessão do usuário do sessionStorage.
 */
function clearUserSession() {
    sessionStorage.removeItem('kadesh_user');
}
