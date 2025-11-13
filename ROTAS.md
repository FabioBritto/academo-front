# Estrutura de Rotas - Academo

## Rotas Públicas (Landing Page)

- `/` - Página inicial com HeaderLanding
- `/about` - Página sobre o projeto

## Rotas Autenticadas (Área Logada)

Todas as rotas da área autenticada usam o prefixo `/app/` e são renderizadas com:
- **Header** (`src/shared/components/layout/header.tsx`)
- **Sidebar** (`src/shared/components/layout/app-side-bar.tsx`)

### Rotas Disponíveis:

- `/app/home` - Dashboard principal (página Home)
- `/app/grupos` - Gerenciamento de grupos
- `/app/materias` - Gerenciamento de matérias
- `/app/atividades` - Gerenciamento de atividades

### Redirecionamento Automático:

- `/app` → `/app/home` (redirecionamento automático)

## Componentes de Layout

### RootLayout (`src/shared/components/layout/root-layout.tsx`)
- Componente raiz que decide qual layout usar
- Se a rota começa com `/app/`, renderiza apenas o `<Outlet />`
- Caso contrário, usa o `HeaderLanding`

### AuthLayout (`src/shared/components/layout/auth-layout.tsx`)
- Layout para páginas autenticadas
- Combina Header + Sidebar + conteúdo da página

### Header (`src/shared/components/layout/header.tsx`)
- Header superior da aplicação
- Inclui título, breadcrumb e menu do usuário
- Automaticamente inclui o `AppSidebar`

### AppSidebar (`src/shared/components/layout/app-side-bar.tsx`)
- Menu lateral da aplicação
- Destaca a rota ativa
- Navegação entre as páginas da área logada

## Como Adicionar Novas Páginas Autenticadas

1. Criar o componente da página em `src/features/{feature-name}/components/`
2. Adicionar a rota em `src/app/router.tsx`:
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
4. Adicionar item no menu da sidebar em `src/shared/components/layout/app-side-bar.tsx`

## Login e Redirecionamento

- Login bem-sucedido redireciona para `/app/home`
- Logout redireciona para `/` (landing page)

## Estrutura de Pastas

```
src/
├── app/                        # Configuração da aplicação
│   ├── main.tsx               # Ponto de entrada
│   └── router.tsx             # Configuração de rotas
├── features/                   # Funcionalidades por domínio
│   ├── auth/
│   │   ├── components/        # Componentes específicos de auth
│   │   ├── hooks/             # Hooks (ex: useAuthStore)
│   │   ├── services/          # Lógica de negócio e API
│   │   └── types/             # Tipos TypeScript
│   ├── groups/
│   ├── subjects/
│   ├── activities/
│   └── home/
├── shared/                     # Recursos compartilhados
│   ├── components/
│   │   ├── layout/            # Layouts (Header, Sidebar, etc)
│   │   └── ui/                # Componentes UI reutilizáveis
│   ├── config/                # Configurações
│   ├── services/              # Serviços compartilhados (API, storage)
│   └── types/                 # Tipos compartilhados
└── pages/                      # Páginas públicas
    ├── landing/
    └── about/
```

## Desenvolvimento

Use o botão verde "Área Logada (Dev)" na landing page para acessar rapidamente a área autenticada durante o desenvolvimento. Este botão deve ser removido em produção.