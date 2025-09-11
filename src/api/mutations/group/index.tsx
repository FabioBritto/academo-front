import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateGroupDTO, UpdateGroupDTO } from "../../types/group";
import { groupsApi } from "../../types/group";
import { toast } from "react-toastify";

export const useGroupMutations = () => {

    const queryClient = useQueryClient();

    const useCreateGroupMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateGroupDTO) => {
                return await groupsApi.createGroup(payload);
            },
            onSuccess: () => {
                // Invalida todas as queries de grupos para refazer o fetch
                queryClient.invalidateQueries({ queryKey: ["groups"] });
            },
            onError: (error) => {
                return `Não foi possível criar o grupo: ${error.message}`;
            }
        });
    };

    const useUpdateGroupMutation = () => {
        return useMutation({
            mutationFn: async (payload: UpdateGroupDTO) => {
                return await groupsApi.updateGroup(payload);
            },
            onSuccess: () => {
                // Invalida as queries de grupos e o grupo específico
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                toast.success('Grupo atualizado com sucesso!');
            },
            onError: () => {
                return `Não foi possível atualizar o grupo`;
            }
        });
    };

    const useDeleteGroupMutation = () => {
        return useMutation({
            mutationFn: async (groupId: number) => {
                return await groupsApi.deleteGroup(groupId);
            },
            onSuccess: (data, groupId) => {
                // Invalida as queries de grupos e remove o grupo específico do cache
                queryClient.invalidateQueries({ queryKey: ["groups"] });
                queryClient.removeQueries({ queryKey: ["group", groupId] });
            },
            onError: (error) => {
                return `Não foi possível deletar o grupo: ${error.message}`;
            }
        });
    };

    return {
        useCreateGroupMutation,
        useUpdateGroupMutation,
        useDeleteGroupMutation
    };
};
