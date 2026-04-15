// modules/invites/hooks.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateWorkspaceInvite, getAllWorkspaceMembers, updateMemberRole } from "../actions";
import { MEMBER_ROLE } from "@prisma/client";

export const useGenerateWorkspaceInvite = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role: MEMBER_ROLE) => generateWorkspaceInvite(workspaceId, role), // 👈 pass role
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace-invites", workspaceId] });
        },
    });
};

export const useGetWorkspaceMemebers = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace-members", workspaceId],
        queryFn: () => getAllWorkspaceMembers(workspaceId),
    });
};

export const useUpdateMemberRole = (workspaceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ memberId, role }: { memberId: string; role: MEMBER_ROLE }) =>
            updateMemberRole(workspaceId, memberId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] });
        },
    });
};

export const useGetMyRole = (workspaceId: string) => {
    return useQuery({
        queryKey: ["my-role", workspaceId],
        queryFn: () => import("../actions").then(m => m.getMyRole(workspaceId)),
    });
};