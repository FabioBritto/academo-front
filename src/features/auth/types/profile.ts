import api from "../../../shared/services/api";

export interface Profile {
    id: number;
    fullName: string;
    birthDate: Date;
    gender: string;
    institution: string;
    usageStorage?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProfileDTO {
    fullName: string;
    birthDate?: Date;
    gender?: string;
    institution: string;
}

export interface UpdateProfileDTO {
    fullName?: string;
    birthDate?: Date;
    gender?: string;
    institution?: string;
}

export const profilesApi = {
    // GET /profile - Recupera o perfil do usuário
    getProfile: async () => {
        const response = await api.get<Profile>("/profile");
        return response.data;
    },

    // PUT /profile - Atualiza o perfil do usuário
    updateProfile: async (payload: UpdateProfileDTO) => {
        const response = await api.put<Profile>("/profile", payload);
        return response.data;
    }
}