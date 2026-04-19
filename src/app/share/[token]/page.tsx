import { getSharedRequest } from "@/modules/share/actions"
import { notFound } from "next/navigation"
import SharePageClient from "./SharePageClient"

export default async function SharedRequestPage({
    params
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    const shared = await getSharedRequest(token)
    if (!shared) return notFound()

    return <SharePageClient request={shared.request} token={token} />
}