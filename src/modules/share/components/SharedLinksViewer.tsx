'use client'
import React, { useState } from 'react'
import { useRequestsSharedWithMe, useRemoveSavedSharedRequest } from '../hooks'
import { useRequestPlaygroundStore } from '@/modules/request/store/useRequestStore'
import { Loader, Share2, ExternalLink, Trash2, Clock } from 'lucide-react'
import { toast } from 'sonner'

const methodColors: Record<string, string> = {
    GET: 'bg-green-900 text-green-300',
    POST: 'bg-blue-900 text-blue-300',
    PUT: 'bg-yellow-900 text-yellow-300',
    PATCH: 'bg-orange-900 text-orange-300',
    DELETE: 'bg-red-900 text-red-300',
}

function formatDate(date: Date | string) {
    const d = new Date(date)
    const today = new Date().toISOString().split('T')[0]
    const dateStr = d.toISOString().split('T')[0]
    if (dateStr === today) return `Today at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function groupByDate(items: any[]) {
    const groups: Record<string, any[]> = {}
    items.forEach(item => {
        const date = new Date(item.savedAt).toISOString().split('T')[0]
        if (!groups[date]) groups[date] = []
        groups[date].push(item)
    })
    return Object.entries(groups).map(([date, items]) => ({ date, items }))
}

function formatGroupDate(dateStr: string) {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (dateStr === today) return 'Today'
    if (dateStr === yesterday) return 'Yesterday'
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

const SharedLinksViewer = () => {
    const { data, isPending, isError } = useRequestsSharedWithMe()
    const { mutate: remove } = useRemoveSavedSharedRequest()
    const { openRequestTab } = useRequestPlaygroundStore()
    const [removingId, setRemovingId] = useState<string | null>(null)

    const handleRemove = (id: string) => {
        setRemovingId(id)
        remove(id, {
            onSuccess: () => {
                toast.success("Removed")
                setRemovingId(null)
            },
            onError: () => {
                toast.error("Failed to remove")
                setRemovingId(null)
            }
        })
    }

    const handleOpen = (snapshot: any) => {
        // Open in playground as a new unsaved tab
        openRequestTab({
            id: `shared-${Date.now()}`,
            name: snapshot.name,
            method: snapshot.method,
            url: snapshot.url,
            headers: snapshot.headers,
            parameters: snapshot.parameters,
            body: snapshot.body,
        })
    }

    if (isPending) return (
        <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin h-5 w-5 text-indigo-400" />
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center h-full text-red-400 text-sm">
            Failed to load
        </div>
    )

    if (!data?.length) return (
        <div className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-zinc-600" />
            </div>
            <p className="text-sm text-zinc-400">No shared requests yet</p>
            <p className="text-xs text-zinc-600">
                When someone shares a request link with you and you save it, it appears here
            </p>
        </div>
    )

    const grouped = groupByDate(data)

    return (
        <div className="flex flex-col h-full">
            {/* Summary */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Saved requests</span>
                    <span className="text-lg font-semibold text-white">{data.length}</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Saved today</span>
                    <span className="text-lg font-semibold text-indigo-400">
                        {data.filter(d => new Date(d.savedAt).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length}
                    </span>
                </div>
            </div>

            {/* Grouped list */}
            <div className="flex-1 overflow-y-auto">
                {grouped.map(({ date, items }) => (
                    <div key={date}>
                        <div className="px-4 py-2 sticky top-0 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                            <Clock className="w-3 h-3 text-zinc-600" />
                            <span className="text-xs font-medium text-zinc-500">
                                {formatGroupDate(date)}
                            </span>
                            <span className="text-xs text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                {items.length}
                            </span>
                        </div>

                        {items.map((saved: any) => {
                            const snapshot = saved.requestSnapshot as any
                            return (
                                <div
                                    key={saved.id}
                                    className="px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                                >
                                    <div
                                        className="flex items-center gap-2 mb-1 cursor-pointer"
                                        onClick={() => handleOpen(snapshot)}
                                    >
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 ${methodColors[snapshot?.method ?? ''] ?? 'bg-zinc-700 text-zinc-300'}`}>
                                            {snapshot?.method}
                                        </span>
                                        <span className="text-xs text-zinc-200 truncate font-medium flex-1">
                                            {snapshot?.name}
                                        </span>
                                    </div>

                                    <p className="text-[10px] text-zinc-600 font-mono truncate mb-2">
                                        {snapshot?.url}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-zinc-600">
                                            {formatDate(saved.savedAt)}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={`/share/${saved.token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                                                title="View share page"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            <button
                                                onClick={() => handleRemove(saved.id)}
                                                disabled={removingId === saved.id}
                                                className="p-1.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors"
                                                title="Remove"
                                            >
                                                {removingId === saved.id
                                                    ? <Loader className="w-3 h-3 animate-spin" />
                                                    : <Trash2 className="w-3 h-3" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default SharedLinksViewer