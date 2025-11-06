// Kadesh Frontend - Admin Panel Logic

const API_URL = '/api/admin'; // Assuming the admin API is served from /api/admin

/**
 * Handles admin login.
 * @param {string} email - The admin's email.
 * @param {string} password - The admin's password.
 */
function loginAdmin(email, password) {
    return $.ajax({
        url: `${API_URL}/login`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        dataType: 'json'
    });
}

/**
 * Fetches the dashboard statistics for the admin panel.
 */
function getAdminStats() {
    return $.ajax({
        url: `${API_URL}/stats`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Fetches a list of all users.
 */
function getAdminUsers() {
    return $.ajax({
        url: `${API_URL}/users`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Fetches a list of all projects.
 */
function getAdminProjects() {
    return $.ajax({
        url: `${API_URL}/projects`,
        method: 'GET',
        dataType: 'json'
    });
}
