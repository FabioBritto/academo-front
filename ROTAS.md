# Estrutura de Rotas - Academo

## Rotas Públicas (Landing Page)

- `/` - Página inicial com HeaderLanding
- `/about` - Página sobre o projeto

## Rotas Autenticadas (Área Logada)

Todas as rotas da área autenticada usam o prefixo `/app/` e são renderizadas com:
- **Header** (`src/components/ui/layout/header.tsx`)
- **Sidebar** (`src/components/ui/layout/app-side-bar.tsx`)

### Rotas Disponíveis:

- `/app/home` - Dashboard principal (página Home)
- `/app/grupos` - Gerenciamento de grupos
- `/app/materias` - Gerenciamento de matérias
- `/app/atividades` - Gerenciamento de atividades

### Redirecionamento Automático:

- `/app` → `/app/home` (redirecionamento automático)

## Componentes de Layout

### RootLayout (`src/components/ui/layout/root-layout.tsx`)
- Componente raiz que decide qual layout usar
- Se a rota começa com `/app/`, renderiza apenas o `<Outlet />`
- Caso contrário, usa o `HeaderLanding`

### AuthLayout (`src/components/ui/layout/auth-layout.tsx`)
- Layout para páginas autenticadas
- Combina Header + Sidebar + conteúdo da página

### Header (`src/components/ui/layout/header.tsx`)
- Header superior da aplicação
- Inclui título, breadcrumb e menu do usuário
- Automaticamente inclui o `AppSidebar`

### AppSidebar (`src/components/ui/layout/app-side-bar.tsx`)
- Menu lateral da aplicação
- Destaca a rota ativa
- Navegação entre as páginas da área logada

## Como Adicionar Novas Páginas Autenticadas

1. Criar o componente da página em `src/components/pages/`
2. Adicionar a rota em `src/routes.tsx`:
   ```tsx
   const novaRota = createRoute({
     getParentRoute: () => authRoute,
     path: '/nova-pagina',
     component: NovaPagina,
   });
   ```
3. Adicionar ao routeTree:
   ```tsx
   authRoute.addChildren([
     homeRoute,
     gruposRoute,
     materiasRoute,
     atividadesRoute,
     novaRota // <- nova rota
   ])
   ```
4. Adicionar item no menu da sidebar em `src/components/ui/layout/app-side-bar.tsx`

## Login e Redirecionamento

- Login bem-sucedido redireciona para `/app/home`
- Logout redireciona para `/` (landing page)
- Link temporário "Área Logada (Dev)" na landing page para desenvolvimento

## Desenvolvimento

Use o botão verde "Área Logada (Dev)" na landing page para acessar rapidamente a área autenticada durante o desenvolvimento. Este botão deve ser removido em produção. 