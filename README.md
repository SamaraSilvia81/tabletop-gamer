# TableTop — Game Tracker v7

Registre pontos, acompanhe partidas e saiba quem manda.

## Deploy no Vercel

1. Crie um repositório no GitHub e suba estes arquivos
2. Conecte o repo no [Vercel](https://vercel.com)
3. Deploy automático — é só um HTML estático

## Supabase (banco de dados + auth)

### 1. Criar projeto
- Acesse [supabase.com](https://supabase.com) e crie um projeto

### 2. Rodar o SQL
- Vá em **SQL Editor** no dashboard
- Cole e execute o conteúdo de `supabase-setup.sql`
- Isso cria as tabelas `games`, `matches` e `user_preferences` com RLS

### 3. Configurar Google OAuth
- No Supabase: **Authentication → Providers → Google → Ativar**
- No [Google Cloud Console](https://console.cloud.google.com):
  - **APIs & Services → Credentials → Create OAuth Client ID**
  - Tipo: Web Application
  - Authorized redirect URIs: `https://SEU-PROJETO.supabase.co/auth/v1/callback`
- Cole o Client ID e Client Secret no Supabase

### 4. Atualizar credenciais
- Abra `index.html` e atualize `SUPABASE_URL` e `SUPABASE_ANON_KEY` se necessário

## Stack
- **Frontend:** HTML + CSS + JS vanilla (single file)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Deploy:** Vercel (static)
- **Fontes:** DM Sans, Fredoka, Unbounded, Playfair Display, JetBrains Mono, Silkscreen
- **Ícones:** Phosphor Icons + pixel art SVG custom
