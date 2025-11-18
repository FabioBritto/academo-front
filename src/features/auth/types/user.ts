import api from "../../../shared/services/api";

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    token: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    username: string;
    email: string;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    username: string;
    password: string;
    token: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
}

export const usersApi = {
    createUser: async (payload: CreateUserDTO) => {
        const response = await api.post<User>("/auth/register", payload);
        return response.data;
    },
    login: async (payload: LoginDTO) => {
        const response = await api.post<LoginResponse>("/auth/login", payload);
        return response.data;
    },
    activate: async (value: string) => {
        const response = await api.post<User>(`/auth/activate?value=${value}`);
        return response.data;
    }
}