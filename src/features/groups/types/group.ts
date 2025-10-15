import api from "../../../shared/services/api";

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
    isActive: boolean;
}

export interface CreateGroupDTO {
    name: string;
    description?: string;
}

export interface UpdateGroupDTO {
    id: number;
    name?: string;
    description?: string;
    isActive?: boolean;
}

export interface RemoveSubjectDTO {
    groupId: number;
    subjectId: number;
}

export interface AssociateSubjectsDTO {
    groupId: number;
    subjectsIds: number[];
}

export const groupsApi = {
    // GET /groups/all/{userId} - Lista todos os grupos
    getGroups: async () => {
        const response = await api.get<GroupDTO[]>(`/groups/all`);
        return response.data;
    },

    // GET /groups/{groupId} - Busca um grupo específico
    getGroupById: async (groupId: number) => {
        const response = await api.get<Group>(`/groups?groupId=${groupId}`);
        return response.data;
    },

    associateSubjects: async (associateSubjectsDTO: AssociateSubjectsDTO) => {
        console.log('associateSubjectsDTO', associateSubjectsDTO);
        const response = await api.put<Group>(`/groups/associate-subjects`, associateSubjectsDTO);
        console.log('response', response);
        return response.data;
    },

    // POST /groups - Cria um novo grupo
    createGroup: async (payload: CreateGroupDTO) => {
        const response = await api.post<Group>("/groups", payload);
        return response.data;
    },

    // PUT /groups/{groupId} - Atualiza um grupo
    updateGroup: async (payload: UpdateGroupDTO) => {
        const response = await api.put<Group>(`/groups`, payload);
        return response.data;
    },

    removeSubject: async (payload: RemoveSubjectDTO) => {
        const response = await api.put<Group>(`/groups/remove-subject`, payload);
        return response.data;
    },

    // DELETE /groups?groupId={groupId} - Deleta um grupo
    deleteGroup: async (groupId: number) => {
        await api.delete(`/groups?groupId=${groupId}`);
    }
}