"use client";
import Modal from "@/components/ui/model";
import { useDeleteRequest } from "../hooks/request";
import React from "react";
import { toast } from "sonner";

const DeleteRequestModal = ({
    isModalOpen,
    setIsModalOpen,
    requestId,
    collectionId,
}: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    requestId: string;
    collectionId: string;
}) => {
    const { mutateAsync, isPending } = useDeleteRequest(requestId, collectionId);

    const handleDelete = async () => {
        try {
            await mutateAsync();
            toast.success("Request deleted successfully");
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Failed to delete request");
            console.error("Failed to delete request:", err);
        }
    };

    return (
        <Modal
            title="Delete Request"
            description="Are you sure you want to delete this request? This action cannot be undone."
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleDelete}
            submitText={isPending ? "Deleting..." : "Delete"}
            submitVariant="destructive"
        >
            <p className="text-sm text-zinc-500">
                Once deleted, this request and all its history will be permanently removed.
            </p>
        </Modal>
    );
};

export default DeleteRequestModal;