// Kadesh Frontend - Authentication Logic

const API_URL = '/api'; // Assuming the API is served from the same origin

/**
 * Handles user registration.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} type - The user's type ('contractor', 'provider', 'both').
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
 * Handles user login.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
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
 * Handles user logout.
 */
function logoutUser() {
    return $.ajax({
        url: `${API_URL}/logout`,
        method: 'POST',
    });
}

/**
 * Checks if a user is currently logged in.
 * Stores user data in sessionStorage.
 */
function checkUserStatus() {
    return $.ajax({
        url: `${API_URL}/user`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Saves user data to sessionStorage.
 * @param {object} userData - The user data object from the API.
 */
function saveUserSession(userData) {
    sessionStorage.setItem('kadesh_user', JSON.stringify(userData));
}

/**
 * Retrieves user data from sessionStorage.
 * @returns {object|null} The user data object or null if not logged in.
 */
function getUserSession() {
    const user = sessionStorage.getItem('kadesh_user');
    return user ? JSON.parse(user) : null;
}

/**
 * Clears the user session from sessionStorage.
 */
function clearUserSession() {
    sessionStorage.removeItem('kadesh_user');
}
