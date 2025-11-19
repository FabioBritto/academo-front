import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { typeActivitiesApi } from "../../types/type-activity";
import type { CreateTypeActivityDTO, UpdateTypeActivityDTO } from "../../types/type-activity";

export const useTypeActivityQueries = () => {
    // GET /activity-types/all - Lista todos os tipos de atividade do usuário
    const useGetTypeActivities = () => {
        return useQuery({
            queryKey: ['type-activities'],
            queryFn: () => typeActivitiesApi.getTypeActivities(),
        });
    };

    // GET /activity-types?id={id} - Busca um tipo de atividade específico
    const useGetTypeActivityById = (id: number) => {
        return useQuery({
            queryKey: ['type-activity', id],
            queryFn: () => typeActivitiesApi.getTypeActivityById(id),
            enabled: !!id, // Só executa se id estiver definido
        });
    };

    return {
        useGetTypeActivities,
        useGetTypeActivityById,
    };
};

export const useTypeActivityMutations = () => {
    const queryClient = useQueryClient();

    // POST /activity-types - Cria um novo tipo de atividade
    const useCreateTypeActivityMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateTypeActivityDTO) => {
                return await typeActivitiesApi.createTypeActivity(payload);
            },
            onSuccess: () => {
                // Invalida todas as queries de tipos de atividade
                queryClient.invalidateQueries({ queryKey: ['type-activities'] });
            },
            onError: (error) => {
                return `Não foi possível criar o tipo de atividade: ${error.message}`;
            }
        });
    };

    // PUT /activity-types - Atualiza um tipo de atividade
    const useUpdateTypeActivityMutation = () => {
        return useMutation({
            mutationFn: async (payload: UpdateTypeActivityDTO) => {
                return await typeActivitiesApi.updateTypeActivity(payload);
            },
            onSuccess: (_data, variables) => {
                // Invalida todas as queries de tipos de atividade e o tipo específico
                queryClient.invalidateQueries({ queryKey: ['type-activities'] });
                queryClient.invalidateQueries({ queryKey: ['type-activity', variables.id] });
            },
            onError: (error) => {
                return `Não foi possível atualizar o tipo de atividade: ${error.message}`;
            }
        });
    };

    // DELETE /activity-types?activityTypeId={activityTypeId} - Remove um tipo de atividade
    const useDeleteTypeActivityMutation = () => {
        return useMutation({
            mutationFn: async (activityTypeId: number) => {
                return await typeActivitiesApi.deleteTypeActivity(activityTypeId);
            },
            onSuccess: (_data, activityTypeId) => {
                // Invalida todas as queries de tipos de atividade e remove a query do tipo específico
                queryClient.invalidateQueries({ queryKey: ['type-activities'] });
                queryClient.removeQueries({ queryKey: ['type-activity', activityTypeId] });
            },
            onError: (error) => {
                return `Não foi possível deletar o tipo de atividade: ${error.message}`;
            }
        });
    };

    return {
        useCreateTypeActivityMutation,
        useUpdateTypeActivityMutation,
        useDeleteTypeActivityMutation,
    };
};

