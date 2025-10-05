# Refatoração da Estrutura do Projeto

## Resumo das Mudanças

Este documento descreve as mudanças realizadas na refatoração completa da estrutura do projeto Academo Front.

## Estrutura Anterior vs Nova Estrutura

### Antes
```
src/
├── api/
│   ├── mutations/
│   ├── queries/
│   └── types/
├── components/
│   ├── pages/
│   └── ui/
├── stores/
│   └── auth/
├── utils/
├── main.tsx
└── routes.tsx
```

### Depois
```
src/
├── app/                        # Configuração da aplicação
│   ├── main.tsx
│   └── router.tsx
├── features/                   # Organização por domínio
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── groups/
│   ├── subjects/
│   ├── activities/
│   └── home/
├── shared/                     # Recursos compartilhados
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── config/
│   ├── services/
│   └── types/
└── pages/                      # Páginas públicas
    ├── landing/
    └── about/
```

## Mudanças Principais

### 1. Organização por Feature (Domínio)

**Antes**: Arquivos organizados por tipo técnico (mutations, queries, types)
**Depois**: Arquivos organizados por funcionalidade de negócio (auth, groups, subjects)

**Benefícios**:
- Melhor coesão: arquivos relacionados ficam próximos
- Facilita a manutenção: mudanças em uma feature ficam isoladas
- Melhor escalabilidade: adicionar novas features é mais simples
- Facilita o trabalho em equipe: menos conflitos de merge

### 2. Separação de Responsabilidades

#### Features
Cada feature agora tem sua própria estrutura:
- `components/`: Componentes específicos da feature
- `hooks/`: Hooks customizados (ex: useAuthStore)
- `services/`: Lógica de negócio, queries e mutations
- `types/`: Tipos TypeScript específicos

#### Shared
Recursos compartilhados entre features:
- `components/`: Componentes UI reutilizáveis (Button, Input, etc)
- `layout/`: Componentes de layout (Header, Sidebar, etc)
- `config/`: Configurações e constantes
- `services/`: Serviços compartilhados (API, storage)

#### Pages
Páginas públicas que não fazem parte de nenhuma feature específica

### 3. Configuração da Aplicação

Movido para `src/app/`:
- `main.tsx`: Ponto de entrada da aplicação
- `router.tsx`: Configuração de rotas (antes `routes.tsx`)

### 4. Consolidação de Serviços

**Antes**: Mutations e queries separadas em pastas diferentes
**Depois**: Tudo em `services/index.tsx` de cada feature

Exemplo:
```typescript
// src/features/groups/services/index.tsx
export const useGroupMutations = () => { ... }
export const useGroupQueries = () => { ... }
```

### 5. Melhoria nos Imports

**Antes**:
```typescript
import { useGroupMutations } from '../../api/mutations/group';
import { useGroupQueries } from '../../api/queries/group';
import type { GroupDTO } from '../../api/types/group';
```

**Depois**:
```typescript
import { useGroupMutations, useGroupQueries } from '../services';
import type { GroupDTO } from '../types/group';
```

### 6. Configurações e Constantes

Criado `src/shared/config/constants.ts` para centralizar:
- Configurações da API
- Rotas da aplicação
- Mensagens de erro
- Configurações de paginação

### 7. Atualização da Documentação

- `README.md`: Atualizado com a nova estrutura e funcionalidades
- `ROTAS.md`: Atualizado com a nova organização
- `REFACTORING.md`: Novo arquivo documentando as mudanças

## Arquivos Movidos

### Configuração
- `src/main.tsx` → `src/app/main.tsx`
- `src/routes.tsx` → `src/app/router.tsx`

### Auth
- `src/stores/auth/` → `src/features/auth/hooks/use-auth-store.tsx`
- `src/api/mutations/user/` → `src/features/auth/services/`
- `src/api/queries/user/` → `src/features/auth/services/`
- `src/api/types/user.ts` → `src/features/auth/types/`
- `src/api/types/profile.ts` → `src/features/auth/types/`

### Groups
- `src/components/pages/groups.tsx` → `src/features/groups/components/groups-page.tsx`
- `src/components/pages/create-group-modal.tsx` → `src/features/groups/components/`
- `src/components/pages/update-group-modal.tsx` → `src/features/groups/components/`
- `src/components/pages/confirm-delete-group-modal.tsx` → `src/features/groups/components/`
- `src/components/pages/associate-group-modal.tsx` → `src/features/groups/components/`
- `src/api/mutations/group/` → `src/features/groups/services/`
- `src/api/queries/group/` → `src/features/groups/services/`
- `src/api/types/group.ts` → `src/features/groups/types/`

### Subjects
- `src/components/pages/subjects.tsx` → `src/features/subjects/components/subjects-page.tsx`
- `src/components/pages/create-subject-modal.tsx` → `src/features/subjects/components/`
- `src/components/pages/update-subject-modal.tsx` → `src/features/subjects/components/`
- `src/components/pages/confirm-delete-subject-modal.tsx` → `src/features/subjects/components/`
- `src/api/mutations/subject/` → `src/features/subjects/services/`
- `src/api/queries/subject/` → `src/features/subjects/services/`
- `src/api/types/subject.ts` → `src/features/subjects/types/`

### Activities
- `src/components/pages/activities.tsx` → `src/features/activities/components/activities-page.tsx`
- `src/api/types/activity.ts` → `src/features/activities/types/`
- `src/api/types/type-activity.ts` → `src/features/activities/types/`

### Home
- `src/components/pages/home.tsx` → `src/features/home/components/home-page.tsx`

### Shared
- `src/components/ui/layout/` → `src/shared/components/layout/`
- `src/components/ui/button.tsx` → `src/shared/components/ui/`
- `src/components/ui/input.tsx` → `src/shared/components/ui/`
- `src/components/ui/select.tsx` → `src/shared/components/ui/`
- `src/components/ui/switch.tsx` → `src/shared/components/ui/`
- `src/components/header-landing.tsx` → `src/shared/components/`
- `src/api/index.ts` → `src/shared/services/api.ts`
- `src/utils/` → `src/shared/services/`

### Pages
- `src/components/pages/about.tsx` → `src/pages/about/about.tsx`
- `src/components/pages/landing-page/` → `src/pages/landing/`

## Correções de Lint

Durante a refatoração, foram corrigidos diversos problemas de lint:
- Remoção de imports não utilizados
- Remoção de variáveis não utilizadas
- Correção de tipos TypeScript
- Padronização de imports

## Próximos Passos Recomendados

1. **Testes**: Adicionar testes unitários e de integração por feature
2. **Documentação**: Adicionar JSDoc nos componentes principais
3. **Performance**: Implementar code splitting por feature
4. **Acessibilidade**: Melhorar a acessibilidade dos componentes
5. **Internacionalização**: Preparar para suporte a múltiplos idiomas
6. **Storybook**: Adicionar Storybook para documentação de componentes

## Conclusão

A refatoração melhorou significativamente a organização do código:
- ✅ Melhor separação de responsabilidades
- ✅ Código mais manutenível
- ✅ Melhor escalabilidade
- ✅ Facilita o trabalho em equipe
- ✅ Imports mais limpos e intuitivos
- ✅ Estrutura alinhada com as melhores práticas do React

O projeto agora segue uma arquitetura baseada em features (Feature-Sliced Design), que é amplamente recomendada para aplicações React de médio a grande porte.
