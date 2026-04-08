import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware"

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting'

type WsMessage = {
    id: string,
    type: "sent" | "received",
    data: any,
    timestamp: Date,
    raw?: string
}

type WsOptions = {
    onOpen?: (ev: Event) => void,
    onMessage?: (ev: MessageEvent) => void
    onClose?: (ev: CloseEvent) => void
    onError?: (ev: Event | Error) => void
    autoReconnect?: boolean
    reconnectDelay?: number
}

interface WsStore {
    // Connection state
    ws: WebSocket | null
    url: string | null
    status: ConnectionStatus
    error: string | null

    // Messages
    messages: WsMessage[]

    // Connection options
    options: WsOptions

    // Reconnection state
    reconnectAttempts: number
    maxReconnectAttempts: number
    reconnectTimeoutId: number | null

    // Editor draft (persist editor content globally)
    draftMessage: string

    // Computed getters
    isConnected: boolean
    isConnecting: boolean
    isReconnecting: boolean

    // Actions
    connect: (url: string, options?: WsOptions) => void
    disconnect: (code?: number, reason?: string) => void
    send: (data: string | object) => boolean
    clearMessages: () => void
    setError: (error: string | null) => void
    setDraftMessage: (message: string) => void

    // Internal actions
    setStatus: (status: ConnectionStatus) => void
    addMessage: (message: Omit<WsMessage, 'id' | 'timestamp'>) => void
    handleReconnect: () => void
    getReadyState: () => number
}


const getInitialState = () => ({
    ws: null,
    url: null,
    status: 'disconnected' as ConnectionStatus,
    error: null,
    messages: [],
    isConnected: false,
    draftMessage: '',
    options: {},
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectTimeoutId: null,
})

export const useWsStore = create<WsStore>()(
    //@ts-ignore
    subscribeWithSelector((set, get) => ({
        ...getInitialState(),

        // Computed getters
        get isConnected() {
            return get().status === 'connected'
        },

        get isConnecting() {
            return get().status === 'connecting'
        },

        get isReconnecting() {
            return get().status === 'reconnecting'
        },
    })
    )
)   
