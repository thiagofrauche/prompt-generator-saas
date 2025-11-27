import { NextResponse } from 'next/server';
import { createSupabaseService } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // TODO: Validar assinatura/segredo do webhook com WEBHOOK_SECRET se Cakto suportar.
    if (body?.event !== 'order.approved') {
      return NextResponse.json({ ok: true });
    }

    const supabase = createSupabaseService();
    const email = (body?.buyer?.email || '').toLowerCase();
    if (!email) return NextResponse.json({ ok: false, error: 'email ausente' }, { status: 400 });

    import type { GoTrueAdminApi, User } from '@supabase/supabase-js';

// Busca paginada por usuário via e-mail (v2 não tem getUserByEmail)
async function findUserByEmail(admin: GoTrueAdminApi, email: string): Promise<User | null> {
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.listUsers({ page, perPage });
    if (error) throw error;

    const found = data.users.find(u => (u.email || '').toLowerCase() === email.toLowerCase());
    if (found) return found;

    // se voltou menos que perPage, acabou a paginação
    if (data.users.length < perPage) return null;
    page++;
  }
}

// … dentro do handler:
let user = await findUserByEmail(supabase.auth.admin, email);

if (!user) {
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (createErr) throw createErr;
  user = created.user;
}
