# iPhone Premium Store - Loja Virtual

Sistema completo de loja virtual para venda de iPhones e smartphones premium.

## Visão Geral

Este é um sistema de e-commerce completo com:

- **Loja Pública**: Catálogo de produtos, página de detalhes, carrinho de compras
- **Painel Administrativo**: Gerenciamento de produtos, administradores e configurações
- **Integração WhatsApp**: Finalização de pedidos via WhatsApp
- **Autenticação**: Login seguro com Supabase Auth

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React, TypeScript
- **Estilização**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Gerenciamento de Estado**: Zustand

---

## Começando

### Pré-requisitos

- Node.js 18+ instalado
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) para deploy (opcional)

### Passo 1: Clonar o Projeto

```bash
git clone <url-do-repositorio>
cd iphone-premium-store
```

### Passo 2: Instalar Dependências

```bash
pnpm install
# ou
npm install
```

### Passo 3: Configurar o Supabase

#### 3.1 Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Escolha um nome e senha para o banco de dados
4. Aguarde a criação do projeto (pode levar alguns minutos)

#### 3.2 Obter as Chaves de API

1. No painel do Supabase, vá em **Settings > API**
2. Copie:
   - **Project URL** (será `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

#### 3.3 Criar as Tabelas

As tabelas já foram criadas automaticamente via migrations. Se precisar criar manualmente, execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Tabela de perfis de administradores
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  main_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de imagens dos produtos
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'iPhone Premium Store',
  whatsapp_number TEXT DEFAULT '',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0071E3',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO public.settings (store_name, whatsapp_number, primary_color)
VALUES ('iPhone Premium Store', '', '#0071E3')
ON CONFLICT DO NOTHING;
```

#### 3.4 Configurar Row Level Security (RLS)

Execute no SQL Editor:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete other profiles" ON public.profiles FOR DELETE USING (auth.uid() IS NOT NULL AND auth.uid() != id);

-- Políticas para products
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (active = true OR auth.uid() IS NOT NULL);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para product_images
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert product images" ON public.product_images FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update product images" ON public.product_images FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete product images" ON public.product_images FOR DELETE USING (auth.uid() IS NOT NULL);

-- Políticas para settings
CREATE POLICY "Anyone can view settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.settings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update settings" ON public.settings FOR UPDATE USING (auth.uid() IS NOT NULL);
```

#### 3.5 Configurar Storage

1. No Supabase, vá em **Storage**
2. Clique em **New bucket**
3. Nome: `products`
4. Marque **Public bucket**
5. Clique em **Create bucket**

Configure as políticas do Storage no SQL Editor:

```sql
-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND auth.uid() IS NOT NULL);
```

### Passo 4: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### Passo 5: Rodar Localmente

```bash
pnpm dev
# ou
npm run dev
```

Acesse `http://localhost:3000`

### Passo 6: Criar o Primeiro Administrador

1. Acesse `http://localhost:3000/setup`
2. Preencha nome, email e senha
3. Clique em "Criar Administrador"
4. Você será redirecionado para o painel admin

---

## Estrutura do Projeto

```
├── app/
│   ├── page.tsx                 # Página inicial da loja
│   ├── produtos/
│   │   ├── page.tsx             # Catálogo de produtos
│   │   └── [id]/page.tsx        # Detalhes do produto
│   ├── carrinho/page.tsx        # Carrinho de compras
│   ├── admin/
│   │   ├── login/page.tsx       # Login do admin
│   │   └── (dashboard)/
│   │       ├── page.tsx         # Dashboard
│   │       ├── produtos/        # Gerenciar produtos
│   │       ├── administradores/ # Gerenciar admins
│   │       └── configuracoes/   # Configurações
│   ├── setup/page.tsx           # Configuração inicial
│   └── auth/
│       ├── callback/route.ts    # Callback de autenticação
│       └── error/page.tsx       # Erro de autenticação
├── components/
│   ├── store/                   # Componentes da loja
│   ├── admin/                   # Componentes do admin
│   └── ui/                      # Componentes shadcn/ui
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Cliente para o browser
│   │   ├── server.ts            # Cliente para o servidor
│   │   └── middleware.ts        # Middleware de sessão
│   ├── types.ts                 # Tipos TypeScript
│   └── utils.ts                 # Funções utilitárias
├── hooks/
│   └── use-cart.ts              # Hook do carrinho
└── middleware.ts                # Middleware do Next.js
```

---

## Como Personalizar

### Alterar Nome da Loja

1. Acesse o painel admin: `/admin`
2. Vá em **Configurações**
3. Altere o "Nome da Loja"
4. Clique em "Salvar"

### Alterar Número do WhatsApp

1. Acesse `/admin/configuracoes`
2. Preencha o número no formato: `5511999999999`
   - 55 = código do Brasil
   - 11 = DDD
   - 999999999 = número
3. Clique em "Salvar"

### Alterar Cores do Site

Edite o arquivo `app/globals.css`:

```css
:root {
  /* Cor primária (Azul Apple) - altere aqui */
  --primary: oklch(0.55 0.22 250);
  
  /* Fundo principal (Preto) */
  --background: oklch(0 0 0);
  
  /* ... outras cores ... */
}
```

Conversão de cores HEX para OKLCH:
- Use ferramentas online como [oklch.com](https://oklch.com)

### Alterar Textos do Banner

Edite `components/store/hero-section.tsx`:

```tsx
<h1>
  Os melhores iPhones com{' '}
  <span className="text-primary">qualidade garantida</span>
</h1>
```

### Alterar Benefícios

Edite `components/store/benefits-section.tsx`:

```tsx
const benefits = [
  {
    icon: Shield,
    title: 'Garantia',
    description: 'Seu texto aqui.',
  },
  // ... adicione ou remova benefícios
]
```

---

## Deploy na Vercel

### Opção 1: Deploy pelo GitHub

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em Deploy

### Opção 2: Deploy pelo v0

1. No v0, clique em **Publish**
2. As variáveis de ambiente já estarão configuradas
3. Seu site estará online em poucos segundos

---

## Manutenção

### Adicionar Produtos

1. Acesse `/admin/produtos`
2. Clique em "Novo Produto"
3. Preencha: nome, descrição, preço, estoque
4. Faça upload da imagem
5. Clique em "Salvar"

### Editar Produto

1. Na lista de produtos, clique em "Editar"
2. Faça as alterações
3. Clique em "Salvar"

### Ativar/Desativar Produto

- Produtos inativos não aparecem na loja
- Clique em "Desativar" ou "Ativar" na lista

### Adicionar Novo Administrador

1. Acesse `/admin/administradores`
2. Clique em "Novo Administrador"
3. Preencha nome, email e senha
4. O usuário receberá acesso ao painel

---

## Solução de Problemas

### Erro "Invalid login credentials"
- Verifique se email e senha estão corretos
- Confirme se o email foi verificado (cheque a caixa de entrada)

### Imagens não aparecem
- Verifique se o bucket "products" foi criado
- Confirme se o bucket está configurado como público

### Erro de permissão
- Verifique se as políticas RLS foram aplicadas
- Certifique-se que está logado como admin

### WhatsApp não abre
- Verifique se o número está no formato correto
- O número deve conter apenas números (sem espaços ou traços)

---

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Consulte a [documentação do Next.js](https://nextjs.org/docs)

---

## Licença

Este projeto é privado e de uso exclusivo do proprietário.
