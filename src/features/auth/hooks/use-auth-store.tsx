import { STORAGE_KEYS } from "../../../shared/services/storage-keys";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    validateSavedToken: () => Promise<void>;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            isAuthenticated: false,
            token: null,
            user: null,
            login: (token: string, user: User) => {
                localStorage.setItem(STORAGE_KEYS.accessToken, token);
                set({ isAuthenticated: true, token, user });
            },
            logout: () => {
                localStorage.removeItem(STORAGE_KEYS.accessToken);
                set({ isAuthenticated: false, token: null, user: null });
            },
            validateSavedToken: async () => {
                const { token } = get();
                
                if (!token) {
                    return;
                }
                
                try {
                    // Importação dinâmica para evitar dependência circular
                    const { validateToken } = await import('../services');
                    const isValid = await validateToken();
                    
                    if (!isValid) {
                        // Token inválido - limpa o estado
                        get().logout();
                    }
                } catch (error) {
                    console.error('Erro ao validar token salvo:', error);
                    get().logout();
                }
            },
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                    // Valida o token salvo após hidratar o estado
                    state.validateSavedToken();
                }
            },
        }
    )
)
