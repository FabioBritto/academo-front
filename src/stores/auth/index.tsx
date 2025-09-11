import { STORAGE_KEYS } from "../../utils/storage-keys";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
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
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: 'auth',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true);
                }
            },
        }
    )
)
