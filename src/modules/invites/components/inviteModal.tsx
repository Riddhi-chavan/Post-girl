// modules/invites/components/InviteModal.tsx
"use client";
import Modal from "@/components/ui/model";
import { useState } from "react";
import { toast } from "sonner";
import { MEMBER_ROLE } from "@prisma/client";
import { useGenerateWorkspaceInvite } from "../hooks/invite";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const roleDescriptions: Record<MEMBER_ROLE, string> = {
    ADMIN: "Full access — invite members, edit everything",
    EDITOR: "Can edit collections and requests, cannot invite",
    VIEWER: "Can view and run requests only",
};

const InviteModal = ({
    isModalOpen,
    setIsModalOpen,
    workspaceId,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    workspaceId: string;
}) => {
    const [role, setRole] = useState<MEMBER_ROLE>(MEMBER_ROLE.VIEWER);
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { mutateAsync, isPending } = useGenerateWorkspaceInvite(workspaceId);

    const handleGenerate = async () => {
        try {
            const link = await mutateAsync(role);
            setInviteLink(link);
            toast.success("Invite link generated");
        } catch (err: any) {
            toast.error(err.message || "Failed to generate invite");
        }
    };

    const handleCopy = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClose = () => {
        setInviteLink(null);
        setRole(MEMBER_ROLE.VIEWER);
        setIsModalOpen(false);
    };

    return (
        <Modal
            title="Invite Member"
            description="Generate an invite link and assign a role"
            isOpen={isModalOpen}
            onClose={handleClose}
            onSubmit={handleGenerate}
            submitText={isPending ? "Generating..." : "Generate Link"}
            submitVariant="default"
        >
            <div className="flex flex-col gap-4">
                {/* Role selector */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-zinc-400">Role</label>
                    <Select value={role} onValueChange={(v) => setRole(v as MEMBER_ROLE)}>
                        <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(MEMBER_ROLE).map((r) => (
                                <SelectItem key={r} value={r}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{r}</span>
                                        <span className="text-xs text-zinc-400">{roleDescriptions[r]}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Generated link */}
                {inviteLink && (
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-zinc-400">Invite Link</label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={inviteLink}
                                className="bg-zinc-900 text-zinc-300 text-xs"
                            />
                            <Button variant="outline" size="icon" onClick={handleCopy}>
                                {copied
                                    ? <Check className="w-4 h-4 text-green-400" />
                                    : <Copy className="w-4 h-4" />
                                }
                            </Button>
                        </div>
                        <p className="text-xs text-zinc-500">
                            This link expires in 7 days and is single-use.
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default InviteModal;