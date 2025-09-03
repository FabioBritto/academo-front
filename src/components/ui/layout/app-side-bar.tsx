import { useNavigate, useLocation } from "@tanstack/react-router";
import { Activity, Book, Group, Home, LogOut } from "lucide-react";
import { useState, useCallback } from "react";
import academoLogo from '../../../assets/academo-logo.jpeg';

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
    const [collapsedMenus, setCollapsedMenus] = useState<Record<string, boolean>>({});
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        
        navigate({ to: '/' });
    }

    const toggleMenu = useCallback((title: string) => {
        setCollapsedMenus(prev => ({ ...prev, [title]: !prev[title] }));
    }, []);

    const handleNavigation = (href: string) => {
        navigate({ to: href });
    };

    return (
        <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    {!collapsed && (
                        <div className="flex items-center">
                            <img 
                                src={academoLogo} 
                                alt="Academo" 
                                className="w-8 h-8 rounded-full object-cover mr-2" 
                            />
                            <h2 className="text-xl font-bold">Academo</h2>
                        </div>
                    )}
                    {collapsed && (
                        <img 
                            src={academoLogo} 
                            alt="Academo" 
                            className="w-8 h-8 rounded-full object-cover mx-auto" 
                        />
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
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
                                    ? 'bg-gray-700 text-white' 
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            {!collapsed && (
                                <span className="ml-3">{item.title}</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-0 right-0 px-4">
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-red-600 transition-colors rounded-lg ${
                        collapsed ? 'justify-center' : ''
                    }`}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && (
                        <span className="ml-3">Sair</span>
                    )}
                </button>
            </div>
        </div>
    );
}
