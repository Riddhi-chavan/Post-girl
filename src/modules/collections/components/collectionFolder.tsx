import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, ChevronRight, Edit, EllipsisVertical, FilePlus, Folder, Loader, Trash } from 'lucide-react'
import React, { useState } from 'react'
import EditCollectionModel from './editCollectionsModel'
import DeleteCollectionModel from './deleteCollectionsModel'
import AddRequestCollectionModal from './addRequestModal'
import { useGetAllRequestFromCollection } from '@/modules/request/hooks/request'
import { REST_METHOD } from '@prisma/client'

interface Props {
    collection: {
        id: string
        name: string
        updatedAt: Date
        workspaceId: string
    }
}
const CollectionFolder = ({ collection }: Props) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddRequestOpen, setIsAddRequestOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { data: requestData, isPending, isError } = useGetAllRequestFromCollection(collection.id)

    const requestColorMap: Record<REST_METHOD, string> = {
        [REST_METHOD.GET]: "text-green-500",
        [REST_METHOD.POST]: "text-indigo-500",
        [REST_METHOD.PUT]: "text-yellow-500",
        [REST_METHOD.DELETE]: "text-red-500",
        [REST_METHOD.PATCH]: "text-orange-500",

    };

    const hasRequest = requestData && requestData.length > 0



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
                        <div className='flex flex-row justify-center items-center space-x-2'>
                            <FilePlus className='h-4 w-4 text-zinc-400 hover:text-indigo-400 cursor-pointer' onClick={() => setIsAddRequestOpen(true)} />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1 hover:bg-zinc-800 rounded">
                                        <EllipsisVertical className="w-4 h-4 text-zinc-400 hover:text-indigo-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuItem onClick={() => setIsAddRequestOpen(true)}>
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <div className="font-semibold flex justify-center items-center">
                                                <FilePlus className="text-green-400 mr-2 w-4 h-4" />
                                                Add Request
                                            </div>
                                            <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                                                <span className='text-[7px] mr-[2px] text-center align-middle'>⌘</span>R
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <div className="font-semibold flex justify-center items-center">
                                                <Edit className="text-blue-400 mr-2 w-4 h-4" />
                                                Edit
                                            </div>
                                            <span className="text-xs text-zinc-400 bg-zinc-700 px-1 rounded">
                                                <span className='text-[7px] mr-[2px] text-center align-middle'>⌘</span>E
                                            </span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setIsDeleteOpen(true)}>
                                        <div className="flex flex-row justify-between items-center w-full">
                                            <div className="font-semibold flex justify-center items-center">
                                                <Trash className="text-red-400 mr-2 w-4 h-4" />
                                                Delete
                                            </div>
                                            <span className="text-[10px] text-zinc-400 bg-zinc-700 px-1 rounded">
                                                <span className='text-[7px] mr-[2px] text-center align-middle'>⌘</span>D
                                            </span>

                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div >
                <CollapsibleContent className='w-full'>
                    {
                        isPending ? (
                            <div className="pl-8 py-2">
                                <div className="flex items-center space-x-2">
                                    <Loader size={16} className='text-indigo-400 animate-spin' />
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="pl-8 py-2">
                                <span className="text-xs text-red-400">
                                    Failed to load requests
                                </span>
                            </div>
                        ) : hasRequest ? (
                            <div className="ml-6 border-l border-zinc-800 pl-4 space-y-1">
                                {requestData.map((request: any) => (
                                    <div
                                        key={request.id}
                                        // onClick={() => openRequestTab(request)}
                                        className="flex items-center justify-between py-2 px-3 hover:bg-zinc-900/50 rounded-md cursor-pointer group transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 flex-1">
                                            <div className="flex items-center space-x-2">
                                                {/* @ts-ignore */}
                                                <span
                                                    className={`text-xs font-bold px-2 py-1 rounded ${requestColorMap[request.method as keyof typeof requestColorMap] ?? ''
                                                        } bg-zinc-800`}
                                                >
                                                    {request.method}
                                                </span>
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                                            </div>
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-sm text-zinc-200 truncate font-medium">
                                                    {request.name || request.url}
                                                </span>
                                                {request.url && request.name && (
                                                    <span className="text-xs text-zinc-500 truncate">
                                                        {request.url}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1 hover:bg-zinc-800 rounded">
                                                        <EllipsisVertical className="w-3 h-3 text-zinc-400" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-32">
                                                    <DropdownMenuItem>
                                                        <Edit className="text-blue-400 mr-2 w-3 h-3" />

                                                        Edit

                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Trash className="text-red-400 mr-2 w-3 h-3" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="pl-8 py-2">
                                <span className="text-xs text-zinc-500 italic">
                                    No requests yet
                                </span>
                            </div>
                        )}
                </CollapsibleContent>
            </Collapsible >

            <EditCollectionModel
                isModalOpen={isEditOpen}
                setIsModalOpen={setIsEditOpen}
                collectionId={collection.id}
                initialName={collection.name}
            />

            <DeleteCollectionModel
                isModalOpen={isDeleteOpen}
                setIsModalOpen={setIsDeleteOpen}
                collectionId={collection.id}
            />

            <AddRequestCollectionModal
                isModalOpen={isAddRequestOpen}
                setIsModalOpen={setIsAddRequestOpen}
                collectionId={collection.id}
                initialName="Untitled Request"
            />
        </>
    )
}

export default CollectionFolder