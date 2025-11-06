// Kadesh Frontend - Project Management Logic

const API_URL = '/api';

/**
 * Creates a new milestone for a project.
 * @param {number} projectId - The ID of the project.
 * @param {object} milestoneData - The data for the new milestone.
 */
function createMilestone(projectId, milestoneData) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}/milestones`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(milestoneData),
        dataType: 'json'
    });
}

/**
 * Fetches the milestones for a project.
 * @param {number} projectId - The ID of the project.
 */
function getMilestones(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}/milestones`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Releases the funds for a milestone.
 * @param {number} milestoneId - The ID of the milestone.
 */
function releaseMilestone(milestoneId) {
    return $.ajax({
        url: `${API_URL}/milestones/${milestoneId}/release`,
        method: 'POST',
        dataType: 'json'
    });
}
