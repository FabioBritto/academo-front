import api from "../../../shared/services/api";

// ActivityTypeDTO retornado pela API
export interface ActivityTypeDTO {
    id: number;
    name: string;
    description: string;
}

// TypeActivity completo (para uso interno)
export interface TypeActivity {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

// DTO para criar tipo de atividade (POST)
export interface CreateTypeActivityDTO {
    name: string;
    description?: string;
}

// DTO para atualizar tipo de atividade (PUT) - usa ActivityTypeDTO
export interface UpdateTypeActivityDTO {
    id: number;
    name: string;
    description: string;
}

export const typeActivitiesApi = {
    // GET /activity-types/all - Lista todos os tipos de atividade do usuário
    getTypeActivities: async () => {
        const response = await api.get<TypeActivity[]>(`/activity-types/all`);
        return response.data;
    },

    // GET /activity-types?id={id} - Busca um tipo de atividade específico
    getTypeActivityById: async (id: number) => {
        const response = await api.get<TypeActivity>(`/activity-types?id=${id}`);
        return response.data;
    },

    // POST /activity-types - Cria um novo tipo de atividade
    createTypeActivity: async (payload: CreateTypeActivityDTO) => {
        await api.post("/activity-types", payload);
        // A API retorna 201 Created sem body
    },

    // PUT /activity-types - Atualiza um tipo de atividade
    updateTypeActivity: async (payload: UpdateTypeActivityDTO) => {
        await api.put("/activity-types", payload);
        // A API retorna 200 OK sem body
    },

    // DELETE /activity-types?activityTypeId={activityTypeId} - Remove um tipo de atividade
    deleteTypeActivity: async (activityTypeId: number) => {
        await api.delete(`/activity-types?activityTypeId=${activityTypeId}`);
        // A API retorna 204 No Content
    },
};