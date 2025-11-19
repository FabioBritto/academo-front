import { useCallback, useEffect, useState } from "react";
import { AppSidebar } from "./app-side-bar";
import { useAuthStore } from "../../../features/auth/hooks/use-auth-store";
import { ProfileModal } from "../../../features/auth/components/ProfileModal";

interface HeaderProps {
    children: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const { user } = useAuthStore();

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
                            <h1 className="text-2xl font-bold text-academo-brown">Academo - O seu gerenciador acadêmico</h1>
                        </div>
                        
                        {/* User Menu */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="flex items-center space-x-2 hover:bg-academo-peach/20 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-academo-brown rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">
                                        {user?.username?.[0]?.toUpperCase() || "M"}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-academo-brown">
                                    {user?.username || "Meu Perfil"}
                                </span>
                            </button>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Profile Modal */}
            <ProfileModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
            />
        </div>
    );
}