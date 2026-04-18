import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollections, getCollections, deleteCollection, editCollection, exportCollection } from "../actions";


export function useCollections(workspaceId: string) {
    return useQuery({
        queryKey: ["collections", workspaceId],
        queryFn: async () => getCollections(workspaceId)
    })
}

export function useCreateCollection(workspaceId: string) {
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
        mutationFn: async () => editCollection(collectionId, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] })
        }
    })
}

export function useExportCollection() {
    return useMutation({
        mutationFn: async (collectionId: string) => exportCollection(collectionId),
        onSuccess: (data) => {
            // Trigger file download in browser
            const json = JSON.stringify(data, null, 2)
            const blob = new Blob([json], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${data.info.name}.json`
            a.click()
            URL.revokeObjectURL(url)
        }
    })
}