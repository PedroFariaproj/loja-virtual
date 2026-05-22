/**
 * API Route para criar administrador inicial
 * 
 * Esta rota cria um administrador usando a Service Role Key do Supabase
 * IMPORTANTE: Esta rota deve ser removida ou protegida em produção
 */

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const { email, password, name } = await request.json()

    // Validar campos obrigatórios
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Configuração do Supabase não encontrada' },
        { status: 500 }
      )
    }

    // Criar cliente Supabase com Service Role (permissões de admin)
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 1. Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
    })

    if (authError) {
      console.error('[v0] Erro ao criar usuário:', authError)
      return NextResponse.json(
        { error: `Erro ao criar usuário: ${authError.message}` },
        { status: 400 }
      )
    }

    // 2. Criar perfil na tabela profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      email,
      name,
      active: true,
    })

    if (profileError) {
      // Se falhar, deletar o usuário que foi criado
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      console.error('[v0] Erro ao criar perfil:', profileError)
      return NextResponse.json(
        { error: `Erro ao criar perfil: ${profileError.message}` },
        { status: 400 }
      )
    }

    // Sucesso!
    return NextResponse.json({
      success: true,
      message: 'Administrador criado com sucesso!',
      user: {
        id: authData.user.id,
        email,
        name,
      },
    })

  } catch (error) {
    console.error('[v0] Erro interno:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
