import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../../types/subject";

export const useSubjectQueries = () => {

    const useGetSubjects = (userId: number) => {
        return useQuery({
            queryKey: ['subjects', userId],
            queryFn: () => subjectsApi.getSubjects(userId),
            enabled: !!userId, // Só executa se userId estiver definido
        });
    };

    const useGetSubjectById = (subjectId: number) => {
        return useQuery({
            queryKey: ['subject', subjectId],
            queryFn: () => subjectsApi.getSubjectById(subjectId),
            enabled: !!subjectId, // Só executa se subjectId estiver definido
        });
    };

    return {
        useGetSubjects,
        useGetSubjectById
    };
};