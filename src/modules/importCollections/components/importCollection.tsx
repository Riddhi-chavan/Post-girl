// ImportCollectionButton.tsx
"use client"

import { useRef } from "react"
import { useImportCollection } from "../hooks/importCollection"
import { toast } from "sonner" // or whatever toast lib you use
import { Upload } from "lucide-react"

export function ImportCollectionButton({ workspaceId }: { workspaceId: any }) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: importCollection, isPending } = useImportCollection(workspaceId)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Reset so same file can be re-imported if needed
        e.target.value = ""

        const reader = new FileReader()
        reader.onload = (event) => {
            const jsonData = event.target?.result as string
            importCollection(jsonData, {
                onSuccess: (data) => {
                    if (data.success) {
                        toast.success("Collection imported successfully!")
                    } else {
                        toast.error(data.error ?? "Import failed")
                    }
                },
                onError: () => toast.error("Something went wrong")
            })
        }
        reader.readAsText(file)
    }

    return (
        <>
            <div className="space-y-3 w-full max-w-xs">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                >
                    <Upload className="w-4 h-4" />
                    {isPending ? "Importing..." : "Import"}
                </button>

            </div>

        </>
    )
}