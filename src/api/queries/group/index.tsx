import { useQuery } from "@tanstack/react-query";
import { groupsApi } from "../../types/group";

export const useGroupQueries = () => {

    const useGetGroups = (userId: number) => {
        return useQuery({
            queryKey: ['groups', userId],
            queryFn: () => groupsApi.getGroups(userId),
            enabled: !!userId, // Só executa se userId estiver definido
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
