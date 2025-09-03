import api from "..";

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
}

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    username: string;
    password: string;
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
        const response = await api.post<User>("/auth/login", payload);
        return response.data;
    }
}