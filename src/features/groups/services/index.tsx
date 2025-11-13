import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { AssociateSubjectsDTO, CreateGroupDTO, RemoveSubjectDTO, UpdateGroupDTO } from "../types/group";
import { groupsApi } from "../types/group";
import { toast } from "sonner";

export const useGroupMutations = () => {

    const queryClient = useQueryClient();

    const useCreateGroupMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateGroupDTO) => {
                return await groupsApi.createGroup(payload);
            },
            onSuccess: () => {
                // Invalida todas as queries de grupos para refazer o fetch
                toast.success('Grupo criado com sucesso!');
                queryClient.invalidateQueries({ queryKey: ["groups"] });
            },
            onError: (error) => {
                toast.error(`Não foi possível criar o grupo: ${error.message}`);
                return `Não foi possível criar o grupo: ${error.message}`;
            }
        });
    };

    const useUpdateGroupMutation = () => {
        return useMutation({
            mutationFn: async (payload: UpdateGroupDTO) => {
                return await groupsApi.updateGroup(payload);
            },
            onSuccess: (_data, variables) => {
                // Invalida as queries de grupos e o grupo específico
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                queryClient.invalidateQueries({ queryKey: ["group", variables.id] });
                toast.success('Grupo atualizado com sucesso!');
            },
            onError: () => {
                return `Não foi possível atualizar o grupo`;
            }
        });
    };

    const useAssociateSubjectsMutation = () => {
        return useMutation({
            mutationFn: async (payload: AssociateSubjectsDTO) => {
                return await groupsApi.associateSubjects(payload);
            },
            onSuccess: (_data, variables) => {
                // Invalida as queries de grupos e as matérias do grupo específico
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                queryClient.invalidateQueries({ queryKey: ["subjects", variables.groupId] });
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
                toast.success('Matérias associadas ao grupo com sucesso!');
            },
            onError: (error) => {
                return `Não foi possível associar as matérias: ${error.message}`;
            }
        });
    };

    const useRemoveSubjectMutation = () => {

        return useMutation({
            mutationFn: async (payload: RemoveSubjectDTO) => {
                return await groupsApi.removeSubject(payload);
            },
            onSuccess: (_data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                queryClient.invalidateQueries({ queryKey: ["group", variables.groupId] });
                queryClient.invalidateQueries({ queryKey: ["subjects", variables.groupId] });
                queryClient.invalidateQueries({ queryKey: ["subjects"] });
                toast.success('Matéria removida do grupo com sucesso!');
            },
            onError: (error) => {
                toast.error(`Não foi possível remover a matéria do grupo: ${error.message}`);
            }
        });
    };

    const useDeleteGroupMutation = () => {
        return useMutation({
            mutationFn: async (groupId: number) => {
                return await groupsApi.deleteGroup(groupId);
            },
            onSuccess: (groupId) => {
                // Invalida as queries de grupos e remove o grupo específico do cache
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                queryClient.removeQueries({ queryKey: ["group", groupId] });
                toast.success('Grupo excluído com sucesso!');
            },
            onError: (error) => {
                return `Não foi possível excluir o grupo: ${error.message}`;
            }
        });
    };

    return {
        useCreateGroupMutation,
        useUpdateGroupMutation,
        useDeleteGroupMutation,
        useAssociateSubjectsMutation,
        useRemoveSubjectMutation
    };
};

export const useGroupQueries = () => {

    const useGetGroups = () => {
        return useQuery({
            queryKey: ['groups'],
            queryFn: () => groupsApi.getGroups(),
        });
    };

    const useGetGroupById = (groupId: number) => {
        return useQuery({
            queryKey: ['group', groupId],
            queryFn: () => groupsApi.getGroupById(groupId),
            enabled: !!groupId, // Só executa se groupId estiver definido
        });
    };

    return {
        useGetGroups,
        useGetGroupById
    };
};