# Mapeamento de Schema PostgreSQL → MySQL

## Tabela: users

| PostgreSQL | MySQL | Notas |
|------------|-------|-------|
| `password_hash` | `password` | Hash bcrypt |
| `type` | `user_type` | ENUM('contractor','provider','both','admin') |
| `status` | `is_active` | Boolean (0/1) no MySQL |
| `last_login` | `last_activity` | TIMESTAMP |

## Tabela: projects

| PostgreSQL | MySQL | Notas |
|------------|-------|-------|
| `client_id` | `contractor_id` | FK para users |
| `deadline` | `bidding_ends_at` | Data limite do leilão |
| `budget` | `max_budget` | DECIMAL(10,2) |
| `status` | `status` | ENUM mas valores diferentes |

## Status do Projeto

**PostgreSQL:**
- `open`, `in_progress`, `completed`, `cancelled`

**MySQL:**
- `open`, `bidding`, `awarded`, `in_progress`, `completed`, `cancelled`

## Observações Críticas

1. **MySQL é um sistema Laravel existente** com muito mais tabelas
2. **Não sobrescrever dados** - este é um banco em uso
3. **Criar migrations** ao invés de DROP/CREATE
4. **Queries precisam ser adaptadas** para nomenclatura MySQL
5. **Scheduler de leilão** precisa usar `bidding_ends_at` ao invés de `deadline`
6. **Sistema de carteira** pode estar em `wallet_transactions` ao invés de tabela separada

## Próximos Passos

1. Adaptar todas as queries nas rotas para usar nomenclatura MySQL
2. Verificar se `wallet_transactions` tem a estrutura esperada
3. Testar login admin com schema MySQL
4. Adaptar scheduler de leilão para `bidding_ends_at`
5. Verificar compatibilidade de `bids`, `contracts`, `milestones`
