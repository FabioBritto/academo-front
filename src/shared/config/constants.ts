// Configurações da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
} as const;

// Rotas da aplicação
export const ROUTES = {
  PUBLIC: {
    LANDING: '/',
    ABOUT: '/about',
  },
  AUTH: {
    HOME: '/app/home',
    GROUPS: '/app/grupos',
    SUBJECTS: '/app/materias',
    ACTIVITIES: '/app/atividades',
  },
} as const;

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Sessão expirada. Faça login novamente.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  NOT_FOUND: 'Recurso não encontrado.',
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
