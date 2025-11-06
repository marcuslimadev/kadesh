// Kadesh Frontend - Payment Logic

const API_URL = '/api';

/**
 * Initiates the funding process for a milestone.
 * @param {number} milestoneId - The ID of the milestone to fund.
 */
function fundMilestone(milestoneId) {
    return $.ajax({
        url: `${API_URL}/milestones/${milestoneId}/fund`,
        method: 'POST',
        dataType: 'json'
    });
}
