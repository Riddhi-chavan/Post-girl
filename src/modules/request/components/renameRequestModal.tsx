"use client";
import Modal from "@/components/ui/model";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { saveRequest } from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

const RenameRequestModal = ({
    isModalOpen,
    setIsModalOpen,
    request,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    request: { id: string; name: string; collectionId: string } | null;
}) => {
    const [name, setName] = useState(request?.name || "");
    const queryClient = useQueryClient();
    const { tabs, updateTab } = useRequestPlaygroundStore(); // 👈

    useEffect(() => {
        if (request) setName(request.name);
    }, [request]);

    const handleSubmit = async () => {
        if (!name.trim() || !request) return;
        try {
            await saveRequest(request.id, { ...request, name } as any);

            // 👇 if the request is open as a tab, sync the title too
            const openTab = tabs.find((t) => t.requestId === request.id);
            if (openTab) {
                updateTab(openTab.id, { title: name, unsavedChanges: false });
            }

            queryClient.invalidateQueries({ queryKey: ["request", request.collectionId] });
            toast.success("Request renamed");
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Failed to rename request");
        }
    };

    return (
        <Modal
            title="Rename Request"
            description="Give your request a new name"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            submitText="Save"
            submitVariant="default"
        >
            <Input
                className="w-full p-2 border rounded bg-zinc-900 text-white"
                placeholder="Request name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
            />
        </Modal>
    );
};

export default RenameRequestModal;