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