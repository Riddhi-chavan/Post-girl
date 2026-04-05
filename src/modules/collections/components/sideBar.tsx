import React, { useState } from 'react'
import { useCollections } from '../hooks/collections'
import { Archive, Clock, Code, ExternalLink, HelpCircle, Loader, Share2 } from 'lucide-react'

interface Props {
   currentWorkspace: {
      id: string,
      name: string
   }
}

export const TabbedSidebar = ({ currentWorkspace }: Props) => {
   const [activeTab, setActiveTab] = useState("Collection")
   const [isModelOpen, setIsModelOpen] = useState(false)

   const { data: collections, isPending } = useCollections(currentWorkspace?.id!)

   if (isPending) {
      return (
         <div className="flex flex-col items-center justify-center h-full">
            <Loader className="animate-spin h-6 w-6  text-indigo-400" />
         </div>
      )
   }

   const sidebarItems = [
      { icon: Archive, label: "Collection" },
      { icon: Clock, label: "History" },
      { icon: Share2, label: "Share" },
      { icon: Code, label: "Code" },
   ]

   const renderTabContent = () => {
      switch (activeTab) {
         case "Collection":
            return (
               <div className='h-full bg-zinc-950 text-zinc-100 flex flex-col'>
                  <div className='flex items-center justify-between p-4 border-b border-zinc-800'>
                     <div className='flex items-center  space-x-2'>
                        <span className='text-sm text-zinc-400'>{currentWorkspace?.name}</span>
                        <span className='text-zinc-600'> </span>
                        <span className='text-sm font-medium'>Collections</span>
                     </div>
                     <div className='flex items-center space-x-2'>
                        <HelpCircle className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
                        <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-300 cursor-pointer" />
                     </div>
                  </div>
               </div>
            )
         default:
            return <div className='p-4 text-zinc-400 '>Select a tab to view content</div>
      }
   }

   console.log("active tab", activeTab)
   return (
      <div className='flex h-screen bg-zinc-900'>
         <div className="w-12 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-4 space-y-4">
            {sidebarItems.map((item, index) => (
               <div
                  key={index}
                  onClick={() => setActiveTab(item.label)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${activeTab === item.label
                     ? 'bg-indigo-600 text-white'
                     : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800'
                     }`}
               >
                  <item.icon className="w-4 h-4" />
               </div>
            ))}
         </div>
         <div className='flex-1 bg-zinc-900 overflow-y-auto w-full text-white'>
            {renderTabContent()}
         </div>
      </div>
   )
}

export default TabbedSidebar