import { useQuery } from "@tanstack/react-query"
import api from ".."
import type { Subject } from "../types/subject"

export const useSubjectQuery = () => {
    const useGetSubject = (subjectId: number) => {
        return useQuery({
            queryKey: ['subject', subjectId],
            queryFn: async () => (
                await api.get<Subject>(`/subjects/${subjectId}`)
            ).data,
            enabled: !!subjectId
        })
    }


    return {
        useGetSubject
    }
}