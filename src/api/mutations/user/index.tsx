import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateUserDTO } from "../../types/user";
import { usersApi } from "../../types/user";

export const useUserMutations = () => {

    const queryClient = useQueryClient();

    const useCreateUserMutation = () => {
        return useMutation({
            mutationFn: async (payload: CreateUserDTO) => {
                return (await usersApi.createUser(payload));
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["user"] });
            },
            onError: (error) => {
                return `Não foi possível criar o usuário: ${error.message}`;
            }
        })
    }

    return {
        useCreateUserMutation,
    }
}