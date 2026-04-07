import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRequestFromCollection, addRequestToCollection, saveRequest, type Request, run } from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

export function useAddRequestToCollection(collectionId: string) {
    const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (value: Request) => addRequestToCollection(collectionId, value),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["request", collectionId] })
            // @ts-ignore
            updateTabFromSavedRequest(activeTabId!, data)
        }
    })
}

export function useGetAllRequestFromCollection(collectionId: string) {
    return useQuery({
        queryKey: ["request", collectionId],
        queryFn: async () => getAllRequestFromCollection(collectionId)
    })
}

export function useSaveRequest(id: string) {
    const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (value: Request) => saveRequest(id, value),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["request"] })
            // @ts-ignore
            updateTabFromSavedRequest(activeTabId!, data)
        }
    })
}

export function useRunRequest(requestId: string) {
    const queryClient = useQueryClient()
    const { setResponseViewerData } = useRequestPlaygroundStore()

    return useMutation({
        mutationFn: async () => await run(requestId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["request"] })
            //@ts-ignore
            setResponseViewerData(data)
        }
    })
}