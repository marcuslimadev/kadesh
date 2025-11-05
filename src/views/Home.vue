<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary-50 py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold text-neutral-900">Encontre os Melhores Profissionais. <br> Publique seu Projeto.</h1>
        <p class="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">A Kadesh é a plataforma que conecta você a especialistas qualificados para todos os tipos de projetos de construção e reforma.</p>
        <div class="mt-8 flex justify-center gap-4">
          <router-link to="/projects" class="btn-primary">Ver Projetos</router-link>
          <router-link to="/register" class="btn-secondary">Comece Agora</router-link>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Como Funciona</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 class="text-2xl font-bold mb-2">1. Publique seu Projeto</h3>
            <p>Descreva sua necessidade, do pequeno reparo à grande construção. É rápido e gratuito.</p>
          </div>
          <div>
            <h3 class="text-2xl font-bold mb-2">2. Receba Propostas</h3>
            <p>Profissionais qualificados enviam lances competitivos baseados em preço e reputação.</p>
          </div>
          <div>
            <h3 class="text-2xl font-bold mb-2">3. Escolha o Vencedor</h3>
            <p>Analise as propostas e o histórico dos fornecedores para contratar com segurança.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.btn-secondary {
  background-color: white;
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-600);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background-color: var(--color-primary-50);
}
</style>
