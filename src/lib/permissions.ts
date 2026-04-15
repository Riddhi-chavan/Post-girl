// lib/permissions.ts
import { MEMBER_ROLE } from "@prisma/client";

export const permissions = {
    canInvite: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN,

    canEditCollection: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN || role === MEMBER_ROLE.EDITOR,

    canEditRequest: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN || role === MEMBER_ROLE.EDITOR,

    canRun: (role: MEMBER_ROLE | null) =>
        role !== null, // all roles can run

    canDeleteCollection: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN,

    canDeleteRequest: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN || role === MEMBER_ROLE.EDITOR,

    canManageMembers: (role: MEMBER_ROLE | null) =>
        role === MEMBER_ROLE.ADMIN,
} as const;