<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow rounded">
                <p>Bem-vindo, {{ $user->name }}.</p>
                <p class="mt-2 text-gray-600 text-sm">Nenhum perfil específico configurado.</p>
            </div>
        </div>
    </div>
</x-app-layout>