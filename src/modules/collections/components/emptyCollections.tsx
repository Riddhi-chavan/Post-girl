import { ImportCollectionButton } from '@/modules/importCollections/components/importCollection'
import { useWorkspaceStore } from '@/modules/Layout/store'
import { useGetWorkspace } from '@/modules/workspace/hooks/workspace'
import { Archive, Upload } from 'lucide-react'
import React from 'react'

const EmptyCollections = () => {
    const { selectedWorkspace } = useWorkspaceStore()
    const { data: currentWorkspace } = useGetWorkspace(selectedWorkspace?.id!)
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
            <>
                <div className="mb-6">
                    <div className="w-24 h-24 border-2 border-zinc-700 rounded-lg flex items-center justify-center">
                        <Archive className="w-12 h-12 text-zinc-600" />
                    </div>
                </div>
                <h3 className="text-zinc-400 text-sm mb-2">Collections are empty</h3>
                <p className="text-zinc-500 text-xs mb-8 text-center">
                    Import or create a collection
                </p>
                <ImportCollectionButton workspaceId={currentWorkspace?.id} />
            </>
        </div>
    )
}

export default EmptyCollections