'use client'
import React, { useState } from 'react'
import { Copy, Check, Play, Loader, ArrowRight } from 'lucide-react'

interface Props {
    request: {
        name: string
        method: string
        url: string
        headers?: any
        parameters?: any
        body?: any
    }
    token: string
}

const methodColors: Record<string, string> = {
    GET: 'bg-green-900 text-green-300',
    POST: 'bg-blue-900 text-blue-300',
    PUT: 'bg-yellow-900 text-yellow-300',
    PATCH: 'bg-orange-900 text-orange-300',
    DELETE: 'bg-red-900 text-red-300',
}

export default function SharePageClient({ request, token }: Props) {
    const [copied, setCopied] = useState(false)
    const [isRunning, setIsRunning] = useState(false)
    const [response, setResponse] = useState<{
        status: number
        statusText: string
        data: any
        duration: number
    } | null>(null)
    const [runError, setRunError] = useState<string | null>(null)

    const handleCopyUrl = async () => {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const resolveHeaders = (headers: any): Record<string, string> => {
        if (!headers) return {}
        if (Array.isArray(headers)) {
            return headers.reduce((acc: any, h: any) => {
                if (h.key) acc[h.key] = h.value
                return acc
            }, {})
        }
        return headers
    }

    const resolveBody = (body: any): string | undefined => {
        if (!body) return undefined
        if (typeof body === 'object' && 'raw' in body) return body.raw
        if (typeof body === 'string') return body
        return JSON.stringify(body)
    }

    // Run the request directly from the browser
    const handleTryIt = async () => {
        setIsRunning(true)
        setResponse(null)
        setRunError(null)

        const start = performance.now()
        try {
            const headers = resolveHeaders(request.headers)
            const body = resolveBody(request.body)

            const res = await fetch(request.url, {
                method: request.method,
                headers,
                body: request.method !== 'GET' ? body : undefined,
            })

            const duration = Math.round(performance.now() - start)
            let data
            const contentType = res.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                data = await res.json()
            } else {
                data = await res.text()
            }

            setResponse({
                status: res.status,
                statusText: res.statusText,
                data,
                duration
            })
        } catch (err: any) {
            setRunError(err.message)
        } finally {
            setIsRunning(false)
        }
    }

    const statusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-green-400'
        if (status >= 400 && status < 500) return 'text-yellow-400'
        if (status >= 500) return 'text-red-400'
        return 'text-zinc-400'
    }

    const bodyStr = resolveBody(request.body)

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Top nav */}
            <div className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-indigo-400 font-bold text-lg">PostGirl</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-zinc-400 text-sm">Shared Request</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopyUrl}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-lg px-3 py-1.5 transition-colors hover:border-zinc-500"
                    >
                        {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied!' : 'Copy link'}
                    </button>
                    <a
                        href="/"
                        className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 py-1.5 transition-colors"
                    >
                        Open PostGirl
                        <ArrowRight className="w-3 h-3" />
                    </a>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
                {/* Request bar */}
                <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded font-mono shrink-0 ${methodColors[request.method] ?? 'bg-zinc-700 text-zinc-300'}`}>
                        {request.method}
                    </span>
                    <span className="text-zinc-200 font-medium text-sm mr-2 shrink-0">{request.name}</span>
                    <span className="text-zinc-500 font-mono text-xs truncate flex-1">{request.url}</span>
                    <button
                        onClick={handleTryIt}
                        disabled={isRunning}
                        className="shrink-0 flex items-center gap-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg transition-colors"
                    >
                        {isRunning
                            ? <><Loader className="w-3 h-3 animate-spin" /> Running...</>
                            : <><Play className="w-3 h-3" /> Try it</>
                        }
                    </button>
                </div>

                {/* Request details */}
                <div className="grid gap-4">
                    {request.headers && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-zinc-800">
                                <span className="text-xs font-medium text-zinc-400">Headers</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto">
                                {JSON.stringify(resolveHeaders(request.headers), null, 2)}
                            </pre>
                        </div>
                    )}

                    {bodyStr && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <div className="px-4 py-2.5 border-b border-zinc-800">
                                <span className="text-xs font-medium text-zinc-400">Body</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto">
                                {bodyStr}
                            </pre>
                        </div>
                    )}
                </div>

                {/* Response */}
                {(response || runError) && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-400">Response</span>
                            {response && (
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-mono font-bold ${statusColor(response.status)}`}>
                                        {response.status} {response.statusText}
                                    </span>
                                    <span className="text-xs text-zinc-500">{response.duration}ms</span>
                                </div>
                            )}
                        </div>
                        <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-80">
                            {runError
                                ? <span className="text-red-400">{runError}</span>
                                : JSON.stringify(response?.data, null, 2)
                            }
                        </pre>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center space-y-2 pt-4">
                    <p className="text-xs text-zinc-600">
                        Want to save and manage this request?
                    </p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Sign in to PostGirl and import it
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div >
        </div >
    )
}