# Academo Front

Sistema de gerenciamento acadêmico desenvolvido com React, TypeScript e tecnologias modernas.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool rápida e moderna
- **Tailwind CSS** - Framework CSS utilitário
- **TanStack Router** - Roteamento moderno para React
- **TanStack Query** - Gerenciamento de estado do servidor
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP
- **Sonner** - Sistema de notificações toast
- **Lucide React** - Ícones modernos
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

3. Configure as variáveis de ambiente (opcional):
```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_URL=http://localhost:8080
```

4. Execute o projeto em modo de desenvolvimento:
```bash
pnpm dev
```

5. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🛠️ Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Constrói o projeto para produção
- `pnpm preview` - Visualiza a build de produção localmente
- `pnpm lint` - Executa o linter ESLint

## 🏗️ Estrutura do Projeto

```
src/
├── app/                        # Configuração da aplicação
│   ├── main.tsx               # Ponto de entrada
│   └── router.tsx             # Configuração de rotas
├── features/                   # Funcionalidades por domínio
│   ├── auth/                  # Autenticação e autorização
│   │   ├── components/        # Componentes específicos
│   │   ├── hooks/             # Hooks (useAuthStore)
│   │   ├── services/          # Lógica de negócio e API
│   │   └── types/             # Tipos TypeScript
│   ├── groups/                # Gerenciamento de grupos
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── subjects/              # Gerenciamento de matérias
│   ├── activities/            # Gerenciamento de atividades
│   └── home/                  # Dashboard
├── shared/                     # Recursos compartilhados
│   ├── components/
│   │   ├── layout/            # Layouts (Header, Sidebar, etc)
│   │   └── ui/                # Componentes UI reutilizáveis
│   ├── config/                # Configurações e constantes
│   ├── services/              # Serviços compartilhados (API, storage)
│   └── types/                 # Tipos compartilhados
├── pages/                      # Páginas públicas
│   ├── landing/               # Landing page e modais de login
│   └── about/                 # Página sobre
└── assets/                     # Imagens e recursos estáticos
```

## ✨ Funcionalidades

### Autenticação
- Login e registro de usuários
- Gerenciamento de sessão com Zustand
- Validação de token automática
- Interceptadores HTTP para autenticação
- Redirecionamento automático em caso de sessão expirada

### Gerenciamento de Grupos
- Criar, editar e excluir grupos
- Listar todos os grupos
- Associar matérias a grupos
- Visualizar matérias por grupo

### Gerenciamento de Matérias
- Criar, editar e excluir matérias
- Listar todas as matérias
- Associar matérias a grupos
- Ativar/desativar matérias

### Gerenciamento de Atividades
- Visualizar atividades
- Filtrar por matéria e grupo

### Interface
- Design responsivo e moderno
- Sidebar colapsável
- Notificações toast
- Modais para operações CRUD
- Validação de formulários

## 🔧 Configuração

### Tailwind CSS
O projeto está configurado com Tailwind CSS v3 com cores personalizadas:
- `academo-cream`: #FFF8E7
- `academo-peach`: #FFD6A5
- `academo-sage`: #A8DADC
- `academo-brown`: #6B4423

### TanStack Router
As rotas estão configuradas em `src/app/router.tsx` com:
- Roteamento baseado em componentes
- Proteção de rotas autenticadas
- Redirecionamento automático
- Validação de token antes de cada rota

### TanStack Query
Configurado para:
- Cache de queries com stale time de 5 minutos
- Retry automático em caso de erro
- DevTools para debugging
- Invalidação automática após mutations

### Zustand
Gerenciamento de estado para:
- Autenticação (token, usuário, sessão)
- Persistência no localStorage
- Hidratação automática do estado

## 📱 Uso

1. **Landing Page**: Acesse a página inicial para fazer login ou criar uma conta
2. **Dashboard**: Após o login, você será redirecionado para o dashboard
3. **Navegação**: Use a sidebar para navegar entre as funcionalidades
4. **Grupos**: Crie e gerencie grupos de estudo
5. **Matérias**: Adicione matérias e associe a grupos
6. **Atividades**: Visualize e gerencie suas atividades

## 🔐 Segurança

- Tokens JWT armazenados de forma segura
- Validação de token em cada requisição
- Interceptadores HTTP para adicionar token automaticamente
- Logout automático em caso de token inválido
- Proteção de rotas autenticadas

## 🚀 Deploy

Para fazer o build de produção:

```bash
pnpm build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente em produção:

- `VITE_API_URL`: URL da API backend

## 📚 Documentação Adicional

- [ROTAS.md](./ROTAS.md) - Documentação detalhada sobre o sistema de rotas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.