import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import Landing from '../pages/landing/landing';
import { Home } from '../features/home/components/home-page';
import { About } from '../pages/about/about';
import { Grupos } from '../features/groups/components/groups-page';
import { GroupDetails } from '../features/groups/components/group-details-page';
import { Materias } from '../features/subjects/components/subjects-page';
import { Atividades } from '../features/activities/components/activities-page';
import { RootLayout } from '../shared/components/layout/root-layout';
import { AuthLayout } from '../shared/components/layout/auth-layout';
import { useAuthStore } from '../features/auth/hooks/use-auth-store';
import { validateToken } from '../features/auth/services/user';
import ActivateUser from '../pages/landing/ActivateUserPage';

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

const activateUserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/activate',
  component: ActivateUser
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

const groupDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: '/grupos/$groupId',
  component: GroupDetails,
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
  activateUserRoute,
  authRoute.addChildren([
    homeRoute,
    gruposRoute,
    groupDetailsRoute,
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
