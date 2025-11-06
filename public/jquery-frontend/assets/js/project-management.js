// Kadesh Frontend - Lógica de Gerenciamento de Projetos

/**
 * Cria um novo marco para um projeto.
 * @param {number} projectId - ID do projeto.
 * @param {object} milestoneData - Dados do novo marco.
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
 * Busca os marcos de um projeto.
 * @param {number} projectId - ID do projeto.
 */
function getMilestones(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}/milestones`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Libera os fundos de um marco.
 * @param {number} milestoneId - ID do marco.
 */
function releaseMilestone(milestoneId) {
    return $.ajax({
        url: `${API_URL}/milestones/${milestoneId}/release`,
        method: 'POST',
        dataType: 'json'
    });
}
