/**
 * Autenticação com Bulma CSS
 */

// Carregar página de login
function loadLoginPage() {
    const html = `
        <section class="hero is-fullheight hero-gradient">
            <div class="hero-body">
                <div class="container">
                    <div class="columns is-centered">
                        <div class="column is-5-tablet is-4-desktop">
                            <div class="box animate__animated animate__fadeInUp">
                                <div class="has-text-centered mb-5">
                                    <h1 class="title is-3">
                                        <i class="fas fa-gavel has-text-primary"></i>
                                        Login no Kadesh
                                    </h1>
                                    <p class="subtitle is-6 has-text-grey">Entre para acessar sua conta</p>
                                </div>

                                <form id="loginForm">
                                    <div class="field">
                                        <label class="label">E-mail</label>
                                        <div class="control has-icons-left">
                                            <input class="input" type="email" name="email" placeholder="seu@email.com" required>
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-envelope"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">Senha</label>
                                        <div class="control has-icons-left">
                                            <input class="input" type="password" name="password" placeholder="••••••••" required>
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-lock"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="checkbox">
                                            <input type="checkbox" name="remember">
                                            Lembrar de mim
                                        </label>
                                    </div>

                                    <div class="field">
                                        <button type="submit" class="button is-primary is-fullwidth" id="btnLogin">
                                            <span class="icon"><i class="fas fa-sign-in-alt"></i></span>
                                            <span>Entrar</span>
                                        </button>
                                    </div>

                                    <div class="has-text-centered">
                                        <p class="mb-2">
                                            <a href="#forgot-password">Esqueceu a senha?</a>
                                        </p>
                                        <p>
                                            Não tem conta? <a href="#register" class="has-text-primary"><strong>Cadastre-se</strong></a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Configurar evento de submit
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
}

// Carregar página de registro
function loadRegisterPage() {
    const html = `
        <section class="hero is-fullheight hero-gradient">
            <div class="hero-body">
                <div class="container">
                    <div class="columns is-centered">
                        <div class="column is-6-tablet is-5-desktop">
                            <div class="box animate__animated animate__fadeInUp">
                                <div class="has-text-centered mb-5">
                                    <h1 class="title is-3">
                                        <i class="fas fa-user-plus has-text-primary"></i>
                                        Criar Conta
                                    </h1>
                                    <p class="subtitle is-6 has-text-grey">Junte-se ao Kadesh</p>
                                </div>

                                <form id="registerForm">
                                    <div class="field">
                                        <label class="label">Nome Completo</label>
                                        <div class="control has-icons-left">
                                            <input class="input" type="text" name="name" placeholder="João Silva" required>
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-user"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">E-mail</label>
                                        <div class="control has-icons-left">
                                            <input class="input" type="email" name="email" placeholder="seu@email.com" required>
                                            <span class="icon is-small is-left">
                                                <i class="fas fa-envelope"></i>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="columns">
                                        <div class="column">
                                            <div class="field">
                                                <label class="label">Senha</label>
                                                <div class="control has-icons-left">
                                                    <input class="input" type="password" name="password" placeholder="••••••••" required minlength="8">
                                                    <span class="icon is-small is-left">
                                                        <i class="fas fa-lock"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="column">
                                            <div class="field">
                                                <label class="label">Confirmar Senha</label>
                                                <div class="control has-icons-left">
                                                    <input class="input" type="password" name="password_confirmation" placeholder="••••••••" required minlength="8">
                                                    <span class="icon is-small is-left">
                                                        <i class="fas fa-lock"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="label">Tipo de Conta</label>
                                        <div class="control">
                                            <label class="radio">
                                                <input type="radio" name="user_type" value="client" checked>
                                                <span class="icon"><i class="fas fa-user"></i></span>
                                                Cliente (Contratar serviços)
                                            </label>
                                            <br>
                                            <label class="radio">
                                                <input type="radio" name="user_type" value="provider">
                                                <span class="icon"><i class="fas fa-briefcase"></i></span>
                                                Prestador (Oferecer serviços)
                                            </label>
                                        </div>
                                    </div>

                                    <div class="field">
                                        <label class="checkbox">
                                            <input type="checkbox" name="terms" required>
                                            Concordo com os <a href="#terms">Termos de Uso</a> e <a href="#privacy">Política de Privacidade</a>
                                        </label>
                                    </div>

                                    <div class="field">
                                        <button type="submit" class="button is-primary is-fullwidth" id="btnRegister">
                                            <span class="icon"><i class="fas fa-rocket"></i></span>
                                            <span>Criar Conta</span>
                                        </button>
                                    </div>

                                    <div class="has-text-centered">
                                        <p>
                                            Já tem conta? <a href="#login" class="has-text-primary"><strong>Faça login</strong></a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    $('#app').html(html);
    
    // Configurar evento de submit
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
}

// Handler de login
function handleLogin() {
    const email = $('input[name="email"]').val();
    const password = $('input[name="password"]').val();
    const remember = $('input[name="remember"]').is(':checked');
    
    // Desabilitar botão e mostrar loading
    const $btn = $('#btnLogin');
    $btn.addClass('is-loading');
    
    $.ajax({
        url: `${API_URL}/login`,
        method: 'POST',
        data: { email, password, remember },
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        if (response.user) {
            AppState.currentUser = response.user;
            updateUIForLoggedUser();
            loadWalletBalance();
            updateNotifications();
            showNotification('Login realizado com sucesso!', 'success');
            loadPage('dashboard');
        } else {
            showNotification('Credenciais inválidas', 'error');
        }
    }).fail(function(xhr) {
        const message = xhr.responseJSON?.error || 'Erro ao fazer login';
        showNotification(message, 'error');
    }).always(function() {
        $btn.removeClass('is-loading');
    });
}

// Handler de registro
function handleRegister() {
    const name = $('input[name="name"]').val();
    const email = $('input[name="email"]').val();
    const password = $('input[name="password"]').val();
    const password_confirmation = $('input[name="password_confirmation"]').val();
    const user_type = $('input[name="user_type"]:checked').val();
    
    // Validar senhas
    if (password !== password_confirmation) {
        showNotification('As senhas não coincidem', 'error');
        return;
    }
    
    // Desabilitar botão e mostrar loading
    const $btn = $('#btnRegister');
    $btn.addClass('is-loading');
    
    $.ajax({
        url: `${API_URL}/register`,
        method: 'POST',
        data: { name, email, password, password_confirmation, user_type },
        xhrFields: { withCredentials: true }
    }).done(function(response) {
        if (response.user) {
            AppState.currentUser = response.user;
            updateUIForLoggedUser();
            showNotification('Conta criada com sucesso!', 'success');
            loadPage('dashboard');
        }
    }).fail(function(xhr) {
        const message = xhr.responseJSON?.error || 'Erro ao criar conta';
        showNotification(message, 'error');
    }).always(function() {
        $btn.removeClass('is-loading');
    });
}
