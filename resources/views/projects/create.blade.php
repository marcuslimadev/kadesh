<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Novo Projeto') }}</h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-6 shadow rounded">
                <form method="POST" action="{{ route('projects.store') }}">
                    @csrf
                    <div class="grid gap-4">
                        <div>
                            <label class="block text-sm font-medium">Título</label>
                            <input name="title" value="{{ old('title') }}" class="mt-1 w-full rounded border-gray-300" required />
                            <x-input-error :messages="$errors->get('title')" class="mt-1" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Descrição</label>
                            <textarea name="description" rows="6" class="mt-1 w-full rounded border-gray-300" required>{{ old('description') }}</textarea>
                            <x-input-error :messages="$errors->get('description')" class="mt-1" />
                        </div>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium">Orçamento Máx (R$)</label>
                                <input type="number" step="0.01" name="max_budget" value="{{ old('max_budget') }}" class="mt-1 w-full rounded border-gray-300" required />
                                <x-input-error :messages="$errors->get('max_budget')" class="mt-1" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium">Fim dos Lances</label>
                                <input type="datetime-local" name="bidding_ends_at" value="{{ old('bidding_ends_at') }}" class="mt-1 w-full rounded border-gray-300" required />
                                <x-input-error :messages="$errors->get('bidding_ends_at')" class="mt-1" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium">Prazo Final (opcional)</label>
                                <input type="datetime-local" name="project_deadline" value="{{ old('project_deadline') }}" class="mt-1 w-full rounded border-gray-300" />
                                <x-input-error :messages="$errors->get('project_deadline')" class="mt-1" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Habilidades (separar por vírgula)</label>
                            <input type="text" name="skills_input" value="{{ old('skills_input') }}" class="mt-1 w-full rounded border-gray-300" placeholder="ex: PHP, Laravel, MySQL" />
                            <p class="text-xs text-gray-500 mt-1">Será processado no backend.</p>
                        </div>
                        <div>
                            <button class="px-4 py-2 bg-indigo-600 text-white rounded">Publicar</button>
                            <a href="{{ route('projects.index') }}" class="px-4 py-2 bg-gray-500 text-white rounded">Cancelar</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>