import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../../types/subject";

export const useSubjectQueries = () => {

    const useGetSubjects = () => {
        return useQuery({
            queryKey: ['subjects'],
            queryFn: () => subjectsApi.getSubjects(),
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