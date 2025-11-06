// Kadesh Frontend - Lógica de Pagamentos

/**
 * Inicia o processo de financiamento de um marco.
 * @param {number} milestoneId - ID do marco a ser financiado.
 */
function fundMilestone(milestoneId) {
    return $.ajax({
        url: `${API_URL}/milestones/${milestoneId}/fund`,
        method: 'POST',
        dataType: 'json'
    });
}
