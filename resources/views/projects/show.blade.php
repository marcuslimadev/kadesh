<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">{{ $project->title }}</h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
            @if(session('success'))
                <div class="bg-green-100 text-green-800 px-4 py-2 rounded">{{ session('success') }}</div>
            @endif

            <div class="bg-white p-6 shadow rounded">
                <div class="flex flex-col md:flex-row md:justify-between gap-4">
                    <div class="space-y-2 flex-1">
                        <p class="text-gray-700 whitespace-pre-line">{{ $project->description }}</p>
                        <div class="text-sm text-gray-500">Publicado por: {{ $project->contractor->name }}</div>
                        <div class="text-sm text-gray-500">Orçamento Máx: R$ {{ number_format($project->max_budget,2,',','.') }}</div>
                        <div class="text-sm text-gray-500">Status: <span class="uppercase">{{ $project->status }}</span></div>
                        <div class="text-sm text-gray-500">Fim dos Lances: {{ $project->bidding_ends_at->format('d/m/Y H:i') }} ({{ $project->bidding_ends_at->diffForHumans() }})</div>
                        @if($project->project_deadline)
                            <div class="text-sm text-gray-500">Prazo Final: {{ $project->project_deadline->format('d/m/Y H:i') }}</div>
                        @endif
                        <div class="text-sm text-gray-500">Menor Lance Atual: @if($lowest) R$ {{ number_format($lowest,2,',','.') }} @else -- @endif</div>
                        @if($winnerCandidate)
                            <div class="text-sm font-medium text-green-600">Candidato a Vencedor: {{ $winnerCandidate->name }}</div>
                        @endif
                        @if($project->required_skills)
                            <div class="flex flex-wrap gap-2 mt-2">
                                @foreach($project->required_skills as $sk)
                                    <span class="px-2 py-1 text-xs bg-gray-100 rounded">{{ $sk }}</span>
                                @endforeach
                            </div>
                        @endif
                    </div>
                    @if(auth()->check() && auth()->user()->isContractor() && auth()->id()===$project->contractor_id)
                        <div class="space-y-2">
                            @if($project->status === 'bidding')
                                <a href="{{ route('projects.edit',$project) }}" class="block px-4 py-2 bg-yellow-500 text-white rounded text-center">Editar</a>
                            @elseif($project->status === 'awarded')
                                <form method="POST" action="{{ route('projects.confirmWinner',$project) }}" class="inline">
                                    @csrf
                                    <button class="block w-full px-4 py-2 bg-green-600 text-white rounded">Confirmar Vencedor</button>
                                </form>
                            @endif
                        </div>
                    @endif
                </div>
            </div>

            <div class="bg-white p-6 shadow rounded">
                <h3 class="text-lg font-semibold mb-4">Lances</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead>
                            <tr class="text-left border-b">
                                <th class="py-2">Prestador</th>
                                <th class="py-2">Valor (R$)</th>
                                <th class="py-2">Prazo (dias)</th>
                                <th class="py-2">Enviado</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($bids as $bid)
                                <tr class="border-b @if($lowest && $bid->amount == $lowest) bg-green-50 @endif">
                                    <td class="py-2">{{ $bid->provider->name }}</td>
                                    <td class="py-2 font-medium">{{ number_format($bid->amount,2,',','.') }}</td>
                                    <td class="py-2">{{ $bid->delivery_time_days }}</td>
                                    <td class="py-2">{{ $bid->submitted_at->diffForHumans() }}</td>
                                </tr>
                            @empty
                                <tr><td colspan="4" class="py-4 text-center text-gray-500">Nenhum lance ainda.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            @if(auth()->check() && auth()->user()->isProvider() && $project->status==='bidding')
                <div class="bg-white p-6 shadow rounded">
                    <h3 class="text-lg font-semibold mb-4">Enviar Lance</h3>
                    <form method="POST" action="{{ route('bids.store') }}" class="grid gap-4">
                        @csrf
                        <input type="hidden" name="project_id" value="{{ $project->id }}" />
                        <div>
                            <label class="block text-sm font-medium">Valor (R$)</label>
                            <input type="number" step="0.01" name="amount" class="mt-1 rounded border-gray-300" required />
                            <x-input-error :messages="$errors->get('amount')" class="mt-1" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Prazo de Entrega (dias)</label>
                            <input type="number" name="delivery_time_days" class="mt-1 rounded border-gray-300" required />
                            <x-input-error :messages="$errors->get('delivery_time_days')" class="mt-1" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium">Proposta</label>
                            <textarea name="proposal" rows="4" class="mt-1 w-full rounded border-gray-300" required></textarea>
                            <x-input-error :messages="$errors->get('proposal')" class="mt-1" />
                        </div>
                        <div>
                            <button class="px-4 py-2 bg-indigo-600 text-white rounded">Enviar Lance</button>
                        </div>
                    </form>
                </div>
            @endif
        </div>
    </div>
</x-app-layout>