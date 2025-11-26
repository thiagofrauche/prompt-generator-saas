# Prompt Generator SaaS (Next.js + Supabase + Cakto)

Este projeto é um **esqueleto pronto** para você vender acesso ao seu gerador de prompts usando **Cakto**.

## 1) Pré-requisitos
- Node.js LTS (>=18)
- Conta Supabase criada

## 2) Instalação
```bash
pnpm i   # ou npm i / yarn
cp .env.local.example .env.local
```

Preencha `.env.local` com as chaves do Supabase (URL + ANON + SERVICE_ROLE).

## 3) Banco de dados
No Supabase SQL Editor, rode o conteúdo de `supabase/schema.sql`.

## 4) Executar
```bash
pnpm dev
```
Acesse: http://localhost:3000

## 5) Login
- Vá em /login e insira seu e-mail para receber **magic link**.
- Ajuste `NEXT_PUBLIC_SITE_URL` no `.env.local` para o seu domínio.

## 6) Webhook da Cakto
- Na Cakto, cadastre um webhook apontando para:
  - **POST** `{SEU_DOMINIO}/api/cakto/webhook`
- Em `app/api/cakto/webhook/route.ts` você pode validar assinatura e configurar créditos/planos.
- Após a compra, o webhook cria/ativa a licença do usuário no Supabase (por e‑mail).

## 7) Liberar o gerador completo
- Substitua `components/GeneratorPlaceholder.tsx` pelo **gerador completo** que você tem no canvas do ChatGPT (copiar e colar).

## 8) Deploy
- Recomendo **Vercel**. Configure as variáveis de ambiente no painel da Vercel.
- No Supabase, adicione seu domínio em Authentication → URL de retorno.

## 9) Planos
- Mensal: controla por `expires_at`.
- Créditos: decrementa `licenses.credits` quando o usuário gerar prompt.

## 10) Suporte
Qualquer dúvida, fale comigo que ajusto tudo com você.
