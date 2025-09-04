import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import Landing from './components/pages/Landing';
import { Home } from './components/pages/Home';
import { About } from './components/pages/About';
import { Layout } from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
})

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/home',
  component: Home,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

const routeTree = rootRoute.addChildren([landingRoute, homeRoute, aboutRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
} 