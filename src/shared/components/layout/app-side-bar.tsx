import { useNavigate, useLocation } from "@tanstack/react-router";
import { Activity, Book, Group, Home, LogOut } from "lucide-react";
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
    {
        title: 'Atividades',
        icon: Activity,
        href: '/app/atividades'
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
        <div className={`bg-academo-cream border-r border-academo-peach shadow-lg h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Header */}
            <div className="p-4 border-b border-academo-peach">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center">
                            <img 
                                src={academoLogo} 
                                alt="Academo" 
                                className="w-8 h-8 rounded-full object-cover mr-2" 
                            />
                            <h2 className="text-xl font-bold text-academo-brown">Academo</h2>
                        </div>
                    )}
                    {collapsed && (
                        <img 
                            src={academoLogo} 
                            alt="Academo" 
                            className="w-8 h-8 rounded-full object-cover mx-auto cursor-pointer hover:scale-110 transition-transform" 
                            onClick={handleLogoClick}
                        />
                    )}
                    {!collapsed && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg hover:bg-academo-peach transition-colors text-academo-brown"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                </div>
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
            <div className="absolute bottom-4 left-0 right-0 px-4">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-red-500 hover:text-white transition-colors rounded-lg text-academo-brown ${
                        collapsed ? 'justify-center' : ''
                    }`}
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
