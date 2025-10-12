import api from "../../../shared/services/api";

export interface Subject {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: {
        id: number;
    };
    group?: {
        id: number;
        name: string;
    };
}

export interface CreateSubjectDTO {
    name: string;
    description?: string;
    user: {
        id: number;
    };
    group?: {
        id: number;
    };
}

export interface UpdateSubjectDTO {
    id: number;
    name: string;
    description?: string;
    isActive?: boolean;
}

export const subjectsApi = {
    // GET /subjects/all/{userId} - Lista todas as matérias
    getSubjects: async () => {
        const response = await api.get<Subject[]>(`/subjects/all`);
        return response.data;
    },

    // GET /subjects/{subjectId} - Busca uma matéria específica
    getSubjectById: async (subjectId: number) => {
        const response = await api.get<Subject>(`/subjects/${subjectId}`);
        return response.data;
    },

    getSubjectsByGroup: async (groupId: number) => {
        const response = await api.get<Subject[]>(`/subjects/by-group?groupId=${groupId}`);
        return response.data;
    },

    // POST /subjects - Cria uma nova matéria
    createSubject: async (payload: CreateSubjectDTO) => {
        const subjectPayload = {
            name: payload.name,
            description: payload.description || "",
            user: {
                id: payload.user.id
            },
            ...(payload.group && {
                group: {
                    id: payload.group.id
                }
            })
        };
        const response = await api.post<Subject>("/subjects", subjectPayload);
        return response.data;
    },

    // PUT /subjects/{subjectId} - Atualiza uma matéria
    updateSubject: async (payload: UpdateSubjectDTO) => {
        const updatePayload = {
            id: payload.id,
            name: payload.name,
            description: payload.description || "",
            isActive: payload.isActive,
        };
        const response = await api.put<Subject>(`/subjects`, updatePayload);
        return response.data;
    },

    // DELETE /subjects/{subjectId} - Deleta uma matéria (assumindo que existe)
    deleteSubject: async (subjectId: number) => {
        await api.delete(`/subjects/${subjectId}`);
    }
}