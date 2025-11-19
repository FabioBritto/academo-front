import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi } from "../../types/activity";
import type { CreateActivityDTO, UpdateActivityDTO } from "../../types/activity";

export const useActivityQueries = () => {
    // GET /activities/all - Lista todas as atividades do usuário
    const useGetActivities = () => {
        return useQuery({
            queryKey: ['activities'],
            queryFn: () => activitiesApi.getActivities(),
        });
    };

    // GET /activities?activityId={activityId} - Busca uma atividade específica
    const useGetActivityById = (activityId: number) => {
        return useQuery({
            queryKey: ['activity', activityId],
            queryFn: () => activitiesApi.getActivityById(activityId),
            enabled: !!activityId, // Só executa se activityId estiver definido
        });
    };

    // GET /activities/by-subject?subjectId={subjectId} - Lista atividades de uma matéria
    const useGetActivitiesBySubject = (subjectId: number) => {
        return useQuery({
            queryKey: ['activities', 'subject', subjectId],
            queryFn: () => activitiesApi.getActivitiesBySubject(subjectId),
            enabled: !!subjectId, // Só executa se subjectId estiver definido
        });
    };

    return {
        useGetActivities,
        useGetActivityById,
        useGetActivitiesBySubject,
    };
};

export const useActivityMutations = () => {
    const queryClient = useQueryClient();

    // POST /activities - Cria uma nova atividade
    const useCreateActivityMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateActivityDTO) => {
                return await activitiesApi.createActivity(payload);
            },
            onSuccess: () => {
                // Invalida todas as queries de atividades
                queryClient.invalidateQueries({ queryKey: ['activities'] });
            },
            onError: (error) => {
                return `Não foi possível criar a atividade: ${error.message}`;
            }
        });
    };

    // PUT /activities - Atualiza uma atividade
    const useUpdateActivityMutation = () => {
        return useMutation({
            mutationFn: async (payload: UpdateActivityDTO) => {
                return await activitiesApi.updateActivity(payload);
            },
            onSuccess: (_data, variables) => {
                // Invalida todas as queries de atividades e a atividade específica
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activity', variables.id] });
                // Invalida também as queries de atividades por subject
                if (variables.subjectId) {
                    queryClient.invalidateQueries({ queryKey: ['activities', 'subject', variables.subjectId] });
                }
            },
            onError: (error) => {
                return `Não foi possível atualizar a atividade: ${error.message}`;
            }
        });
    };

    // DELETE /activities?activityId={activityId} - Remove uma atividade
    const useDeleteActivityMutation = () => {
        return useMutation({
            mutationFn: async (activityId: number) => {
                return await activitiesApi.deleteActivity(activityId);
            },
            onSuccess: (_data, activityId) => {
                // Invalida todas as queries de atividades e remove a query da atividade específica
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.removeQueries({ queryKey: ['activity', activityId] });
            },
            onError: (error) => {
                return `Não foi possível deletar a atividade: ${error.message}`;
            }
        });
    };

    return {
        useCreateActivityMutation,
        useUpdateActivityMutation,
        useDeleteActivityMutation,
    };
};

