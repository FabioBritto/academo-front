import { useQuery } from "@tanstack/react-query"
import api from "../.."
import type { User } from "../../types/user"

export const useUserQuery = () => {

    // const useGetUser = (userId: number) => {
    //     return useQuery({
    //         queryKey: ['user', userId],
    //         queryFn: () => (
    //             await api.get<User>()
    //         )
    //     })
    // }
}