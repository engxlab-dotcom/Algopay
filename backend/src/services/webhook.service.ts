import axios from 'axios';
import crypto from 'crypto';
import { WebhookEvent } from '../../generated/prisma/enums';
import { logger } from '../lib/logger';
import { db } from '../../db/client';
import { validateWebhookUrl } from '../lib/ssrf';

function generateSecret(): string {
    return `as_whsec_${crypto.randomBytes(32).toString('hex')}`;

}
function signPayload(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

async function deliverWebhook(params: {
    url: string,
    payload: object,
    secret: string,
    deliveryId: string,
}): Promise<{ httpStatus: number; success: boolean }> {

    const payload = JSON.stringify(params.payload);
    const sig = signPayload(payload, params.secret);

    try {
        const res = await axios.post(params.url, params.payload, {
            headers: {
                'Content-Type': 'application/json',
                'X-AlgoStack-Signature': sig,
                'X-AlgoStack-Delivery': params.deliveryId,
            },
            timeout: 10000,
        });
        return {
            httpStatus: res.status,
            success: res.status >= 200 && res.status < 300,
        }
    } catch (err: any) {
        const httpStatus = err.response?.status ?? 0
        return { httpStatus, success: false }
    }
}


async function retryWithBackoff(
    fn: () => Promise<{ httpStatus: number; success: boolean }>,
    maxRetries = 3
): Promise<{ httpStatus: number; success: boolean; retries: number }> {
    let retries = 0
    let lastResult = { httpStatus: 0, success: false }

    while (retries <= maxRetries) {
        lastResult = await fn()
        if (lastResult.success) return { ...lastResult, retries }

        retries++
        if (retries <= maxRetries) {
            const delay = Math.pow(2, retries) * 1000
            logger.warn(`Webhook retry ${retries} in ${delay / 1000}s`)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }

    return { ...lastResult, retries }
}

export async function registerWebhook(params: {
    userId: string
    url: string
    events: WebhookEvent[]
}) {
    await validateWebhookUrl(params.url)
    const secret = generateSecret()

    const webhook = await db.webhook.create({
        data: {
            userId: params.userId,
            url: params.url,
            events: params.events,
            secret,
            active: true,
        },
    })
    logger.info(`webhook registered: ${webhook.id}`)
    return { ...webhook, secret }
}


export async function getWebhooksByUser(userId: string) {
    return await db.webhook.findMany({
        where: {
            userId
        },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            url: true,
            events: true,
            active: true,
            createdAt: true,
        }
    })
}

export async function updateWebhook(params: {
    webhookId: string
    userId: string
    url?: string
    events?: WebhookEvent[]
    active?: boolean
}) {
    if (params.url) {
        await validateWebhookUrl(params.url)
    }
    const webhook = await db.webhook.findUnique({
        where: { id: params.webhookId },
    })
    if (!webhook) throw new Error('Webhook not found')
    if (webhook.userId !== params.userId) throw new Error('Unauthorized')

    return db.webhook.update({
        where: { id: params.webhookId },
        data: {
            ...(params.url !== undefined && { url: params.url }),
            ...(params.events !== undefined && { events: params.events }),
            ...(params.active !== undefined && { active: params.active }),
        },
    })
}

export async function deleteWebhook(webhookId: string, userId: string) {
    const webhook = await db.webhook.findUnique({
        where: { id: webhookId },
    })
    if (!webhook) throw new Error('Webhook not found')
    if (webhook.userId !== userId) throw new Error('Unauthorized')

    await db.webhook.update({
        where: { id: webhookId },
        data: { active: false },
    })
    logger.info(`Webhook soft deleted: ${webhookId}`)
}


export async function triggerWebhook(params: {
    userId: string,
    event: WebhookEvent,
    paymentId?: string
    payload: object
}) {

    const webhooks = await db.webhook.findMany({
        where: {
            userId: params.userId,
            active: true,
            events: {
                has: params.event
            }
        }
    })

    if (webhooks.length === 0) {
        logger.info(`No webhooks registered for event: ${params.event}`)
        return
    }

    for (const it of webhooks) {
        const delivery = await db.webhookDelivery.create({
            data: {
                webhookId: it.id,
                paymentId: params.paymentId,
                event: params.event,
                payload: params.payload,
                success: false,
            },
        })

        const result = await retryWithBackoff(
            () => deliverWebhook({
                url: it.url,
                payload: params.payload,
                secret: it.secret,
                deliveryId: delivery.id,
            })
        )
        await db.webhookDelivery.update({
            where: { id: delivery.id },
            data: {
                httpStatus: result.httpStatus,
                success: result.success,
                retries: result.retries,
                deliveredAt: result.success ? new Date() : null,
            },
        })

        logger.info(`Webhook ${it.id} delivery: ${result.success ? 'success' : 'failed'} after ${result.retries} retries`)

    }
}

export async function retryDelivery(deliveryId: string, userId: string) {
    const delivery = await db.webhookDelivery.findUnique({
        where: { id: deliveryId },
        include: { webhook: true },
    })

    if (!delivery) throw new Error('Delivery not found')
    if (delivery.webhook.userId !== userId) throw new Error('Unauthorized')

    const result = await deliverWebhook({
        url: delivery.webhook.url,
        payload: delivery.payload as object,
        secret: delivery.webhook.secret,
        deliveryId: delivery.id,
    })

    return db.webhookDelivery.update({
        where: { id: deliveryId },
        data: {
            httpStatus: result.httpStatus,
            success: result.success,
            retries: delivery.retries + 1,
            deliveredAt: result.success ? new Date() : null,
        },
    })
}

export async function getDeliveries(webhookId: string, userId: string) {
    const webhook = await db.webhook.findUnique({
        where: { id: webhookId },
    })
    if (!webhook) throw new Error('Webhook not found')
    if (webhook.userId !== userId) throw new Error('Unauthorized')

    return db.webhookDelivery.findMany({
        where: { webhookId },
        orderBy: { createdAt: 'desc' },
        take: 50,
    })
}


export async function rotateWebhookSecret(webhookId: string, userId: string) {
    const webhook = await db.webhook.findUnique({
        where: { id: webhookId },
    })
    if (!webhook) throw new Error('Webhook not found')
    if (webhook.userId !== userId) throw new Error('Unauthorized')

    const newSecret = generateSecret()

    const updated = await db.webhook.update({
        where: { id: webhookId },
        data: { secret: newSecret },
    })

    logger.info(`Webhook secret rotated: ${webhookId}`)
    return { ...updated, secret: newSecret }
}