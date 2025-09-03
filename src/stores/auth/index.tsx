interface User {
    id: number;
    name: string;
    email: string;
    profile: {
        fullName: string;
        institution: string;
    }
    createdAt: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
}
