import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllRequestFromCollection, addRequestToCollection, saveRequest, type Request, run, deleteRequest, runDirect } from "../actions";
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

export function useRunRequest() {
    const queryClient = useQueryClient()
    // const { setResponseViewerData, tabs, activeTabId } = useRequestPlaygroundStore()
    const { tabs, activeTabId, updateTab } = useRequestPlaygroundStore()

    return useMutation({
        mutationFn: async () => {
            const activeTab = tabs.find(t => t.id === activeTabId)
            if (!activeTab?.requestId) throw new Error("No saved request")

            const resolveTabBody = (body: any) => {
                if (!body) return undefined
                if (typeof body === 'object' && 'raw' in body) {
                    try { return JSON.parse(body.raw) } catch { return body.raw }
                }
                if (typeof body === 'string') {
                    try { return JSON.parse(body) } catch { return body }
                }
                return body
            }

            const resolvedBody = resolveTabBody(activeTab.body)

            return runDirect({
                id: activeTab.requestId,
                method: activeTab.method,
                url: activeTab.url,
                headers: activeTab.headers
                    ? (() => {
                        // Already an object — don't parse
                        const parsed = typeof activeTab.headers === 'string'
                            ? JSON.parse(activeTab.headers)
                            : activeTab.headers
                        if (!Array.isArray(parsed)) return parsed
                        return parsed.reduce((acc: Record<string, string>, h: { key: string; value: string }) => {
                            if (h.key) acc[h.key] = h.value
                            return acc
                        }, {})
                    })()
                    : undefined,
                parameters: activeTab.parameters
                    ? (() => {
                        // Already an object — don't parse
                        const parsed = typeof activeTab.parameters === 'string'
                            ? JSON.parse(activeTab.parameters)
                            : activeTab.parameters
                        if (!Array.isArray(parsed)) return parsed
                        return parsed.reduce((acc: Record<string, string>, p: { key: string; value: string }) => {
                            if (p.key) acc[p.key] = p.value
                            return acc
                        }, {})
                    })()
                    : undefined,
                body: resolvedBody
            })
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["request"] })
            //@ts-ignore
            if (activeTabId) {
                updateTab(activeTabId, { responseData: data as any })
            }
        }
    })
}

export function useDeleteRequest(requestId: string, collectionId: string) {
    const queryClient = useQueryClient();
    const { tabs, closeTab } = useRequestPlaygroundStore();

    return useMutation({
        mutationFn: async () => deleteRequest(requestId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["request", collectionId] });
            // 👇 close the tab if it's open
            const openTab = tabs.find((t) => t.requestId === requestId);
            if (openTab) closeTab(openTab.id);
        }
    });
}