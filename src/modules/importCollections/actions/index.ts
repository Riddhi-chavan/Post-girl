// actions.ts (add to your existing file)
"use server"

import db from "@/lib/db"
import { REST_METHOD } from "@prisma/client"

// ---- Types for Postman v2.1 format ----
interface PostmanHeader {
    key: string
    value: string
    disabled?: boolean
}

interface PostmanQueryParam {
    key: string
    value: string
    disabled?: boolean
}

interface PostmanUrl {
    raw: string
    query?: PostmanQueryParam[]
}

interface PostmanBody {
    mode: string
    raw?: string
    options?: { raw?: { language?: string } }
}

interface PostmanRequest {
    method: string
    url: string | PostmanUrl
    header?: PostmanHeader[]
    body?: PostmanBody
}

interface PostmanItem {
    name: string
    request: PostmanRequest
}

interface PostmanCollection {
    info: { name: string; schema?: string }
    item: PostmanItem[]
}

// ---- Helper to map Postman method → your REST_METHOD enum ----
const VALID_METHODS: REST_METHOD[] = ["GET", "POST", "PUT", "PATCH", "DELETE"]

function parseMethod(method: string): REST_METHOD {
    const upper = method.toUpperCase()
    return VALID_METHODS.includes(upper as REST_METHOD)
        ? (upper as REST_METHOD)
        : "GET"
}

// ---- Helper to extract URL string and query params ----
function parseUrl(url: string | PostmanUrl): { rawUrl: string; parameters: Record<string, string> | null } {
    if (typeof url === "string") {
        return { rawUrl: url, parameters: null }
    }

    const parameters: Record<string, string> = {}
    url.query?.forEach((q) => {
        if (!q.disabled && q.key) parameters[q.key] = q.value
    })

    return {
        rawUrl: url.raw,
        parameters: Object.keys(parameters).length > 0 ? parameters : null
    }
}

// ---- Helper to extract headers ----
function parseHeaders(headers?: PostmanHeader[]): Record<string, string> | null {
    if (!headers?.length) return null
    const result: Record<string, string> = {}
    headers.forEach((h) => {
        if (!h.disabled && h.key) result[h.key] = h.value
    })
    return Object.keys(result).length > 0 ? result : null
}

// ---- Helper to parse body ----
function parseBody(body?: PostmanBody): Record<string, unknown> | null {
    if (!body || body.mode !== "raw" || !body.raw) return null
    return { raw: body.raw }  // Keep it as a string under "raw" key
}

// ---- Main import action ----
export const importCollection = async (
    workspaceId: string,
    jsonData: string  // raw JSON string from the uploaded file
): Promise<{ success: boolean; collectionId?: string; error?: string }> => {
    try {
        const parsed: PostmanCollection = JSON.parse(jsonData)

        // Basic validation
        if (!parsed.info?.name || !Array.isArray(parsed.item)) {
            return { success: false, error: "Invalid Postman collection format" }
        }

        // Filter to only top-level requests (skip folders/nested items for now)
        const requestItems = parsed.item.filter((item) => item.request)

        // Create collection + all requests in one transaction
        const collection = await db.collection.create({
            data: {
                name: parsed.info.name,
                workspace: { connect: { id: workspaceId } },
                request: {
                    //@ts-ignore
                    create: requestItems.map((item) => {
                        const { rawUrl, parameters } = parseUrl(item.request.url)
                        return {
                            name: item.name,
                            method: parseMethod(item.request.method),
                            url: rawUrl,
                            parameters,
                            headers: parseHeaders(item.request.header),
                            body: parseBody(item.request.body)
                        }
                    })
                }
            }
        })

        return { success: true, collectionId: collection.id }
    } catch (err) {
        console.error("Import failed:", err)
        return { success: false, error: "Failed to parse or save the collection" }
    }
}