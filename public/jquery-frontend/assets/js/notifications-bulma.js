/**
 * Notificações com Bulma CSS
 */

// Atualizar notificações (já implementado parcialmente no main-bulma.js)
// Esta função é chamada periodicamente

function updateNotifications() {
    if (!AppState.currentUser) return;
    
    $.ajax({
        url: `${API_URL}/notifications`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(notifications) {
        AppState.notifications = notifications;
        
        const unreadCount = notifications.filter(n => !n.is_read).length;
        $('#notificationCount').text(unreadCount);
        
        if (unreadCount > 0) {
            $('#notificationCount').show();
        } else {
            $('#notificationCount').hide();
        }
        
        // Atualizar dropdown de notificações se existir
        updateNotificationsDropdown(notifications);
    });
}

// Atualizar dropdown de notificações
function updateNotificationsDropdown(notifications) {
    const $dropdown = $('#notificationsDropdown');
    if ($dropdown.length === 0) return;
    
    if (notifications.length === 0) {
        $dropdown.html(`
            <div class="dropdown-item has-text-centered has-text-grey">
                <p>Nenhuma notificação</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    notifications.slice(0, 5).forEach(notification => {
        const icon = getNotificationIcon(notification.type);
        const unreadClass = notification.is_read ? '' : 'has-background-light';
        
        html += `
            <a class="dropdown-item ${unreadClass}" href="#" data-notification-id="${notification.id}">
                <div class="media">
                    <div class="media-left">
                        <span class="icon has-text-${getNotificationColor(notification.type)}">
                            <i class="fas fa-${icon}"></i>
                        </span>
                    </div>
                    <div class="media-content">
                        <p class="is-size-7">
                            <strong>${notification.title}</strong>
                            <br>
                            ${notification.message}
                            <br>
                            <small class="has-text-grey">${formatDate(notification.created_at)}</small>
                        </p>
                    </div>
                </div>
            </a>
            <hr class="dropdown-divider">
        `;
    });
    
    html += `
        <a class="dropdown-item has-text-centered has-text-primary" href="#notifications">
            <strong>Ver todas as notificações</strong>
        </a>
    `;
    
    $dropdown.html(html);
}

// Obter ícone da notificação
function getNotificationIcon(type) {
    const icons = {
        'bid_received': 'gavel',
        'bid_accepted': 'check-circle',
        'bid_rejected': 'times-circle',
        'project_completed': 'flag-checkered',
        'payment_received': 'money-bill-wave',
        'review_received': 'star',
        'message_received': 'envelope',
        'milestone_completed': 'check',
        'dispute_opened': 'exclamation-triangle',
        'system': 'bell'
    };
    return icons[type] || 'bell';
}

// Obter cor da notificação
function getNotificationColor(type) {
    const colors = {
        'bid_received': 'info',
        'bid_accepted': 'success',
        'bid_rejected': 'danger',
        'project_completed': 'success',
        'payment_received': 'success',
        'review_received': 'warning',
        'message_received': 'primary',
        'milestone_completed': 'success',
        'dispute_opened': 'danger',
        'system': 'info'
    };
    return colors[type] || 'info';
}

// Marcar notificação como lida
function markNotificationAsRead(notificationId) {
    $.ajax({
        url: `${API_URL}/notifications/${notificationId}/read`,
        method: 'POST',
        xhrFields: { withCredentials: true }
    }).done(function() {
        updateNotifications();
    });
}

// Marcar todas como lidas
function markAllNotificationsAsRead() {
    $.ajax({
        url: `${API_URL}/notifications/read-all`,
        method: 'POST',
        xhrFields: { withCredentials: true }
    }).done(function() {
        updateNotifications();
        showNotification('Todas as notificações foram marcadas como lidas', 'success');
    });
}

// Configurar dropdown de notificações na navbar
function setupNotificationsDropdown() {
    // Criar dropdown de notificações se não existir
    if ($('#notificationsDropdown').length === 0) {
        const dropdown = `
            <div class="navbar-item has-dropdown is-hoverable" id="navNotifications" style="display:none;">
                <a class="navbar-link notification-bell">
                    <span class="icon">
                        <i class="fas fa-bell"></i>
                    </span>
                    <span class="notification-badge" id="notificationCount">0</span>
                </a>
                <div class="navbar-dropdown is-right" id="notificationsDropdown" style="min-width: 400px; max-height: 400px; overflow-y: auto;">
                    <div class="dropdown-item has-text-centered">
                        <button class="button is-loading is-ghost"></button>
                    </div>
                </div>
            </div>
        `;
        
        // Substituir o item de notificações existente
        $('#navNotifications').replaceWith(dropdown);
    }
    
    // Event listener para marcar como lida ao clicar
    $(document).on('click', '[data-notification-id]', function(e) {
        e.preventDefault();
        const notificationId = $(this).data('notification-id');
        markNotificationAsRead(notificationId);
    });
}

// Página de notificações completa
function loadNotificationsPage() {
    if (!AppState.currentUser) {
        loadPage('login');
        return;
    }
    
    const html = `
        <section class="section">
            <div class="container">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <h1 class="title is-3">
                                <i class="fas fa-bell has-text-primary"></i>
                                Notificações
                            </h1>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-light" id="btnMarkAllRead">
                                <span class="icon"><i class="fas fa-check-double"></i></span>
                                <span>Marcar todas como lidas</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="tabs is-boxed">
                    <ul>
                        <li class="is-active" data-filter="all">
                            <a>
                                <span class="icon"><i class="fas fa-list"></i></span>
                                <span>Todas</span>
                            </a>
                        </li>
                        <li data-filter="unread">
                            <a>
                                <span class="icon"><i class="fas fa-circle"></i></span>
                                <span>Não lidas</span>
                            </a>
                        </li>
                        <li data-filter="bids">
                            <a>
                                <span class="icon"><i class="fas fa-gavel"></i></span>
                                <span>Propostas</span>
                            </a>
                        </li>
                        <li data-filter="payments">
                            <a>
                                <span class="icon"><i class="fas fa-money-bill-wave"></i></span>
                                <span>Pagamentos</span>
                            </a>
                        </li>
                        <li data-filter="reviews">
                            <a>
                                <span class="icon"><i class="fas fa-star"></i></span>
                                <span>Avaliações</span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div id="notificationsList">
                    <div class="has-text-centered">
                        <button class="button is-loading is-large is-ghost"></button>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Event listeners
    $('#btnMarkAllRead').on('click', markAllNotificationsAsRead);
    
    $('.tabs li').on('click', function() {
        $(this).addClass('is-active').siblings().removeClass('is-active');
        const filter = $(this).data('filter');
        filterNotifications(filter);
    });
    
    loadAllNotifications();
}

// Carregar todas as notificações
function loadAllNotifications() {
    $.ajax({
        url: `${API_URL}/notifications/all`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(notifications) {
        displayNotificationsList(notifications);
    }).fail(function() {
        $('#notificationsList').html(`
            <div class="notification is-danger">
                Erro ao carregar notificações
            </div>
        `);
    });
}

// Exibir lista de notificações
function displayNotificationsList(notifications) {
    if (notifications.length === 0) {
        $('#notificationsList').html(`
            <div class="notification is-info is-light has-text-centered">
                <p class="is-size-4">
                    <span class="icon is-large"><i class="fas fa-2x fa-bell-slash"></i></span>
                </p>
                <p>Você não tem notificações</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    notifications.forEach(notification => {
        const icon = getNotificationIcon(notification.type);
        const color = getNotificationColor(notification.type);
        const unreadClass = notification.is_read ? '' : 'has-background-light';
        
        html += `
            <div class="box ${unreadClass} notification-item" data-id="${notification.id}" data-type="${notification.type}" data-read="${notification.is_read}">
                <article class="media">
                    <div class="media-left">
                        <span class="icon is-large has-text-${color}">
                            <i class="fas fa-2x fa-${icon}"></i>
                        </span>
                    </div>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>${notification.title}</strong>
                                ${!notification.is_read ? '<span class="tag is-primary is-light ml-2">Nova</span>' : ''}
                                <br>
                                ${notification.message}
                                <br>
                                <small class="has-text-grey">
                                    <span class="icon"><i class="fas fa-clock"></i></span>
                                    ${formatDate(notification.created_at)}
                                </small>
                            </p>
                        </div>
                    </div>
                    <div class="media-right">
                        ${!notification.is_read ? `
                            <button class="button is-small is-primary is-light btn-mark-read" data-id="${notification.id}">
                                <span class="icon"><i class="fas fa-check"></i></span>
                            </button>
                        ` : ''}
                    </div>
                </article>
            </div>
        `;
    });
    
    $('#notificationsList').html(html);
    
    // Event listener para marcar como lida
    $('.btn-mark-read').on('click', function() {
        const id = $(this).data('id');
        markNotificationAsRead(id);
    });
}

// Filtrar notificações
function filterNotifications(filter) {
    if (filter === 'all') {
        $('.notification-item').show();
    } else if (filter === 'unread') {
        $('.notification-item').hide();
        $('.notification-item[data-read="false"]').show();
    } else {
        $('.notification-item').hide();
        $(`.notification-item[data-type*="${filter}"]`).show();
    }
}

// Sistema de notificações push (simulado)
function initPushNotifications() {
    if (!AppState.currentUser) return;
    
    // Verificar novas notificações a cada 30 segundos
    setInterval(() => {
        checkNewNotifications();
    }, 30000);
}

// Verificar novas notificações
function checkNewNotifications() {
    $.ajax({
        url: `${API_URL}/notifications/new`,
        method: 'GET',
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        if (response.has_new) {
            // Mostrar notificação no navegador
            if (Notification.permission === 'granted') {
                new Notification('Kadesh', {
                    body: 'Você tem novas notificações!',
                    icon: '/kadesh/public/jquery-frontend/assets/img/logo.png'
                });
            }
            
            // Atualizar contador
            updateNotifications();
        }
    });
}

// Solicitar permissão para notificações do navegador
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Inicializar sistema de notificações quando o documento estiver pronto
$(document).ready(function() {
    if (AppState.currentUser) {
        setupNotificationsDropdown();
        initPushNotifications();
        requestNotificationPermission();
    }
});
