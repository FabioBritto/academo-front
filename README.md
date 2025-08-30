# Academo Front

Sistema de gerenciamento acadêmico desenvolvido com React, TypeScript e tecnologias modernas.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **TanStack Router** - Roteamento moderno para React
- **TanStack Query** - Gerenciamento de estado do servidor
- **pnpm** - Gerenciador de pacotes rápido e eficiente

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd academo-front
```

2. Instale as dependências:
```bash
pnpm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
pnpm dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🛠️ Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Constrói o projeto para produção
- `pnpm preview` - Visualiza a build de produção localmente
- `pnpm lint` - Executa o linter ESLint

## 🏗️ Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
│   └── Layout.tsx # Layout principal com navegação
├── pages/         # Páginas da aplicação
│   ├── Home.tsx   # Página inicial com formulário e lista
│   └── About.tsx  # Página sobre o projeto
├── routes.tsx     # Configuração das rotas
├── main.tsx       # Ponto de entrada da aplicação
└── index.css      # Estilos globais com Tailwind CSS
```

## ✨ Funcionalidades

- **Roteamento** - Navegação entre páginas com TanStack Router
- **Gerenciamento de Estado** - useState para estado local
- **Queries e Mutations** - TanStack Query para operações de API
- **Interface Responsiva** - Design moderno com Tailwind CSS
- **TypeScript** - Type safety completo
- **DevTools** - Ferramentas de desenvolvimento integradas

## 🔧 Configuração

### Tailwind CSS
O projeto está configurado com Tailwind CSS v3. As classes estão disponíveis em todos os componentes.

### TanStack Router
As rotas estão configuradas em `src/routes.tsx` com suporte a:
- Roteamento baseado em componentes
- Navegação programática
- Links ativos com estilos

### TanStack Query
Configurado para:
- Cache de queries com stale time de 5 minutos
- Retry automático em caso de erro
- DevTools para debugging

## 📱 Uso

1. **Navegação**: Use os links no cabeçalho para navegar entre páginas
2. **Formulário**: Na página inicial, adicione novos usuários
3. **Lista**: Visualize os usuários cadastrados
4. **DevTools**: Use as ferramentas de desenvolvimento para debugar queries

## 🚀 Deploy

Para fazer o build de produção:

```bash
pnpm build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## 📄 Licença

Este projeto está sob a licença MIT.
