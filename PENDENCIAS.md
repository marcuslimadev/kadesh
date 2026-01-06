# PENDENCIAS

## Lobby / Leilao
- Validar layout com anuncios nos dois lados e foco principal no leilao (cabecalho mais baixo, filtros menos dominantes, status cards reduzidos se necessario).
- Confirmar CTA de anuncios vai para /ads (contratacao de planos) e nao abre outro lobby.
- Confirmar CTA de lance no lobby permite enviar proposta sem entrar em cada anuncio (modal rapido ou botao direto).
- Garantir nomes do contratante aparecem no topo do anuncio e identificacao do autor no card/detalhe.
- Garantir valores/prazos legiveis e com contraste alto (sem branco em branco/sem cinza claro em fundo claro).
- Garantir grid do lobby e grid de "Meus Projetos" usam o mesmo padrao visual.
- Garantir fotos/carrossel aparecem nos cards e no detalhe do projeto.
- Garantir prazos/valores aparecem tanto no lobby quanto no detalhe.

## Fluxo de propostas / lances
- Lance salvo deve aparecer abaixo do anuncio e refletir para contratante.
- Lobby e dashboard devem atualizar apos criacao de anuncio e envio de proposta.
- Exibir campo de proposta de forma destacada na tela do prestador.

## Autenticacao / Sidebar
- Sidebar e menu mobile devem aparecer apos login com credenciais administrativas.
- Corrigir estado de autenticacao quando token estiver como string "undefined" no localStorage.
- Validar que usuarios do tipo "both" recebem menus de contratante e prestador.

## Admin
- Implementar endpoints admin: dashboard, users, projects, payments e promote (backend PHP).
- Corrigir AdminAdvertisements para usar token correto e base URL do VITE_API_URL.
- Exibir listas reais de usuarios/projetos/pagamentos no painel.
- Garantir que anuncios aparecem no admin e parametros (percentuais, ganhos, validacao de cadastros) estao operacionais.

## Padrao de qualidade
- Remover textos com caracteres quebrados (mojibake) em UI e mensagens.
- Evitar fontes brancas sobre fundo branco e tons claros sem contraste.
- Validar que o leilao e o carro-chefe visual do site.
