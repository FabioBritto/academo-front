import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateProfileDTO } from "../../types/profile";
import { profilesApi } from "../../types/profile";
import { toast } from "sonner";

export const useProfileQueries = () => {
    
    // Query para buscar o perfil do usuário
    const useGetProfileQuery = () => {
        return useQuery({
            queryKey: ["profile"],
            queryFn: async () => {
                return await profilesApi.getProfile();
            },
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1,
        });
    };

    return {
        useGetProfileQuery,
    };
};

export const useProfileMutations = () => {
    
    const queryClient = useQueryClient();

    // Mutation para atualizar o perfil
    const useUpdateProfileMutation = () => {
        return useMutation({
            mutationFn: async (payload: UpdateProfileDTO) => {
                return await profilesApi.updateProfile(payload);
            },
            onSuccess: () => {
                // Invalida a query do perfil para refazer o fetch
                queryClient.invalidateQueries({ queryKey: ["profile"] });
                toast.success("Perfil atualizado com sucesso!");
            },
            onError: (error: any) => {
                toast.error(
                    `Não foi possível atualizar o perfil: ${error.message || "Erro desconhecido"}`
                );
                return `Não foi possível atualizar o perfil: ${error.message}`;
            },
        });
    };

    return {
        useUpdateProfileMutation,
    };
};

