// Kadesh Frontend - Lógica de Projetos e Propostas

/**
 * Busca a lista de todos os projetos.
 */
function getProjects() {
    return $.ajax({
        url: `${API_URL}/projects`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Busca os detalhes de um projeto específico.
 * @param {number} projectId - ID do projeto.
 */
function getProjectDetails(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Cria um novo projeto.
 * @param {object} projectData - Dados do novo projeto.
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
 * Busca as propostas de um projeto.
 * @param {number} projectId - ID do projeto.
 */
function getProjectBids(projectId) {
    return $.ajax({
        url: `${API_URL}/projects/${projectId}/bids`,
        method: 'GET',
        dataType: 'json'
    });
}

/**
 * Cria uma nova proposta em um projeto.
 * @param {object} bidData - Dados da nova proposta.
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
