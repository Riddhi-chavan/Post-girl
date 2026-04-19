"use server"

import db from "@/lib/db"

export const createShareLink = async (requestId: string) => {
    // Check if already shared — reuse existing token
    const existing = await db.sharedRequest.findFirst({
        where: { requestId }
    })
    if (existing) return { token: existing.token }

    const shared = await db.sharedRequest.create({
        data: { requestId }
    })
    return { token: shared.token }
}

export const getSharedRequest = async (token: string) => {
    const shared = await db.sharedRequest.findUnique({
        where: { token },
        include: {
            request: {
                select: {
                    name: true,
                    method: true,
                    url: true,
                    headers: true,
                    parameters: true,
                    body: true,
                }
            }
        }
    })

    if (!shared) return null
    if (shared.expiresAt && shared.expiresAt < new Date()) return null

    return shared
}

export const deleteShareLink = async (requestId: string) => {
    await db.sharedRequest.deleteMany({
        where: { requestId }
    })
}

export const saveSharedRequestToAccount = async (userId: string, token: string) => {
    const shared = await db.sharedRequest.findUnique({
        where: { token },
        include: {
            request: {
                select: {
                    name: true,
                    method: true,
                    url: true,
                    headers: true,
                    parameters: true,
                    body: true,
                }
            }
        }
    })

    if (!shared) throw new Error("Shared request not found or expired")

    // Upsert — don't duplicate if already saved
    const saved = await db.savedSharedRequest.upsert({
        where: { userId_token: { userId, token } },
        update: {},
        create: {
            userId,
            token,
            requestSnapshot: shared.request as any,
        }
    })

    return saved
}

export const getRequestsSharedWithMe = async (userId: string) => {
    const saved = await db.savedSharedRequest.findMany({
        where: { userId },
        orderBy: { savedAt: 'desc' }
    })
    return saved
}

export const removeSavedSharedRequest = async (userId: string, id: string) => {
    await db.savedSharedRequest.delete({
        where: { id, userId }
    })
}