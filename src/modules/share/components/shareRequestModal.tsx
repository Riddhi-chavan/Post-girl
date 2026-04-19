'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Copy, Check, Link, Trash2, Loader } from 'lucide-react'
import { createShareLink, deleteShareLink } from '@/modules/share/actions'
import { toast } from 'sonner'

interface Props {
    isOpen: boolean
    setIsOpen: (v: boolean) => void
    requestId: string
    requestName: string
}

const ShareRequestModal = ({ isOpen, setIsOpen, requestId, requestName }: Props) => {
    const [token, setToken] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isRevoking, setIsRevoking] = useState(false)

    const shareUrl = token
        ? `${window.location.origin}/share/${token}`
        : null

    const handleGenerateLink = async () => {
        setIsLoading(true)
        try {
            const result = await createShareLink(requestId)
            setToken(result.token)
        } catch {
            toast.error("Failed to generate link")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopy = async () => {
        if (!shareUrl) return
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast.success("Link copied!")
    }

    const handleRevoke = async () => {
        setIsRevoking(true)
        try {
            await deleteShareLink(requestId)
            setToken(null)
            toast.success("Link revoked")
        } catch {
            toast.error("Failed to revoke link")
        } finally {
            setIsRevoking(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="w-4 h-4 text-indigo-400" />
                        Share Request
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    <p className="text-sm text-zinc-400">
                        Share <span className="text-white font-medium">"{requestName}"</span> via a public link.
                        Anyone with the link can view this request.
                    </p>

                    {!token ? (
                        <Button
                            onClick={handleGenerateLink}
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isLoading
                                ? <><Loader className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                                : <><Link className="w-4 h-4 mr-2" /> Generate Share Link</>
                            }
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            {/* Link display */}
                            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2">
                                <span className="text-xs font-mono text-zinc-300 flex-1 truncate">
                                    {shareUrl}
                                </span>
                                <button
                                    onClick={handleCopy}
                                    className="shrink-0 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {copied
                                        ? <Check className="w-4 h-4 text-green-400" />
                                        : <Copy className="w-4 h-4" />
                                    }
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCopy}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                >
                                    {copied ? <><Check className="w-4 h-4 mr-2" />Copied!</> : <><Copy className="w-4 h-4 mr-2" />Copy Link</>}
                                </Button>
                                <Button
                                    onClick={handleRevoke}
                                    disabled={isRevoking}
                                    variant="outline"
                                    className="border-red-800 text-red-400 hover:bg-red-950 hover:text-red-300"
                                >
                                    {isRevoking
                                        ? <Loader className="w-4 h-4 animate-spin" />
                                        : <Trash2 className="w-4 h-4" />
                                    }
                                </Button>
                            </div>

                            <p className="text-xs text-zinc-600 text-center">
                                Revoke the link anytime to stop sharing
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareRequestModal