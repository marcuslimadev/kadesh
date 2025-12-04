<template>
  <div class="max-w-6xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-6 text-primary-900">Tutorial Kaddesh: Plataforma de Oportunidades</h1>
    <p class="mb-8 text-lg text-gray-700">Este tutorial foi feito para qualquer pessoa entender como usar a plataforma Kaddesh, mesmo sem experiência. Siga cada passo e descubra todas as funcionalidades!</p>

    <!-- Seções Iniciais Comuns -->
    <section class="mb-10 bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-2xl font-semibold mb-4 text-primary-700">1. Cadastro e Login (Primeiro acesso)</h2>
      <ul class="list-disc ml-6 text-gray-800 space-y-2">
        <li>Acesse a Home e clique em <strong>Cadastrar</strong>.</li>
        <li>Preencha seu nome, e-mail e senha.</li>
        <li>Confirme o cadastro pelo e-mail recebido (se configurado).</li>
        <li>Após login, você verá seu painel pessoal.</li>
        <li><strong>Novidade! 🔄</strong> Agora você pode alternar entre <strong>Contratante</strong> e <strong>Prestador</strong> a qualquer momento usando o botão <strong>"Ver como"</strong> no topo da página.
          <ul class="list-circle ml-6 mt-2 text-gray-700">
            <li><strong>Contratante</strong> – visualize como quem contrata serviços e publica projetos</li>
            <li><strong>Prestador</strong> – visualize como quem oferece serviços e envia propostas</li>
            <li>Você não precisa criar contas separadas! Use o switch para trocar de perfil instantaneamente.</li>
          </ul>
        </li>
      </ul>
    </section>

    <section class="mb-10 bg-white p-6 rounded-lg shadow-sm">
      <h2 class="text-2xl font-semibold mb-4 text-primary-700">2. Lobby de Leilões Reversos</h2>
      <p class="text-gray-800 mb-3">Após Login, você verá o <strong>Lobby de Leilões Reversos</strong> onde conseguirá visualizar todas as propostas ofertadas e todas as disputas em negociação, com opções de <strong>Filtros</strong> e <strong>Botões de ações rápidas</strong>.</p>
      <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mt-4">
        <p class="text-sm text-amber-800">
          <strong>💡 Dica:</strong> O conteúdo do Lobby muda conforme o perfil selecionado no switch "Ver como". Como Contratante, você vê projetos publicados. Como Prestador, você vê oportunidades para dar lances.
        </p>
      </div>
    </section>

    <!-- Divisão em Duas Torres -->
    <div class="mb-6 bg-gradient-to-r from-amber-100 to-green-100 p-6 rounded-xl border-2 border-gray-300">
      <h2 class="text-2xl font-bold mb-3 text-gray-900 text-center">🔄 Como usar o Switch "Ver como"</h2>
      <p class="text-gray-800 text-center mb-4">
        A Kaddesh agora oferece <strong>perfis unificados</strong>! Você pode alternar entre Contratante e Prestador usando o botão no topo da página.
      </p>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg">
          <h3 class="font-semibold text-amber-700 mb-2">👔 Modo Contratante</h3>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Criar e publicar projetos</li>
            <li>• Ver propostas recebidas</li>
            <li>• Gerenciar contratos como cliente</li>
            <li>• Liberar pagamentos por milestone</li>
          </ul>
        </div>
        <div class="bg-white p-4 rounded-lg">
          <h3 class="font-semibold text-green-700 mb-2">⚙️ Modo Prestador</h3>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Buscar oportunidades de trabalho</li>
            <li>• Enviar propostas competitivas</li>
            <li>• Gerenciar contratos como executor</li>
            <li>• Receber pagamentos por entregas</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-8 mb-12">
      <!-- Torre: CONTRATANTE -->
      <div class="bg-amber-50 p-6 rounded-xl border-2 border-amber-200">
        <h2 class="text-3xl font-bold mb-6 text-amber-900 text-center">🏢 Contratante</h2>
        
        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">3. ABA DASHBOARD</h3>
          <p class="text-gray-800 mb-2">Após login, você verá seu painel pessoal onde verá todo o dashboard contendo:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Propostas recebidas</li>
            <li>Valores investidos</li>
            <li>Projetos em andamento</li>
            <li>Notificações</li>
          </ul>
          <p class="text-gray-800 mt-2">Logo abaixo, verá botões de <strong>ações rápidas</strong> como acesso às próximas abas, inclusão de novos projetos, Lobby de Leilões, Carteira, etc.</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">4. ABA PROJETOS</h3>
          <p class="text-gray-800 mb-2"><strong>Criar Projeto:</strong></p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>No menu, clique em <strong>Publicar Projeto</strong>.</li>
            <li>Descreva o que precisa, defina parâmetros, orçamento e prazo.</li>
            <li>Adicione anexos se necessário.</li>
            <li>Seu projeto ficará visível para profissionais darem lances no Lobby de Leilão Reverso.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">5. ABA MEUS PROJETOS</h3>
          <p class="text-gray-800 mb-2">Nesta aba você tem acesso ao <strong>gerenciamento de seus projetos publicados</strong>:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Acompanhamentos</li>
            <li>Chats</li>
            <li>Ações e edições</li>
            <li>Formalização do aceite das propostas e início do contrato</li>
          </ul>
          <p class="text-gray-800 mt-3">O valor do projeto fica protegido em <strong>escrow (milestones)</strong>. Você pode acompanhar o progresso e liberar pagamentos conforme entregas.</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1 mt-2">
            <li>O projeto pode ser dividido em <strong>milestones (etapas)</strong>.</li>
            <li>Você libera o pagamento de cada etapa após aprovação.</li>
            <li>O Prestador só receberá após a entrega ser aprovada.</li>
            <li>Segurança total para ambos!</li>
          </ul>
          <p class="text-gray-800 mt-3">Após finalizar o contrato, você deve pontuar o Prestador com <strong>reviews</strong> (avaliações contendo estrelas e possibilidades de comentários em texto).</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">6. ABA CARTEIRA</h3>
          <p class="text-gray-800 mb-2">Nesta aba você consegue acompanhar sua carteira com opções de:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Inclusão e retirada de valores</li>
            <li>Direcionamento e pagamentos extra projetos</li>
            <li>Extratos de pagamentos</li>
            <li>Liberar ou reembolsar valores</li>
          </ul>
          <p class="text-gray-800 mt-2">Foco em <strong>transparência e acompanhamento financeiro</strong> dentro da plataforma.</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">📊 Após toda sua experiência na plataforma</h3>
          <p class="text-gray-800 mb-2">Volte ao Painel Dashboard e:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Veja gráficos e relatórios (em constante evolução)</li>
            <li>Acompanhe seus projetos, avaliações e convites</li>
            <li>Sequencie novas ações</li>
            <li>Sugira Melhorias na plataforma</li>
            <li>Desfrute da economia e qualidade proporcionada por esta ferramenta</li>
          </ul>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-amber-800">💡 Dicas Finais (Contratante)</h3>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Use sempre o chat para registrar acordos.</li>
            <li>Libere milestones só após entrega aprovada.</li>
            <li>Deixe reviews detalhados para ajudar outros usuários.</li>
            <li>Em caso de dúvida, acesse o painel de ajuda ou contate o suporte.</li>
          </ul>
        </section>
      </div>

      <!-- Torre: PRESTADOR -->
      <div class="bg-green-50 p-6 rounded-xl border-2 border-green-200">
        <h2 class="text-3xl font-bold mb-6 text-green-900 text-center">👷 Prestador</h2>
        
        <p class="text-gray-700 mb-6 text-center italic">Passos 1 e 2 são iguais para todos</p>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">3. ABA DASHBOARD</h3>
          <p class="text-gray-800 mb-2">Após login, você verá seu painel pessoal com todo o dashboard contendo:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Propostas que você deu lance</li>
            <li>Valores recebidos/projetados</li>
            <li>Projetos em andamento</li>
            <li>Notificações</li>
          </ul>
          <p class="text-gray-800 mt-2">Logo abaixo, verá botões de <strong>ações rápidas</strong> como acesso às próximas abas, busca de novas propostas, Lobby de Leilões, Carteira, etc.</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">4. ABA MINHAS PROPOSTAS</h3>
          <p class="text-gray-800 mb-2">Nesta aba você acompanha os projetos em que você enviou propostas:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Visualizar os que estão em disputa</li>
            <li>Os vencidos</li>
            <li>Os finalizados, etc.</li>
          </ul>
          <p class="text-gray-800 mt-2">Tendo opções de <strong>Edição nas propostas enviadas</strong> e ações para alterações estratégicas.</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">5. CONTRATOS</h3>
          <p class="text-gray-800 mb-2">Gerencia todo o trabalho e pontua cada passo de sua execução em cada atuação de projeto:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Acompanha as <strong>Liberações de Pagamentos</strong></li>
            <li>Avaliações e Orientações do Contratante</li>
            <li>Pontua alterações operacionais em tempo real no <strong>Chat</strong> com o Contratante (Mensagens são instantâneas e ficam registradas.)</li>
          </ul>
          <p class="text-gray-800 mt-3">Após finalizar o contrato, você deve pontuar o Contratante com <strong>reviews</strong> (avaliações contendo estrelas e possibilidades de comentários em texto).</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1 mt-2">
            <li>Perfis públicos mostram reputação, portfólio e badges.</li>
            <li>Reviews passam por moderação para garantir qualidade.</li>
            <li>Transações de carteira são automáticas.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">6. ABA CARTEIRA</h3>
          <p class="text-gray-800 mb-2">Nesta aba você consegue acompanhar sua carteira com opções de:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Acompanhar seus ganhos</li>
            <li>Retirada de valores</li>
            <li>Recebimento de extra projetos</li>
            <li>Extratos</li>
            <li>Transferir ou reembolsar valores</li>
          </ul>
          <p class="text-gray-800 mt-2">Foco em <strong>transparência e acompanhamento financeiro</strong> dentro da plataforma.</p>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">📊 Após toda sua experiência na plataforma</h3>
          <p class="text-gray-800 mb-2">Volte ao Painel Dashboard e:</p>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Veja gráficos e relatórios (em constante evolução)</li>
            <li>Acompanhe seus Contratos, avaliações, ganhos e convites</li>
            <li>Sequencie novas ações</li>
            <li>Sugira Melhorias na plataforma</li>
            <li>Desfrute de seu lucro e qualidade proporcionada por esta ferramenta</li>
          </ul>
        </section>

        <section class="mb-8">
          <h3 class="text-xl font-semibold mb-3 text-green-800">💡 Dicas Finais (Prestador)</h3>
          <ul class="list-disc ml-6 text-gray-700 space-y-1">
            <li>Use sempre o chat para registrar acordos.</li>
            <li>Pontue bem suas entregas de etapas para receber as milestones após entrega aprovada.</li>
            <li>Deixe reviews detalhados para ajudar outros usuários.</li>
            <li>Em caso de dúvida, acesse o painel de ajuda ou contate o suporte.</li>
          </ul>
        </section>
      </div>
    </div>

    <!-- Mensagem Final -->
    <div class="mt-12 p-8 bg-gradient-to-r from-amber-100 to-green-100 rounded-xl text-center">
      <p class="text-lg font-semibold text-gray-800 mb-3">Fique sempre atento a novas ações e acessos em nossa plataforma</p>
      <p class="text-gray-700">Todas as funcionalidades estarão constantemente em processo de aprimoramentos em prol do melhor resultado ao Usuário.</p>
      <p class="text-xl font-bold text-primary-900 mt-6">Pronto! Agora você já sabe usar a Kaddesh como um profissional.</p>
      <span class="text-sm text-gray-600 block mt-2">Para dúvidas, consulte o painel de ajuda ou envie mensagem pelo chat.</span>
    </div>
  </div>
</template>

<script setup>
// Nenhuma lógica JS necessária para tutorial
</script>


