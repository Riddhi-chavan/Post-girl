import { useSession } from '@/lib/auth-client' // adjust to your auth
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getRequestsSharedWithMe, removeSavedSharedRequest, saveSharedRequestToAccount } from '../actions'

export function useRequestsSharedWithMe() {
    const { data: session } = useSession()
    return useQuery({
        queryKey: ["shared-with-me", session?.user?.id],
        queryFn: () => getRequestsSharedWithMe(session?.user?.id!),
        enabled: !!session?.user?.id
    })
}

export function useSaveSharedRequest() {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (token: string) => saveSharedRequestToAccount(session?.user?.id!, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shared-with-me"] })
        }
    })
}

export function useRemoveSavedSharedRequest() {
    const { data: session } = useSession()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => removeSavedSharedRequest(session?.user?.id!, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shared-with-me"] })
        }
    })
}