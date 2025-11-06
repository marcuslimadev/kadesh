/**
 * Reputação com Bulma CSS
 */

// Carregar página de reputação
function loadReputationPage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <h1 class="title is-3">
                    <i class="fas fa-star has-text-primary"></i>
                    Reputação
                </h1>
                
                <div class="columns">
                    <div class="column is-4">
                        <div class="box has-text-centered">
                            <div class="mb-4">
                                <div class="reputation-avatar" style="width: 150px; height: 150px; margin: 0 auto; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="title is-1 has-text-white">${AppState.currentUser.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            
                            <h2 class="title is-4">${AppState.currentUser.name}</h2>
                            <p class="subtitle is-6 has-text-grey">@${AppState.currentUser.email.split('@')[0]}</p>
                            
                            <div class="tags is-centered mb-4">
                                <span class="tag is-primary is-medium">
                                    <span class="icon"><i class="fas fa-star"></i></span>
                                    <span id="userRating">0.0</span>
                                </span>
                                <span class="tag is-info is-medium">
                                    <span class="icon"><i class="fas fa-trophy"></i></span>
                                    <span>Nível <span id="userLevel">1</span></span>
                                </span>
                            </div>
                            
                            <div class="content">
                                <p class="has-text-weight-bold">Progresso</p>
                                <progress class="progress is-primary" value="0" max="100" id="levelProgress">0%</progress>
                                <p class="help"><span id="currentPoints">0</span> / <span id="nextLevelPoints">100</span> pontos</p>
                            </div>
                        </div>
                        
                        <div class="box">
                            <h3 class="title is-5">
                                <span class="icon"><i class="fas fa-medal"></i></span>
                                Conquistas
                            </h3>
                            <div id="badgesList">
                                <div class="has-text-centered">
                                    <button class="button is-loading is-ghost"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="column is-8">
                        <div class="box">
                            <h2 class="title is-4">Estatísticas</h2>
                            <div class="columns is-multiline">
                                <div class="column is-6">
                                    <div class="stat-card-small">
                                        <span class="icon has-text-primary">
                                            <i class="fas fa-2x fa-check-circle"></i>
                                        </span>
                                        <p class="title is-4" id="statsCompleted">0</p>
                                        <p class="subtitle is-6">Projetos Concluídos</p>
                                    </div>
                                </div>
                                <div class="column is-6">
                                    <div class="stat-card-small">
                                        <span class="icon has-text-success">
                                            <i class="fas fa-2x fa-thumbs-up"></i>
                                        </span>
                                        <p class="title is-4" id="statsPositive">0%</p>
                                        <p class="subtitle is-6">Avaliações Positivas</p>
                                    </div>
                                </div>
                                <div class="column is-6">
                                    <div class="stat-card-small">
                                        <span class="icon has-text-info">
                                            <i class="fas fa-2x fa-clock"></i>
                                        </span>
                                        <p class="title is-4" id="statsTime">0h</p>
                                        <p class="subtitle is-6">Tempo Médio de Resposta</p>
                                    </div>
                                </div>
                                <div class="column is-6">
                                    <div class="stat-card-small">
                                        <span class="icon has-text-warning">
                                            <i class="fas fa-2x fa-redo"></i>
                                        </span>
                                        <p class="title is-4" id="statsRepeat">0%</p>
                                        <p class="subtitle is-6">Taxa de Recontratação</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="box">
                            <div class="level">
                                <div class="level-left">
                                    <h2 class="title is-4">Avaliações</h2>
                                </div>
                                <div class="level-right">
                                    <div class="field has-addons">
                                        <div class="control">
                                            <div class="select">
                                                <select id="filterReviews">
                                                    <option value="all">Todas</option>
                                                    <option value="5">5 estrelas</option>
                                                    <option value="4">4 estrelas</option>
                                                    <option value="3">3 estrelas</option>
                                                    <option value="2">2 estrelas</option>
                                                    <option value="1">1 estrela</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="reviewsList">
                                <div class="has-text-centered">
                                    <button class="button is-loading is-ghost is-large"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    loadReputationData();
}

