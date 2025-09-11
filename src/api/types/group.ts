import api from "..";

export interface Group {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface GroupDTO {
    id: number;
    name: string;
    description: string;
}

export interface CreateGroupDTO {
    name: string;
    description?: string;
}

export interface UpdateGroupDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export const groupsApi = {
    // GET /groups/all/{userId} - Lista todos os grupos
    getGroups: async () => {
        const response = await api.get<GroupDTO[]>(`/groups/all`);
        return response.data;
    },

    // GET /groups/{groupId} - Busca um grupo específico
    getGroupById: async (groupId: number) => {
        const response = await api.get<Group>(`/groups/${groupId}`);
        return response.data;
    },

    // POST /groups - Cria um novo grupo
    createGroup: async (payload: CreateGroupDTO) => {
        const response = await api.post<Group>("/groups", payload);
        return response.data;
    },

    // PUT /groups/{groupId} - Atualiza um grupo
    updateGroup: async (groupId: number, payload: UpdateGroupDTO) => {
        const response = await api.put<Group>(`/groups/${groupId}`, payload);
        return response.data;
    },

    // DELETE /groups/{groupId} - Deleta um grupo
    deleteGroup: async (groupId: number) => {
        await api.delete(`/groups/${groupId}`);
    }
}