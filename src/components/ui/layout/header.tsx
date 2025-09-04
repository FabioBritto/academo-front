import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "./app-side-bar";

interface HeaderProps {
    children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 10);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <div className="flex min-h-screen w-full bg-gradient-to-br from-white to-academo-cream">
            {/* Sidebar */}
            <aside className="hidden md:block h-screen sticky top-0">
                <AppSidebar />
            </aside>
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Top Header */}
                <header className={`bg-academo-cream border-b border-academo-peach px-6 py-4 transition-all duration-200 ${
                    scrolled ? 'shadow-md' : 'shadow-sm'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-academo-brown">Dashboard</h1>
                            <p className="text-sm text-gray-600">Bem-vindo ao Academo</p>
                        </div>
                        
                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-academo-brown rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">U</span>
                                </div>
                                <span className="text-sm font-medium text-academo-brown">Usuário</span>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}