// Carregar dados de reputação
function loadReputationData() {
    $.ajax({
        url: `${API_URL}/reputation/profile`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(data) {
        // Atualizar rating e nível
        $('#userRating').text(parseFloat(data.rating || 0).toFixed(1));
        $('#userLevel').text(data.level || 1);
        
        // Atualizar progresso
        const progress = (data.current_points / data.next_level_points) * 100;
        $('#levelProgress').val(progress);
        $('#currentPoints').text(data.current_points || 0);
        $('#nextLevelPoints').text(data.next_level_points || 100);
        
        // Atualizar estatísticas
        $('#statsCompleted').text(data.completed_projects || 0);
        $('#statsPositive').text(((data.positive_reviews / data.total_reviews * 100) || 0).toFixed(0) + '%');
        $('#statsTime').text((data.avg_response_time || 0) + 'h');
        $('#statsRepeat').text(((data.repeat_clients / data.total_clients * 100) || 0).toFixed(0) + '%');
        
        // Carregar badges e reviews
        loadBadges();
        loadReviews();
    });
}

// Carregar badges
function loadBadges() {
    $.ajax({
        url: `${API_URL}/reputation/badges`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(badges) {
        if (badges.length === 0) {
            $('#badgesList').html('<p class="has-text-grey has-text-centered">Nenhuma conquista ainda</p>');
            return;
        }
        
        let html = '<div class="badges-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">';
        badges.forEach(badge => {
            html += `
                <div class="box has-text-centered p-3" style="background: ${badge.earned ? 'var(--success-gradient)' : '#f5f5f5'}; color: ${badge.earned ? 'white' : 'inherit'};">
                    <span class="icon is-large">
                        <i class="fas fa-2x fa-${badge.icon}"></i>
                    </span>
                    <p class="has-text-weight-bold mt-2">${badge.name}</p>
                    <p class="is-size-7">${badge.description}</p>
                </div>
            `;
        });
        html += '</div>';
        
        $('#badgesList').html(html);
    });
}

// Carregar reviews
function loadReviews() {
    $.ajax({
        url: `${API_URL}/reputation/reviews`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(reviews) {
        displayReviews(reviews);
    }).fail(function() {
        $('#reviewsList').html('<p class="has-text-danger">Erro ao carregar avaliações</p>');
    });
}

// Exibir reviews
function displayReviews(reviews) {
    if (reviews.length === 0) {
        $('#reviewsList').html(`
            <div class="notification is-info is-light has-text-centered">
                <p>Você ainda não recebeu avaliações</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    reviews.forEach(review => {
        const stars = Array(5).fill(0).map((_, i) => {
            return `<span class="icon has-text-warning"><i class="fas fa-star${i < review.rating ? '' : '-o'}"></i></span>`;
        }).join('');
        
        html += `
            <div class="box">
                <article class="media">
                    <div class="media-left">
                        <div style="width: 48px; height: 48px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <span class="has-text-white has-text-weight-bold">${review.reviewer_name.charAt(0)}</span>
                        </div>
                    </div>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>${review.reviewer_name}</strong> 
                                <small class="has-text-grey">${formatDate(review.created_at)}</small>
                                <br>
                                ${stars}
                                <br>
                                ${review.comment || ''}
                            </p>
                        </div>
                        ${review.project_title ? `
                            <nav class="level is-mobile">
                                <div class="level-left">
                                    <span class="tag is-light">
                                        <span class="icon"><i class="fas fa-folder"></i></span>
                                        <span>${review.project_title}</span>
                                    </span>
                                </div>
                            </nav>
                        ` : ''}
                    </div>
                </article>
            </div>
        `;
    });
    
    $('#reviewsList').html(html);
}

// Carregar perfil público
function loadProfilePage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <h1 class="title is-3">
                    <i class="fas fa-user has-text-primary"></i>
                    Meu Perfil
                </h1>
                
                <div class="columns">
                    <div class="column is-8">
                        <div class="box">
                            <h2 class="title is-4">Informações Pessoais</h2>
                            <form id="profileForm">
                                <div class="field">
                                    <label class="label">Nome</label>
                                    <div class="control">
                                        <input class="input" type="text" name="name" value="${AppState.currentUser.name}">
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <label class="label">E-mail</label>
                                    <div class="control">
                                        <input class="input" type="email" name="email" value="${AppState.currentUser.email}" disabled>
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <label class="label">Bio</label>
                                    <div class="control">
                                        <textarea class="textarea" name="bio" placeholder="Conte um pouco sobre você..."></textarea>
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <div class="control">
                                        <button type="submit" class="button is-primary">
                                            <span class="icon"><i class="fas fa-save"></i></span>
                                            <span>Salvar Alterações</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div class="box">
                            <h2 class="title is-4">Alterar Senha</h2>
                            <form id="passwordForm">
                                <div class="field">
                                    <label class="label">Senha Atual</label>
                                    <div class="control">
                                        <input class="input" type="password" name="current_password">
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <label class="label">Nova Senha</label>
                                    <div class="control">
                                        <input class="input" type="password" name="new_password">
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <label class="label">Confirmar Nova Senha</label>
                                    <div class="control">
                                        <input class="input" type="password" name="new_password_confirmation">
                                    </div>
                                </div>
                                
                                <div class="field">
                                    <div class="control">
                                        <button type="submit" class="button is-warning">
                                            <span class="icon"><i class="fas fa-lock"></i></span>
                                            <span>Alterar Senha</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="column is-4">
                        <div class="box">
                            <h3 class="title is-5">Avatar</h3>
                            <div class="has-text-centered mb-4">
                                <div style="width: 150px; height: 150px; margin: 0 auto; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span class="title is-1 has-text-white">${AppState.currentUser.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div class="file is-fullwidth">
                                <label class="file-label">
                                    <input class="file-input" type="file" name="avatar">
                                    <span class="file-cta">
                                        <span class="file-icon">
                                            <i class="fas fa-upload"></i>
                                        </span>
                                        <span class="file-label">
                                            Escolher foto
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
}
