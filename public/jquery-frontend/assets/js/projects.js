// Kadesh Frontend - Project and Bidding Logic

const API_URL = '/api'; // Assuming the API is served from the same origin

/**
 * Fetches a list of all projects.
 */
function getProjects() {
    return $.ajax({
        url: `${API_URL}/projects`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Fetches the details for a single project.
 * @param {number} projectId - The ID of the project.
 */
function getProjectDetails(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Creates a new project.
 * @param {object} projectData - The data for the new project.
 */
function createProject(projectData) {
    return $.ajax({
        url: `${API_URL}/projects`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(projectData),
        dataType: 'json'
    });
}

/**
 * Fetches the bids for a single project.
 * @param {number} projectId - The ID of the project.
 */
function getProjectBids(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}/bids`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Creates a new bid on a project.
 * @param {object} bidData - The data for the new bid.
 */
function createBid(bidData) {
    return $.ajax({
        url: `${API_URL}/bids`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bidData),
        dataType: 'json'
    });
}
