'use client';
import { useState } from 'react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const supabase = createSupabaseBrowser();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function sendMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000') + '/app' }
    });
    if (!error) setSent(true);
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md w-full border rounded-2xl p-6 bg-white">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <p className="text-sm text-zinc-600 mb-4">Use seu e-mail para receber um link mágico.</p>
        <input
          className="w-full border rounded-xl px-3 py-2 mb-3"
          placeholder="seuemail@exemplo.com"
          value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={sendMagicLink} className="w-full border rounded-xl px-3 py-2 hover:bg-zinc-50">Enviar link</button>
        {sent && <p className="text-green-600 text-sm mt-3">Link enviado! Verifique seu e-mail.</p>}
      </div>
    </div>
  );
}
