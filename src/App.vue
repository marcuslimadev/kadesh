<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold text-uppercase me-3 text-dark" to="/">KADESH</router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link fw-semibold" to="/projects">Leilões</router-link>
            </li>
          </ul>
          <div class="d-flex">
            <router-link class="btn btn-outline-primary" to="/login">Entrar</router-link>
          </div>
        </div>
      </div>
    </nav>

    <router-view/>

    <!-- FOOTER -->
    <footer class="bg-white border-top mt-4">
      <div class="container py-4">
        <div class="row g-3 align-items-center">
          <div class="col-12 col-md-4">
            <div class="fw-bold text-dark text-uppercase">KADESH</div>
            <div class="text-muted small">Leilões de serviços com transparência e segurança.</div>
          </div>
          <div class="col-6 col-md-4">
            <div class="small text-muted mb-1">Institucional</div>
            <div class="d-flex gap-3 flex-wrap">
              <a class="link-secondary small text-decoration-none" href="#">Sobre</a>
              <a class="link-secondary small text-decoration-none" href="#">Termos</a>
              <a class="link-secondary small text-decoration-none" href="#">Privacidade</a>
            </div>
          </div>
          <div class="col-6 col-md-4 text-md-end">
            <div class="small text-muted mb-1">Ajuda</div>
            <div class="d-flex gap-3 justify-content-md-end flex-wrap">
              <a class="link-secondary small text-decoration-none" href="#">FAQ</a>
              <a class="link-secondary small text-decoration-none" href="#">Contato</a>
            </div>
          </div>
        </div>
        <hr class="my-3"/>
        <div class="d-flex justify-content-between small text-muted">
          <span>© 2025 Kadesh Serviços</span>
          <span>Feito com Bootstrap 5</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>




