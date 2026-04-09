"use server"
import db from "@/lib/db"
import { currentUser } from "@/modules/authentication/actions"
import { MEMBER_ROLE } from "@prisma/client"
import { randomBytes } from "crypto"
import { success } from "zod"


export const generateWorkspaceInvite = async (workspaceId: string) => {
    const token = randomBytes(16).toString("hex")
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    const invites = await db.workspaceInvite.create({
        data: {
            workspaceId,
            token,
            createdById: user.id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),

        }
    })

    return `${process.env.NEXT_PUBLIC_APP_URL}/invites/${invites.token}`
}

export const acceptWorkspaceInvite = async (token: string) => {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")
    const invite = await db.workspaceInvite.findUnique({
        where: {
            token
        }
    })
    if (!invite) throw new Error("Invalid Invite")
    if (!invite.expiresAt || invite.expiresAt < new Date()) throw new Error("Invite expired")

    await db.workspaceMember.create({
        data: {
            userId: user.id,
            workspaceId: invite.workspaceId,
            role: MEMBER_ROLE.VIEWER
        }
    })

    await db.workspaceInvite.delete({
        where: { id: invite.id }
    })

    return { success: true }
}


export const getAllWorkspaceMembers = async (workspaceId: string) => {
    return await db.workspaceMember.findMany({
        where: {
            workspaceId
        },
        include: { user: true }
    })
}

