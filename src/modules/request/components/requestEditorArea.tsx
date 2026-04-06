import React from 'react'
import { RequestTab } from '../store/useRequestStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KeyValueFormsEditor from './keyValueForms';

interface Props {
    tab: RequestTab,
    updateTab: (id: string, data: Partial<RequestTab>) => void
}
const RequestEditorArea = ({ tab, updateTab }: Props) => {
    return (
        <Tabs defaultValue='parameters' className='bg-zinc-900 rounded-md w-full px-4 py-4'>
            <TabsList className='bg-zinc-800 rounded-t-md'>
                <TabsTrigger value="parameters" className="flex-1">
                    Parameters
                </TabsTrigger>
                <TabsTrigger value="headers" className="flex-1">
                    Headers
                </TabsTrigger>
                <TabsTrigger value="body" className="flex-1">
                    Body
                </TabsTrigger>
            </TabsList>
            <TabsContent value='parameters'>
                <KeyValueFormsEditor
                    initialData={[{
                        key: "riddhi", value: "riddhi", enabled: true
                    }]}
                    onSubmit={() => { }}
                    placeholder={{
                        key: "Parameter Name",
                        value: "Parameter Value",
                        description: "URL Parameter",
                    }}
                />
            </TabsContent>
            <TabsContent value='headers'>

            </TabsContent>
            <TabsContent value='body'>

            </TabsContent>
        </Tabs>
    )
}

export default RequestEditorArea