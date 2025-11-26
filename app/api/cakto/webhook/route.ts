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

    // garantir usuário
    let { data: userRes } = await supabase.auth.admin.getUserByEmail(email);
    let user = userRes?.user;
    if (!user) {
      const created = await supabase.auth.admin.createUser({ email, email_confirm: true });
      user = created.data.user!;
    }

    const caktoOrderId = String(body?.order?.id || '');
    const caktoProductId = String(body?.product?.id || '');
    const plan = /cr[eé]dito/i.test(body?.product?.name || '') ? 'creditos' : 'mensal';

    const expiresAt = plan === 'mensal'
      ? new Date(Date.now() + 30*24*60*60*1000).toISOString()
      : null;
    const credits = plan === 'creditos' ? 200 : 0;

    await supabase.from('licenses').upsert({
      user_id: user.id,
      cakto_order_id: caktoOrderId,
      cakto_product_id: caktoProductId,
      status: 'active',
      plan,
      credits,
      expires_at: expiresAt as any
    }, { onConflict: 'cakto_order_id' });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
