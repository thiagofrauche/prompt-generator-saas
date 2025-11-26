import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/app')) {
    // Verificação simples de cookie de sessão do Supabase
    const hasSession = req.cookies.get('sb-access-token') || req.cookies.get('sb-refresh-token');
    if (!hasSession) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*']
};
