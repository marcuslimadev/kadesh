<template>
  <footer class="bg-surface border-t border-theme text-heading mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-lg font-bold mb-4">Kadesh</h3>
          <p class="text-body text-sm">
            Conectando profissionais talentosos com oportunidades incríveis.
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Plataforma</h4>
          <ul class="space-y-2">
            <li>
              <router-link to="/projects" class="text-body hover:text-heading text-sm transition">
                Explorar Vagas
              </router-link>
            </li>
            <li>
              <router-link to="/register" class="text-body hover:text-heading text-sm transition">
                Criar Conta
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Suporte</h4>
          <ul class="space-y-2">
            <li>
               <a href="#" class="text-body hover:text-heading text-sm transition">
                Central de Ajuda
              </a>
            </li>
            <li>
               <a href="#" class="text-body hover:text-heading text-sm transition">
                Contato
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
          <ul class="space-y-2">
            <li>
               <a href="#" class="text-body hover:text-heading text-sm transition">
                Termos de Uso
              </a>
            </li>
            <li>
               <a href="#" class="text-body hover:text-heading text-sm transition">
                Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-theme mt-8 pt-8 text-center">
        <p class="text-body text-sm">
          &copy; {{ currentYear }} Kadesh. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
