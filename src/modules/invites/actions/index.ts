// modules/invites/actions.ts
"use server"
import db from "@/lib/db"
import { currentUser } from "@/modules/authentication/actions"
import { MEMBER_ROLE } from "@prisma/client"
import { randomBytes } from "crypto"

export const generateWorkspaceInvite = async (
    workspaceId: string,
    role: MEMBER_ROLE = MEMBER_ROLE.VIEWER  // 👈 role param
) => {
    const token = randomBytes(16).toString("hex")
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    // only admins can generate invites
    const member = await db.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id, role: MEMBER_ROLE.ADMIN }
    })
    if (!member) throw new Error("Only admins can invite members")

    const invite = await db.workspaceInvite.create({
        data: {
            workspaceId,
            token,
            createdById: user.id,
            role,  // 👈 store the role
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }
    })

    return `${process.env.NEXT_PUBLIC_APP_URL}/invites/${invite.token}`
}

export const acceptWorkspaceInvite = async (token: string) => {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    const invite = await db.workspaceInvite.findUnique({ where: { token } })
    if (!invite) throw new Error("Invalid invite")
    if (!invite.expiresAt || invite.expiresAt < new Date()) throw new Error("Invite expired")

    // check if already a member
    const existing = await db.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: user.id, workspaceId: invite.workspaceId } }
    })
    if (existing) throw new Error("Already a member")

    await db.workspaceMember.create({
        data: {
            userId: user.id,
            workspaceId: invite.workspaceId,
            role: invite.role,  // 👈 use role from invite
        }
    })

    await db.workspaceInvite.delete({ where: { id: invite.id } })

    return { success: true }
}

export const getAllWorkspaceMembers = async (workspaceId: string) => {
    return await db.workspaceMember.findMany({
        where: { workspaceId },
        include: { user: true }
    })
}

// 👇 helper to get current user's role in a workspace
export const getMyRole = async (workspaceId: string) => {
    const user = await currentUser()
    if (!user) return null

    const member = await db.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId: user.id, workspaceId } }
    })
    return member?.role ?? null
}

// 👇 update a member's role (admin only)
export const updateMemberRole = async (
    workspaceId: string,
    memberId: string,
    newRole: MEMBER_ROLE
) => {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    const requester = await db.workspaceMember.findFirst({
        where: { workspaceId, userId: user.id, role: MEMBER_ROLE.ADMIN }
    })
    if (!requester) throw new Error("Only admins can change roles")

    return await db.workspaceMember.update({
        where: { id: memberId },
        data: { role: newRole }
    })
}