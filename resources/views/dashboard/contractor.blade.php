<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard Contratante') }}
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 shadow rounded">
                    <div class="text-sm text-gray-500">Projetos Criados</div>
                    <div class="text-2xl font-bold">{{ $stats['projects_total'] }}</div>
                </div>
                <div class="bg-white p-4 shadow rounded">
                    <div class="text-sm text-gray-500">Projetos Abertos</div>
                    <div class="text-2xl font-bold">{{ $stats['projects_open'] }}</div>
                </div>
                <div class="bg-white p-4 shadow rounded">
                    <div class="text-sm text-gray-500">Em Andamento</div>
                    <div class="text-2xl font-bold">{{ $stats['projects_in_progress'] }}</div>
                </div>
                <div class="bg-white p-4 shadow rounded">
                    <div class="text-sm text-gray-500">Total Gasto (R$)</div>
                    <div class="text-2xl font-bold">{{ number_format($stats['total_spent'], 2, ',', '.') }}</div>
                </div>
            </div>

            <div class="bg-white p-6 shadow rounded">
                <h3 class="text-lg font-semibold mb-4">Ações Rápidas</h3>
                <div class="flex flex-wrap gap-4">
                    <a href="{{ route('projects.create') }}" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Publicar Novo Projeto</a>
                    <a href="{{ route('projects.index') }}" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Meus Projetos</a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>