import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, ChevronRight, Folder } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
    collection: {
        id: string
        name: string
        updatedAt: Date
        workspaceId: string
    }
}
const CollectionFolder = ({ collection }: Props) => {
    const [isCollapsed, setIsCollapsed] = useState(false)
    return (
        <>
            <Collapsible open={isCollapsed} onOpenChange={setIsCollapsed} className='w-full'>
                <div className='flex w-full '>
                    <div className='flex flex-row justify-between items-center p-2 flex-1 w-full hover:bg-zinc-900 rounded-md'>
                        <CollapsibleTrigger className="flex flex-row justify-start items-center space-x-2 flex-1">
                            <div className="flex items-center space-x-1">

                                {isCollapsed ? (
                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                ) : (
                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                )
                                }
                                <Folder className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-zinc-200 capitalize">
                                    {collection.name}
                                </span>
                            </div>
                        </CollapsibleTrigger>
                    </div>
                </div>
            </Collapsible>
        </>
    )
}

export default CollectionFolder