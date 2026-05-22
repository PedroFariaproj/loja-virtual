#!/usr/bin/env node

/**
 * Script para atualizar a senha do administrador
 * 
 * Uso:
 *   node scripts/update-admin-password.mjs
 * 
 * Este script:
 * 1. Conecta ao Supabase usando a SERVICE_ROLE_KEY
 * 2. Atualiza a senha do usuário administrador
 * 3. Mostra a nova senha para confirmação
 * 
 * Importante: A SERVICE_ROLE_KEY deve estar no arquivo .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no arquivo .env.local')
  process.exit(1)
}

// Criar cliente Supabase com SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, serviceRoleKey)

const EMAIL = 'sitesvortex@gmail.com'
const NEW_PASSWORD = '29111999'

async function updateAdminPassword() {
  try {
    console.log('🔄 Atualizando senha do administrador...')
    console.log(`📧 Email: ${EMAIL}`)

    // Atualizar a senha do usuário
    const { data, error } = await supabase.auth.admin.updateUserById(
      EMAIL, // Usar email como identificador (será encontrado pelo sistema)
      {
        password: NEW_PASSWORD,
      }
    )

    if (error) {
      // Se não funcionar com email, precisamos encontrar o usuário primeiro
      console.log('ℹ️ Buscando usuário por email...')
      
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        throw new Error(`Erro ao listar usuários: ${listError.message}`)
      }

      const user = users?.users?.find(u => u.email === EMAIL)
      
      if (!user) {
        throw new Error(`❌ Usuário com email ${EMAIL} não encontrado!`)
      }

      // Agora atualizar com o UUID do usuário
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          password: NEW_PASSWORD,
        }
      )

      if (updateError) {
        throw new Error(`Erro ao atualizar senha: ${updateError.message}`)
      }

      console.log('✅ Senha atualizada com sucesso!')
      console.log('\n📋 Credenciais do Administrador:')
      console.log(`   Email: ${EMAIL}`)
      console.log(`   Senha: ${NEW_PASSWORD}`)
      console.log('\n🔗 Acesse: http://localhost:3000/admin/login')
    } else {
      console.log('✅ Senha atualizada com sucesso!')
      console.log('\n📋 Credenciais do Administrador:')
      console.log(`   Email: ${EMAIL}`)
      console.log(`   Senha: ${NEW_PASSWORD}`)
      console.log('\n🔗 Acesse: http://localhost:3000/admin/login')
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar senha:', error.message)
    process.exit(1)
  }
}

updateAdminPassword()
