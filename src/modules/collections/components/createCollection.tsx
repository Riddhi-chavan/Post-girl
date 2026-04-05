import React, { useState } from 'react'
import Model from "@/components/ui/model";
import { Input } from '@/components/ui/input';
import { useCreateCollection } from '../hooks/collections';
import { toast } from 'sonner';

interface Props {
    workspaceId: string,
    isModelOpen: boolean,
    setIsModelOpen: (open: boolean) => void
}

const CreateCollection = ({ workspaceId, isModelOpen, setIsModelOpen }: Props) => {
    const [name, setName] = useState("")
    const { mutateAsync, isPending } = useCreateCollection(workspaceId)


    const handleSubmit = async () => {
        if (!name.trim) return
        try {
            await mutateAsync(name)
            toast.success("Collection created successfully")
            setName("")
            setIsModelOpen(false)
        } catch (error) {
            toast.error("Failed to create collection")
            console.error("Failed to create collection", error)
        }
    }
    return (
        <Model
            title="Add New Collection"
            description="Create a new collection to organize your request"
            isOpen={isModelOpen}
            onClose={() => setIsModelOpen(false)}
            onSubmit={handleSubmit}
            submitText={isPending ? "Creating..." : "Create Collection"}
            submitVariant="default"

        >
            <div className="space-y-4">
                <Input
                    className="w-full p-2 border rounded-sm"
                    placeholder="Collection Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        </Model>
    )
}

export default CreateCollection