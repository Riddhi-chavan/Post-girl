"use server"

import db from "@/lib/db"

export const createCollections = async (workspaceId: string, name: string) => {
    const collection = await db.collection.create({
        data: {
            name,
            workspace: {
                connect: {
                    id: workspaceId
                }
            }
        }
    })

    return collection
}

export const getCollections = async (workspaceId: string) => {
    const collections = await db.collection.findMany({
        where: {
            workspaceId
        }
    })
    return collections
}

export const deleteCollection = async (collectionId: string) => {
    await db.collection.delete({
        where: {
            id: collectionId
        }
    })
}

export const editCollection = async (collectionId: string, name: string) => {
    await db.collection.update({
        where: {
            id: collectionId
        },
        data: {
            name
        }
    })
}

export const exportCollection = async (collectionId: string) => {
    const collection = await db.collection.findUnique({
        where: { id: collectionId },
        include: { request: true }
    })

    if (!collection) throw new Error("Collection not found")

    // Convert to Postman v2.1 format
    const postmanCollection = {
        info: {
            name: collection.name,
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: collection.request.map((req) => {
            // Convert headers object back to Postman array format
            const parseStoredJson = (val: any) => {
                if (!val) return []
                if (typeof val === 'string') {
                    try { return JSON.parse(val) } catch { return [] }
                }
                return val
            }

            const headersArray = parseStoredJson(req.headers)
            const parametersObj = parseStoredJson(req.parameters)

            // Resolve body back to raw string
            const resolveBodyForExport = (body: any): string => {
                if (!body) return ''
                if (typeof body === 'object' && 'raw' in body) return body.raw
                if (typeof body === 'string') return body
                return JSON.stringify(body, null, 2)
            }

            return {
                name: req.name,
                request: {
                    method: req.method,
                    url: {
                        raw: req.url,
                        query: Array.isArray(parametersObj)
                            ? parametersObj.map((p: any) => ({ key: p.key, value: p.value }))
                            : Object.entries(parametersObj).map(([key, value]) => ({ key, value }))
                    },
                    header: Array.isArray(headersArray)
                        ? headersArray.map((h: any) => ({ key: h.key, value: h.value }))
                        : Object.entries(headersArray).map(([key, value]) => ({ key, value: String(value) })),
                    body: req.body ? {
                        mode: "raw",
                        raw: resolveBodyForExport(req.body),
                        options: { raw: { language: "json" } }
                    } : undefined
                }
            }
        })
    }

    return postmanCollection
}


