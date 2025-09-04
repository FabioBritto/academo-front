import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubjectDTO, UpdateSubjectDTO } from "../../types/subject";
import { subjectsApi } from "../../types/subject";

export const useSubjectMutations = () => {

    const queryClient = useQueryClient();

    const useCreateSubjectMutation = () => {
        return useMutation({
            mutationFn: async (payload: { name: string; description?: string; userId: number; groupId?: number }) => {
                const createPayload: CreateSubjectDTO = {
                    name: payload.name,
                    description: payload.description,
                    user: {
                        id: payload.userId
                    },
                    ...(payload.groupId && {
                        group: {
                            id: payload.groupId
                        }
                    })
                };
                return await subjectsApi.createSubject(createPayload);
            },
            onSuccess: () => {
                // Invalida todas as queries de matérias para refazer o fetch
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
            },
            onError: (error) => {
                return `Não foi possível criar a matéria: ${error.message}`;
            }
        });
    };

    const useUpdateSubjectMutation = () => {
        return useMutation({
            mutationFn: async ({ subjectId, payload }: { subjectId: number; payload: { name: string; description?: string; isActive?: boolean } }) => {
                const updatePayload: UpdateSubjectDTO = {
                    id: subjectId,
                    name: payload.name,
                    description: payload.description,
                    isActive: payload.isActive
                };
                return await subjectsApi.updateSubject(subjectId, updatePayload);
            },
            onSuccess: (data, variables) => {
                // Invalida as queries de matérias e a matéria específica
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
                queryClient.invalidateQueries({ queryKey: ["subject", variables.subjectId] });
            },
            onError: (error) => {
                return `Não foi possível atualizar a matéria: ${error.message}`;
            }
        });
    };

    const useDeleteSubjectMutation = () => {
        return useMutation({
            mutationFn: async (subjectId: number) => {
                return await subjectsApi.deleteSubject(subjectId);
            },
            onSuccess: (data, subjectId) => {
                // Invalida as queries de matérias e remove a matéria específica do cache
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
                queryClient.removeQueries({ queryKey: ["subject", subjectId] });
            },
            onError: (error) => {
                return `Não foi possível deletar a matéria: ${error.message}`;
            }
        });
    };

    return {
        useCreateSubjectMutation,
        useUpdateSubjectMutation,
        useDeleteSubjectMutation
    };
}; 