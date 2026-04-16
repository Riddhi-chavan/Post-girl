"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import TabbedSidebar from "@/modules/collections/components/sideBar"
import { useWorkspaceStore } from "@/modules/Layout/store"
import RequestPlayground from "@/modules/request/components/requestPlayground"
import { useGetWorkspace } from "@/modules/workspace/hooks/workspace"
import { Loader } from "lucide-react"


const Page = () => {
  const { selectedWorkspace } = useWorkspaceStore()
  const { data: currentWorkspace, isPending } = useGetWorkspace(selectedWorkspace?.id!)

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader className="animate-spin h-6 w-6  text-indigo-400" />
      </div>
    )
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-screen">
      <ResizablePanel defaultSize={65} minSize={40} >
        <RequestPlayground />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={35} maxSize={700} minSize={30} className="flex ">
        <div className="flex-1">
          <TabbedSidebar currentWorkspace={currentWorkspace!} />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default Page
