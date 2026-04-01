import { AuditAction } from "../../generated/prisma/enums"
import { db } from "../../db/client"

export async function createAuditLog(params: {
    userId: string
    action: AuditAction
    metadata?: object
    ipAddress?: string
    requestId?: string
}) {
    return db.auditLog.create({
        data: {
            userId: params.userId,
            action: params.action,
            metadata: params.metadata as any,
            ipAddress: params.ipAddress,
            requestId: params.requestId,
        },
    })
}

export async function getAuditLogs(
    userId: string,
    filters?: { limit?: number; offset?: number }
) {
    return db.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: filters?.limit ?? 50,
        skip: filters?.offset ?? 0,
    })
}