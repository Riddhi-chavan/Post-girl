"use server"
import db from "@/lib/db"

export const getRequestHistory = async (workspaceId: string) => {
    const runs = await db.requestRun.findMany({
        where: {
            request: {
                collection: {
                    workspaceId
                }
            }
        },
        include: {
            request: {
                select: {
                    id: true,
                    name: true,
                    method: true,
                    url: true,
                    collectionId: true,
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 200 // last 200 runs
    })

    // Group by day
    const grouped: Record<string, typeof runs> = {}
    runs.forEach(run => {
        const day = run.createdAt.toISOString().split('T')[0] // "2024-01-15"
        if (!grouped[day]) grouped[day] = []
        grouped[day].push(run)
    })

    return Object.entries(grouped).map(([date, runs]) => ({
        date,
        count: runs.length,
        runs
    }))
}