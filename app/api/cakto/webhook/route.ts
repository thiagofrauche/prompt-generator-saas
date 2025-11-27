import { NextResponse } from 'next/server';
import { createSupabaseService } from '@/lib/supabaseClient';
import type { GoTrueAdminApi, User } from '@supabase/supabase-js';

// Função para buscar usuário pelo e-mail usando listUsers (Supabase v2)
async function findUserByEmail(admin: GoTrueAdminApi, email: string): Promise<User | null> {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find(
      u => (u.email || '').toLowerCase() === email.toLowerCase()
    );
    if (found) return found;

    if (data.users.length < perPage) return null;
    page++;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Checar se o webhook é do tipo esperado
    if (body?.event !== 'order.approved') {
      return NextResponse.json({ ok: true });
    }

    const supabase = createSupabaseService();

    const email = body?.buyer?.email || '';
    if (!email) {
      return NextResponse.json({ error: 'Email não encontrado' }, { status: 400 });
    }

    // Buscar usuário
    let user = await findUserByEmail(supabase.auth.admin, email);

    // Criar usuário se não existir
    if (!user) {
      const { data: created, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

      if (error) {
        console.error('Erro ao criar usuário:', error);
        return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
      }

      user = created.user!;
    }

    // Aqui você adiciona lógica pós-compra (ex: liberar assinatura, créditos etc.)

    return NextResponse.json({ ok: true, userId: user.id });

  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err?.message },
      { status: 500 }
    );
  }
}
