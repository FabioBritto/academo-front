import api from "../../../shared/services/api";
import type { TypeActivity } from "./type-activity";

// ActivityDTO retornado pelo GET /activities/all
export interface ActivityDTO {
    id: number;
    notificationDate: Date;
    activityDate: Date;
    name: string;
    description: string;
    subject: string | null;
    activityType: string | null;
}

// Activity completo retornado pelo GET /activities/by-subject
export interface Activity {
    id: number;
    activityDate: Date;
    notificationDate: Date | null;
    name: string;
    value?: number;
    ActivityType?: string | null;
    typeActivity?: TypeActivity;
    description: string;
    subjectName: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

// DTO para criar atividade (POST)
export interface CreateActivityDTO {
    name: string;
    notificationDate?: Date;
    activityDate: Date;
    description?: string;
    activityTypeId?: number;
    value?: number;
    subjectId: number;
}

// DTO para atualizar atividade (PUT)
export interface UpdateActivityDTO {
    id: number;
    name?: string;
    notificationDate?: Date;
    activityDate?: Date;
    description?: string;
    ActivityTypeId?: number;
    subjectId?: number;
}

export const activitiesApi = {
    // GET /activities/all - Lista todas as atividades do usuário
    getActivities: async () => {
        const response = await api.get<ActivityDTO[]>(`/activities/all`);
        return response.data;
    },

    // GET /activities?activityId={activityId} - Busca uma atividade específica
    getActivityById: async (activityId: number) => {
        const response = await api.get<Activity>(`/activities?activityId=${activityId}`);
        return response.data;
    },

    // GET /activities/by-subject?subjectId={subjectId} - Lista atividades de uma matéria
    getActivitiesBySubject: async (subjectId: number) => {
        const response = await api.get<Activity[]>(`/activities/by-subject?subjectId=${subjectId}`);
        console.log('RESPONSE', response.data);
        return response.data;
    },

    // POST /activities - Cria uma nova atividade
    createActivity: async (payload: CreateActivityDTO) => {
        await api.post("/activities", payload);
        // A API retorna 201 Created sem body, então não retornamos dados
    },

    // PUT /activities - Atualiza uma atividade
    updateActivity: async (payload: UpdateActivityDTO) => {
        await api.put("/activities", payload);
        // A API retorna 200 OK sem body
    },

    // DELETE /activities?activityId={activityId} - Remove uma atividade
    deleteActivity: async (activityId: number) => {
        await api.delete(`/activities?activityId=${activityId}`);
        // A API retorna 204 No Content
    },
};
