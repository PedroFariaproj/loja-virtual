/**
 * Script para criar um administrador no Supabase
 * 
 * Este script cria um novo usuário no Supabase Auth e insere o perfil correspondente
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente (NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY)
 * 2. Execute: node scripts/create-admin.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Criar cliente Supabase com permissões de admin (Service Role)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Dados do novo administrador
const adminData = {
  email: 'sitesvortex@gmail.com',
  password: 'Vortex@2024!Dev', // Senha segura gerada
  name: 'vortex',
}

async function createAdmin() {
  try {
    console.log('🔄 Criando administrador...')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Nome: ${adminData.name}`)

    // 1. Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: adminData.email,
      password: adminData.password,
      email_confirm: true, // Confirmar email automaticamente
    })

    if (authError) {
      throw new Error(`Erro ao criar usuário: ${authError.message}`)
    }

    console.log('✅ Usuário criado no Supabase Auth')

    // 2. Criar perfil na tabela profiles
    const { error: profileError } = await supabase.from('profiles').insert({
      id: authUser.user.id,
      email: adminData.email,
      name: adminData.name,
      active: true,
    })

    if (profileError) {
      // Se falhar, deletar o usuário que foi criado
      await supabase.auth.admin.deleteUser(authUser.user.id)
      throw new Error(`Erro ao criar perfil: ${profileError.message}`)
    }

    console.log('✅ Perfil criado na tabela profiles')

    // Sucesso!
    console.log('\n✨ Administrador criado com sucesso!\n')
    console.log('📋 Credenciais de acesso:')
    console.log(`   Email: ${adminData.email}`)
    console.log(`   Senha: ${adminData.password}`)
    console.log('\n🔗 Acesse: http://localhost:3000/admin/login')
    console.log('\n⚠️  Guarde a senha em local seguro. Você pode alterá-la após fazer login.\n')

  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

// Executar
createAdmin()
