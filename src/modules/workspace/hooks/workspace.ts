import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkSpaces, getWorkSpaceById, getWorkSpaces } from "../actions";

export function useWorkspace() {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => getWorkSpaces()
    })
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (name: string) => createWorkSpaces(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces"] })
        }
    })
}

export function useGetWorkspace(id: string) {
    return useQuery({
        queryKey: ["workspace", id],
        queryFn: async () => getWorkSpaceById(id)
    })
}