import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollections, getCollections, deleteCollection, editCollection } from "../actions";


export function useCollections(workspaceId: string) {
    return useQuery({
        queryKey: ["collections", workspaceId],
        queryFn: async () => getCollections(workspaceId)
    })
}

export function useCreateCollection(workspaceId: string, name: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (name: string) => createCollections(workspaceId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] })
        }
    })
}

export function useDeleteCollection(collectionId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => deleteCollection(collectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] })
        }
    })
}

export function useEditCollection(collectionId: string, name: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (name: string) => editCollection(collectionId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] })
        }
    })
}