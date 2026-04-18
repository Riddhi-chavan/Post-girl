'use client'
import React, { useState } from 'react'
import { useRequestPlaygroundStore } from '@/modules/request/store/useRequestStore'
import { useRequestHistory } from '@/modules/history/hooks/history'
import { useWorkspaceStore } from '@/modules/Layout/store'
import { Loader, ChevronDown, ChevronRight, Clock } from 'lucide-react'

const methodColors: Record<string, string> = {
    GET: 'bg-green-900 text-green-300',
    POST: 'bg-blue-900 text-blue-300',
    PUT: 'bg-yellow-900 text-yellow-300',
    PATCH: 'bg-orange-900 text-orange-300',
    DELETE: 'bg-red-900 text-red-300',
}

const statusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 400 && status < 500) return 'text-yellow-400'
    if (status >= 500) return 'text-red-400'
    return 'text-zinc-400'
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (dateStr === today.toISOString().split('T')[0]) return 'Today'
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

function formatTime(date: Date | string) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const HistoryViewer = () => {
    const { selectedWorkspace } = useWorkspaceStore()
    const { data, isPending, isError } = useRequestHistory(selectedWorkspace?.id ?? '')
    const { openRequestTab } = useRequestPlaygroundStore()
    const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({ [new Date().toISOString().split('T')[0]]: true })

    const toggleDay = (date: string) => {
        setExpandedDays(prev => ({ ...prev, [date]: !prev[date] }))
    }

    if (isPending) return (
        <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin h-5 w-5 text-indigo-400" />
        </div>
    )

    if (isError) return (
        <div className="flex items-center justify-center h-full text-red-400 text-sm">
            Failed to load history
        </div>
    )

    if (!data?.length) return (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-500">
            <Clock className="w-10 h-10 text-zinc-700" />
            <span className="text-sm">No request history yet</span>
            <span className="text-xs text-zinc-600">Send a request to see it here</span>
        </div>
    )

    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Summary bar */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Total runs</span>
                    <span className="text-lg font-semibold text-white">
                        {data.reduce((acc, d) => acc + d.count, 0)}
                    </span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Active days</span>
                    <span className="text-lg font-semibold text-white">{data.length}</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Today</span>
                    <span className="text-lg font-semibold text-indigo-400">
                        {data.find(d => d.date === new Date().toISOString().split('T')[0])?.count ?? 0}
                    </span>
                </div>
            </div>

            {/* Activity heatmap strip */}
            <div className="px-4 py-3 border-b border-zinc-800">
                <span className="text-xs text-zinc-500 mb-2 block">Last {data.length} days activity</span>
                <div className="flex gap-1 flex-wrap">
                    {data.slice(0, 30).reverse().map(d => {
                        const intensity = Math.min(d.count, 10) / 10
                        const opacity = 0.2 + intensity * 0.8
                        return (
                            <div
                                key={d.date}
                                title={`${formatDate(d.date)}: ${d.count} runs`}
                                style={{ opacity }}
                                className="w-4 h-4 rounded-sm bg-indigo-500 cursor-pointer hover:ring-1 hover:ring-indigo-400"
                            />
                        )
                    })}
                </div>
            </div>

            {/* Grouped runs list */}
            <div className="flex-1 overflow-y-auto">
                {data.map(({ date, count, runs }) => (
                    <div key={date} className="border-b border-zinc-800">
                        {/* Day header */}
                        <button
                            onClick={() => toggleDay(date)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {expandedDays[date]
                                    ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                                    : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                                }
                                <span className="text-sm font-medium text-zinc-200">
                                    {formatDate(date)}
                                </span>
                            </div>
                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                                {count} {count === 1 ? 'run' : 'runs'}
                            </span>
                        </button>

                        {/* Runs for that day */}
                        {expandedDays[date] && (
                            <div className="ml-4 border-l border-zinc-800 pl-3 pb-2">
                                {runs.map(run => (
                                    <div
                                        key={run.id}
                                        onClick={() => run.request && openRequestTab(run.request)}
                                        className="flex items-center gap-2 py-2 px-2 hover:bg-zinc-900 rounded-md cursor-pointer group"
                                    >
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0 ${methodColors[run.request?.method ?? ''] ?? 'bg-zinc-700 text-zinc-300'}`}>
                                            {run.request?.method}
                                        </span>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-xs text-zinc-200 truncate">
                                                {run.request?.name || run.request?.url}
                                            </span>
                                            <span className="text-[10px] text-zinc-600 truncate">
                                                {run.request?.url}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                                            <span className={`text-[10px] font-mono font-bold ${statusColor(run.status)}`}>
                                                {run.status || '—'}
                                            </span>
                                            <span className="text-[10px] text-zinc-600">
                                                {formatTime(run.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistoryViewer