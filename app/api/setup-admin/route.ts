import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Usa o Service Role Key para criar usuário diretamente
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const adminEmail = "amoraaipromptmaker@gmail.com"
    const adminPassword = "thiago142208.at"

    console.log("[v0] Verificando se usuário já existe...")

    // Verifica se o usuário já existe
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users.find((u) => u.email === adminEmail)

    let userId: string

    if (existingUser) {
      console.log("[v0] Usuário já existe:", existingUser.id)
      userId = existingUser.id
    } else {
      console.log("[v0] Criando novo usuário admin...")

      // Cria o usuário
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Confirma email automaticamente
        user_metadata: {
          full_name: "Administrador",
        },
      })

      if (createError) {
        console.error("[v0] Erro ao criar usuário:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      userId = newUser.user!.id
      console.log("[v0] Usuário criado com sucesso:", userId)
    }

    // Aguarda trigger criar o perfil (ou cria manualmente)
    console.log("[v0] Aguardando criação do perfil...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Atualiza ou cria o perfil para ser admin
    console.log("[v0] Configurando permissões de admin...")
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        full_name: "Administrador",
        is_admin: true,
        payment_status: "paid",
        payment_expires_at: null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (profileError) {
      console.error("[v0] Erro ao atualizar perfil:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    console.log("[v0] Admin configurado com sucesso!")

    return NextResponse.json({
      success: true,
      message: "Usuário admin criado com sucesso!",
      email: adminEmail,
      userId: userId,
    })
  } catch (error: any) {
    console.error("[v0] Erro geral:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
