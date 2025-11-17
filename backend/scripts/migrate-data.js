const mysql = require('mysql2/promise')
const { Client } = require('pg')
const bcrypt = require('bcryptjs')
require('dotenv').config()

class DataMigration {
  constructor() {
    // MySQL connection
    this.mysqlConfig = {
      host: 'localhost',
      user: 'kaddeshs_novo',
      password: 'Teste@12345',
      database: 'kaddeshs_novo'
    }

    // PostgreSQL connection
    this.pgConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'kadesh_modern',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password'
    }

    this.mysqlConn = null
    this.pgClient = null
    this.stats = {
      users: { total: 0, migrated: 0, errors: 0 },
      projects: { total: 0, migrated: 0, errors: 0 },
      bids: { total: 0, migrated: 0, errors: 0 },
      total_time: 0
    }
  }

  async connect() {
    console.log('🔌 Conectando aos bancos de dados...')
    
    try {
      // Connect to MySQL
      this.mysqlConn = await mysql.createConnection(this.mysqlConfig)
      console.log('✅ MySQL conectado')

      // Connect to PostgreSQL
      this.pgClient = new Client(this.pgConfig)
      await this.pgClient.connect()
      console.log('✅ PostgreSQL conectado')

    } catch (error) {
      console.error('❌ Erro de conexão:', error.message)
      process.exit(1)
    }
  }

  async disconnect() {
    if (this.mysqlConn) await this.mysqlConn.end()
    if (this.pgClient) await this.pgClient.end()
    console.log('🔌 Conexões fechadas')
  }

  async migrateUsers() {
    console.log('\n👥 Migrando usuários...')
    
    try {
      // Get users from MySQL
      const [mysqlUsers] = await this.mysqlConn.execute(`
        SELECT id, name, email, password, user_type, phone, created_at, updated_at
        FROM users 
        WHERE active = 1
      `)

      this.stats.users.total = mysqlUsers.length
      console.log(`📊 Encontrados ${mysqlUsers.length} usuários`)

      for (const user of mysqlUsers) {
        try {
          // Map user type
          let userType = 'client'
          if (user.user_type === 'freelancer' || user.user_type === 'provider') {
            userType = 'provider'
          }

          // Hash password if not already hashed
          let passwordHash = user.password
          if (!user.password.startsWith('$2')) {
            passwordHash = await bcrypt.hash(user.password, 12)
          }

          // Insert into PostgreSQL
          await this.pgClient.query(`
            INSERT INTO users (
              id, name, email, password_hash, type, phone, status,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              phone = EXCLUDED.phone,
              updated_at = EXCLUDED.updated_at
          `, [
            user.id,
            user.name,
            user.email,
            passwordHash,
            userType,
            user.phone || null,
            'active',
            user.created_at,
            user.updated_at || user.created_at
          ])

          this.stats.users.migrated++
          
          if (this.stats.users.migrated % 10 === 0) {
            console.log(`   ➤ ${this.stats.users.migrated}/${this.stats.users.total} usuários migrados`)
          }

        } catch (error) {
          console.error(`❌ Erro ao migrar usuário ${user.email}:`, error.message)
          this.stats.users.errors++
        }
      }

      console.log(`✅ Usuários: ${this.stats.users.migrated} migrados, ${this.stats.users.errors} erros`)

    } catch (error) {
      console.error('❌ Erro na migração de usuários:', error.message)
    }
  }

  async migrateProjects() {
    console.log('\n📋 Migrando projetos...')
    
    try {
      // Get projects from MySQL
      const [mysqlProjects] = await this.mysqlConn.execute(`
        SELECT 
          id, user_id as client_id, title, description, category,
          budget, deadline, requirements, status, created_at, updated_at
        FROM projects
      `)

      this.stats.projects.total = mysqlProjects.length
      console.log(`📊 Encontrados ${mysqlProjects.length} projetos`)

      for (const project of mysqlProjects) {
        try {
          // Map project status
          let projectStatus = 'open'
          if (project.status === 'closed' || project.status === 'completed') {
            projectStatus = 'completed'
          } else if (project.status === 'in_progress') {
            projectStatus = 'in_progress'
          } else if (project.status === 'cancelled') {
            projectStatus = 'cancelled'
          }

          // Insert into PostgreSQL
          await this.pgClient.query(`
            INSERT INTO projects (
              id, client_id, title, description, category, budget,
              deadline, requirements, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              budget = EXCLUDED.budget,
              updated_at = EXCLUDED.updated_at
          `, [
            project.id,
            project.client_id,
            project.title,
            project.description,
            project.category || 'outros',
            parseFloat(project.budget) || 0,
            project.deadline,
            project.requirements,
            projectStatus,
            project.created_at,
            project.updated_at || project.created_at
          ])

          this.stats.projects.migrated++
          
          if (this.stats.projects.migrated % 5 === 0) {
            console.log(`   ➤ ${this.stats.projects.migrated}/${this.stats.projects.total} projetos migrados`)
          }

        } catch (error) {
          console.error(`❌ Erro ao migrar projeto ${project.id}:`, error.message)
          this.stats.projects.errors++
        }
      }

      console.log(`✅ Projetos: ${this.stats.projects.migrated} migrados, ${this.stats.projects.errors} erros`)

    } catch (error) {
      console.error('❌ Erro na migração de projetos:', error.message)
    }
  }

  async migrateBids() {
    console.log('\n💰 Migrando propostas...')
    
    try {
      // Get bids from MySQL
      const [mysqlBids] = await this.mysqlConn.execute(`
        SELECT 
          id, project_id, user_id as provider_id, amount, proposal,
          delivery_time, status, created_at, updated_at
        FROM bids
      `)

      this.stats.bids.total = mysqlBids.length
      console.log(`📊 Encontradas ${mysqlBids.length} propostas`)

      for (const bid of mysqlBids) {
        try {
          // Map bid status
          let bidStatus = 'pending'
          if (bid.status === 'accepted') {
            bidStatus = 'accepted'
          } else if (bid.status === 'rejected') {
            bidStatus = 'rejected'
          } else if (bid.status === 'withdrawn') {
            bidStatus = 'withdrawn'
          }

          // Insert into PostgreSQL
          await this.pgClient.query(`
            INSERT INTO bids (
              id, project_id, provider_id, amount, proposal,
              delivery_time, status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (project_id, provider_id) DO UPDATE SET
              amount = EXCLUDED.amount,
              proposal = EXCLUDED.proposal,
              status = EXCLUDED.status,
              updated_at = EXCLUDED.updated_at
          `, [
            bid.id,
            bid.project_id,
            bid.provider_id,
            parseFloat(bid.amount) || 0,
            bid.proposal || '',
            bid.delivery_time || null,
            bidStatus,
            bid.created_at,
            bid.updated_at || bid.created_at
          ])

          this.stats.bids.migrated++
          
          if (this.stats.bids.migrated % 10 === 0) {
            console.log(`   ➤ ${this.stats.bids.migrated}/${this.stats.bids.total} propostas migradas`)
          }

        } catch (error) {
          console.error(`❌ Erro ao migrar proposta ${bid.id}:`, error.message)
          this.stats.bids.errors++
        }
      }

      console.log(`✅ Propostas: ${this.stats.bids.migrated} migradas, ${this.stats.bids.errors} erros`)

    } catch (error) {
      console.error('❌ Erro na migração de propostas:', error.message)
    }
  }

  async updateSequences() {
    console.log('\n🔄 Atualizando sequências PostgreSQL...')
    
    try {
      // Since we're using UUIDs, we don't need to update sequences
      // But we can update statistics for better performance
      
      await this.pgClient.query('ANALYZE users;')
      await this.pgClient.query('ANALYZE projects;')
      await this.pgClient.query('ANALYZE bids;')
      
      console.log('✅ Estatísticas atualizadas')
    } catch (error) {
      console.error('❌ Erro ao atualizar sequências:', error.message)
    }
  }

  async validateMigration() {
    console.log('\n🔍 Validando migração...')
    
    try {
      // Count records in PostgreSQL
      const userCount = await this.pgClient.query('SELECT COUNT(*) FROM users')
      const projectCount = await this.pgClient.query('SELECT COUNT(*) FROM projects')
      const bidCount = await this.pgClient.query('SELECT COUNT(*) FROM bids')

      console.log('📊 Registros no PostgreSQL:')
      console.log(`   Usuários: ${userCount.rows[0].count}`)
      console.log(`   Projetos: ${projectCount.rows[0].count}`)
      console.log(`   Propostas: ${bidCount.rows[0].count}`)

      // Validate data integrity
      const orphanBids = await this.pgClient.query(`
        SELECT COUNT(*) FROM bids b
        LEFT JOIN projects p ON b.project_id = p.id
        LEFT JOIN users u ON b.provider_id = u.id
        WHERE p.id IS NULL OR u.id IS NULL
      `)

      const orphanProjects = await this.pgClient.query(`
        SELECT COUNT(*) FROM projects p
        LEFT JOIN users u ON p.client_id = u.id
        WHERE u.id IS NULL
      `)

      console.log('🔍 Validação de integridade:')
      console.log(`   Propostas órfãs: ${orphanBids.rows[0].count}`)
      console.log(`   Projetos órfãos: ${orphanProjects.rows[0].count}`)

      if (orphanBids.rows[0].count === '0' && orphanProjects.rows[0].count === '0') {
        console.log('✅ Integridade dos dados validada')
      } else {
        console.log('⚠️  Problemas de integridade encontrados')
      }

    } catch (error) {
      console.error('❌ Erro na validação:', error.message)
    }
  }

  async run() {
    const startTime = Date.now()
    
    console.log('🚀 Iniciando migração MySQL → PostgreSQL')
    console.log('=' * 50)

    try {
      await this.connect()
      
      await this.migrateUsers()
      await this.migrateProjects()
      await this.migrateBids()
      await this.updateSequences()
      await this.validateMigration()

      this.stats.total_time = Math.round((Date.now() - startTime) / 1000)

      console.log('\n🎉 Migração concluída!')
      console.log('=' * 50)
      console.log('📊 Resumo da migração:')
      console.log(`   Usuários: ${this.stats.users.migrated}/${this.stats.users.total} (${this.stats.users.errors} erros)`)
      console.log(`   Projetos: ${this.stats.projects.migrated}/${this.stats.projects.total} (${this.stats.projects.errors} erros)`)
      console.log(`   Propostas: ${this.stats.bids.migrated}/${this.stats.bids.total} (${this.stats.bids.errors} erros)`)
      console.log(`   Tempo total: ${this.stats.total_time}s`)

    } catch (error) {
      console.error('💥 Erro fatal na migração:', error.message)
      process.exit(1)
    } finally {
      await this.disconnect()
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new DataMigration()
  migration.run().catch(console.error)
}

module.exports = DataMigration
