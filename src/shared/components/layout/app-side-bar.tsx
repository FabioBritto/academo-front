import { useNavigate, useLocation } from "@tanstack/react-router";
import { Book, Group, Home, LogOut } from "lucide-react";
import { useState } from "react";
import academoLogo from '../../../assets/academo-logo.png';
import { useAuthStore } from '../../../features/auth/hooks/use-auth-store';

const menuItems = [
    {
        title: 'Início',
        icon: Home,
        href: '/app/home'
    },
    {
        title: 'Grupos',
        icon: Group,
        href: '/app/grupos'
    },
    {
        title: 'Matérias',
        icon: Book,
        href: '/app/materias'
    },
];

export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    }

    const handleNavigation = (href: string) => {
        navigate({ to: href });
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleLogoClick = () => {
        if (collapsed) {
            setCollapsed(false);
        }
    };

    return (
        <div className={`bg-academo-cream border-r border-academo-peach shadow-lg h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'}`}>
            {/* Header */}
            <div className={`border-b border-academo-peach ${collapsed ? 'p-4' : 'p-4'}`}>
                {collapsed ? (
                    <div className="flex justify-center">
                        <img 
                            src={academoLogo} 
                            alt="Academo" 
                            className="w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                            onClick={handleLogoClick}
                            title="Expandir sidebar"
                        />
                    </div>
                ) : (
                    <div className="relative flex flex-col items-center justify-center w-full">
                        <img 
                            src={academoLogo} 
                            alt="Academo" 
                            className="w-full aspect-square rounded-full object-cover shadow-md" 
                        />
                        <button
                            onClick={toggleSidebar}
                            className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-academo-peach transition-colors text-academo-brown bg-white bg-opacity-90 shadow-sm backdrop-blur-sm"
                            title="Retrair sidebar"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <nav className="mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <button
                            key={item.title}
                            onClick={() => handleNavigation(item.href)}
                            className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                                collapsed ? 'justify-center' : ''
                            } ${
                                isActive 
                                    ? 'bg-academo-brown text-white shadow-sm' 
                                    : 'text-academo-brown hover:bg-academo-sage hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {!collapsed && (
                                <span className="ml-3 font-medium">{item.title}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className={`absolute bottom-4 ${collapsed ? 'left-0 right-0 px-2' : 'left-0 right-0 px-4'}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center ${collapsed ? 'justify-center px-0' : 'px-4'} py-3 text-left hover:bg-red-500 hover:text-white transition-colors rounded-lg text-academo-brown`}
                    title={collapsed ? 'Sair' : ''}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && (
                        <span className="ml-3 font-medium">Sair</span>
                    )}
                </button>
            </div>
        </div>
    );
}
