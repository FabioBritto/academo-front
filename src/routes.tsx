import { createRouter, createRoute, createRootRoute, redirect } from '@tanstack/react-router';
import Landing from './components/pages/landing-page/landing';
import { Home } from './components/pages/home';
import { About } from './components/pages/about';
import { Grupos } from './components/pages/grupos';
import { Materias } from './components/pages/materias';
import { Atividades } from './components/pages/atividades';
import { RootLayout } from './components/ui/layout/root-layout';
import { AuthLayout } from './components/ui/layout/auth-layout';

const rootRoute = createRootRoute({
  component: RootLayout,
});

// Layout para páginas autenticadas
const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AuthLayout,
  beforeLoad: ({ location }) => {
    // Redireciona /app para /app/home
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
