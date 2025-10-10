<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ __('Projetos') }}</h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white p-4 rounded shadow mb-4">
                <form method="GET" class="flex flex-wrap gap-4 items-end">
                    <div>
                        <label class="block text-sm font-medium">Busca</label>
                        <input type="text" name="q" value="{{ request('q') }}" class="mt-1 rounded border-gray-300" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium">Status</label>
                        <select name="status" class="mt-1 rounded border-gray-300">
                            <option value="">Todos</option>
                            @foreach(['open'=>'Aberto','bidding'=>'Em Lances','awarded'=>'Adjudicado','in_progress'=>'Em Execução','completed'=>'Concluído','cancelled'=>'Cancelado'] as $k=>$v)
                                <option value="{{ $k }}" @selected(request('status')===$k)>{{ $v }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <button class="px-4 py-2 bg-indigo-600 text-white rounded">Filtrar</button>
                    </div>
                    @if(auth()->user()->isContractor())
                    <div class="ml-auto">
                        <a href="{{ route('projects.create') }}" class="px-4 py-2 bg-green-600 text-white rounded">+ Novo Projeto</a>
                    </div>
                    @endif
                </form>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                @forelse($projects as $project)
                    <div class="border p-4 bg-white rounded shadow">
                        <h3 class="font-semibold text-lg mb-1">
                            <a href="{{ route('projects.show',$project) }}" class="hover:underline">{{ $project->title }}</a>
                        </h3>
                        <p class="text-sm text-gray-600 line-clamp-3 mb-2">{{ Str::limit($project->description,120) }}</p>
                        <div class="text-xs text-gray-500 mb-1">Budget Máx: R$ {{ number_format($project->max_budget,2,',','.') }}</div>
                        <div class="text-xs text-gray-500 mb-1">Menor Lance: 
                            @php $lowest = $project->bids()->min('amount'); @endphp
                            @if($lowest) R$ {{ number_format($lowest,2,',','.') }} @else -- @endif
                        </div>
                        <div class="text-xs text-gray-500 mb-2">Termina em: {{ $project->bidding_ends_at->diffForHumans() }}</div>
                        <span class="inline-block px-2 py-1 text-xs rounded bg-gray-100">{{ $project->status }}</span>
                    </div>
                @empty
                    <p class="col-span-full text-center text-gray-500">Nenhum projeto encontrado.</p>
                @endforelse
            </div>

            <div class="mt-6">{{ $projects->links() }}</div>
        </div>
    </div>
</x-app-layout>