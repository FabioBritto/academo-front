import { useQuery } from "@tanstack/react-query";
import { groupsApi } from "../../types/group";

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
