import { Header } from './header';
import { Outlet } from '@tanstack/react-router';

export function AuthLayout() {
  return (
    <Header>
      <Outlet />
    </Header>
  );
} 