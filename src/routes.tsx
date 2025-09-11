import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import Landing from './components/pages/landing-page/landing';
import { Home } from './components/pages/home';
import { About } from './components/pages/about';
import { Grupos } from './components/pages/groups';
import { Materias } from './components/pages/subjects';
import { Atividades } from './components/pages/activities';
import { RootLayout } from './components/ui/layout/root-layout';
import { AuthLayout } from './components/ui/layout/auth-layout';
import { useAuthStore } from './stores/auth';
import { validateToken } from './api/mutations/user';

const rootRoute = createRootRoute({
  component: RootLayout,
});

// Layout para páginas autenticadas
// Esta rota e todas as suas filhas (/app/*) agora requerem autenticação
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AuthLayout,
  beforeLoad: async ({ location }) => {
    // Verifica se o usuário está autenticado usando o Zustand store
    const { isAuthenticated, token } = useAuthStore.getState();
    
    // Primeira verificação: se não estiver autenticado ou não tiver token
    if (!isAuthenticated || !token) {
      throw redirect({ 
        to: '/',
        search: {
          // Salva a URL que o usuário tentou acessar para redirecionar depois do login
          redirect: location.href,
        },
      });
    }
    
    // Segunda verificação: valida se o token ainda é válido no backend
    const isTokenValid = await validateToken();
    
    if (!isTokenValid) {
      // Token inválido ou expirado - limpa o estado e redireciona
      const { logout } = useAuthStore.getState();
      logout();
      
      throw redirect({ 
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
    
    // Redireciona /app para /app/home se estiver autenticado
    if (location.pathname === '/app') {
      throw redirect({ to: '/app/home' });
    }
  },
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

// Rotas da área autenticada
const homeRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/home',
  component: Home,
});

const gruposRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/grupos',
  component: Grupos,
});

const materiasRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/materias',
  component: Materias,
});

const atividadesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/atividades',
  component: Atividades,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
});

const routeTree = rootRoute.addChildren([
  landingRoute, 
  aboutRoute,
  authRoute.addChildren([
    homeRoute,
    gruposRoute,
    materiasRoute,
    atividadesRoute
  ])
]);

console.log(routeTree.children);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
