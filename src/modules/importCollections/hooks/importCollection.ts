// hooks.ts (add to your existing file)
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { importCollection } from "../actions"

export function useImportCollection(workspaceId: any) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (jsonData: string) => importCollection(workspaceId, jsonData),
        onSuccess: (data) => {
            if (data.success) {
                queryClient.invalidateQueries({ queryKey: ["collections", workspaceId] })
            }
        }
    })
}