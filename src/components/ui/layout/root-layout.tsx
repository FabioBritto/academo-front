import { Outlet, useLocation } from '@tanstack/react-router';
import { HeaderLanding } from '../../header-landing';

export function RootLayout() {
  const location = useLocation();
  
  // Se a rota começa com /app, não renderiza o HeaderLanding
  if (location.pathname.startsWith('/app')) {
    return <Outlet />;
  }
  
  // Para outras rotas, usa o HeaderLanding
  return <HeaderLanding />;
} 