import { useQuery } from "@tanstack/react-query"
import { getRequestHistory } from "../actions"

export function useRequestHistory(workspaceId: string) {
    return useQuery({
        queryKey: ["history", workspaceId],
        queryFn: () => getRequestHistory(workspaceId),
        enabled: !!workspaceId,
        retry: false
    })
}