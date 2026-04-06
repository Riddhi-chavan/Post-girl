import React from 'react'
import { RequestTab } from '../store/useRequestStore'

interface Props {
    tab: RequestTab,
    updateTab: (id: string, data: Partial<RequestTab>) => void
}
const RequestEditorArea = ({ tab, updateTab }: Props) => {
    return (
        <div>RequestEditorArea</div>
    )
}

export default RequestEditorArea