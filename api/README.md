# Kadesh Backend - PHP Puro

Este é o backend da plataforma Kadesh, reescrito em PHP puro para substituir a versão original em Node.js.

## Requisitos

- PHP 8.1 ou superior
- Extensões PHP: `pdo_mysql`, `json`, `mbstring`, `curl`
- Servidor Web (Apache com `mod_rewrite` ou Nginx)
- MySQL 8.0+

## Configuração

1.  **Banco de Dados**: Importe o schema localizado em `backend/database/schema.sql` do repositório original para o seu banco de dados MySQL.
2.  **Variáveis de Ambiente**: Configure as seguintes variáveis no seu servidor ou em um arquivo `.env` (se usar um carregador de env):
    - `DB_HOST`: Host do banco de dados
    - `DB_NAME`: Nome do banco de dados
    - `DB_USER`: Usuário do banco
    - `DB_PASSWORD`: Senha do banco
    - `JWT_SECRET`: Chave secreta para geração de tokens
3.  **Servidor Web**:
    - **Apache**: O arquivo `.htaccess` já está incluído para gerenciar as rotas.
    - **Nginx**: Use a seguinte configuração de localização:
      ```nginx
      location /api {
          try_files $uri $uri/ /index.php?$query_string;
      }
      ```

## Estrutura de Pastas

- `api/`: Contém os endpoints da API organizados por módulos.
- `config/`: Configurações de banco de dados.
- `middleware/`: Middlewares de autenticação e permissões.
- `utils/`: Funções auxiliares e helpers.
- `uploads/`: Diretório para armazenamento de arquivos enviados.

## Funcionalidades Implementadas

A implementação atual cobre os pilares fundamentais da plataforma Kadesh, garantindo a paridade de recursos com o backend original. O sistema de **Autenticação** gerencia o ciclo de vida do usuário, incluindo registro, login e validação de tokens JWT. A **Gestão de Projetos** permite a listagem dinâmica e a criação de novas oportunidades, enquanto o **Sistema de Lances** possibilita a interação entre prestadores e clientes. Além disso, o **Dashboard** fornece estatísticas consolidadas em tempo real para ambos os perfis de usuário. A arquitetura foi desenhada de forma modular, facilitando a expansão para os endpoints de pagamentos e notificações.

## Observações

- O sistema utiliza JWT para autenticação, implementado de forma nativa em `utils/helpers.php`.
- As senhas são criptografadas usando `password_hash` com algoritmo BCRYPT.
- Todas as respostas seguem o padrão JSON.
