<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <Link href="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-sm">K</span>
              </div>
              <span class="text-xl font-bold text-gray-900">Kadesh</span>
            </Link>
            
            <div class="hidden md:flex items-center space-x-6">
              <Link href="/" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/projects" class="text-gray-600 hover:text-blue-600 transition-colors font-medium">Projetos</Link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="!$page.props.auth.user">
              <Link href="/login" 
                    class="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Entrar
              </Link>
              <Link href="/register" 
                    class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium">
                Registrar
              </Link>
            </template>
            
            <template v-else>
              <div class="flex items-center space-x-4">
                <div class="hidden sm:block">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-semibold">{{ $page.props.auth.user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ $page.props.auth.user.name }}</p>
                      <p class="text-xs text-gray-500">{{ $page.props.auth.user.is_contractor ? 'Contratante' : $page.props.auth.user.is_provider ? 'Fornecedor' : 'Usuário' }}</p>
                    </div>
                  </div>
                </div>
                
                <Link href="/projects/create" 
                      class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm">
                  + Projeto
                </Link>
                
                <Link href="/logout" method="post" as="button"
                      class="text-gray-500 hover:text-red-600 transition-colors p-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                </Link>
              </div>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>

    <!-- Notifications Container -->
    <div class="notifications-container">
      <Notification
        v-if="$page.props.flash.success"
        type="success"
        :title="$page.props.flash.success"
        @close="clearFlashMessage('success')"
      />
      <Notification
        v-if="$page.props.flash.error"
        type="error"
        :title="$page.props.flash.error"
        @close="clearFlashMessage('error')"
      />
    </div>
  </div>
</template>

<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import Notification from './Notification.vue'
import { router } from '@inertiajs/vue3'

const page = usePage()

const clearFlashMessage = (type) => {
  // Clear flash message from props
  if (page.props.flash[type]) {
    page.props.flash[type] = null
  }
}
</script>