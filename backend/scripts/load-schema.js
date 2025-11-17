/* eslint-disable */
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

async function run() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://kadesh:kadesh@localhost:55432/kadesh'
  const client = new Client({ connectionString: databaseUrl, ssl: false })

  const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')

  try {
    console.log('🔌 Conectando ao PostgreSQL...')
    await client.connect()
    console.log('✅ Conectado.')

    console.log('🧹 Resetando schema (drop types/tables se existirem)...')
    // Execução direta do schema assume CREATE IF NOT EXISTS para extensões e CREATE puro para tabelas/tipos.
    // Para evitar conflitos em reexecuções locais, limpa objetos conhecidos.
    // Obs: Em produção, usar migrações. Aqui é apenas para E2E local.
    const dropSql = `
      DO $$ DECLARE r RECORD; BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN DROP TYPE user_type; END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN DROP TYPE user_status; END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN DROP TYPE project_status; END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bid_status') THEN DROP TYPE bid_status; END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN DROP TYPE payment_status; END IF;
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN DROP TYPE notification_type; END IF;
      END $$;`
    await client.query(dropSql)

    console.log('📦 Carregando schema.sql...')
    await client.query(schema)
    console.log('🎉 Schema aplicado com sucesso!')
  } catch (err) {
    console.error('❌ Erro ao aplicar schema:', err.message)
    process.exitCode = 1
  } finally {
    await client.end()
    console.log('🔌 Conexão encerrada.')
  }
}

run()
