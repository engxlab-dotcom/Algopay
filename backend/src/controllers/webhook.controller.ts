import type { Request, Response } from 'express'
import { z } from 'zod'
import {
    registerWebhook,
    getWebhooksByUser,
    updateWebhook,
    deleteWebhook,
    retryDelivery,
    getDeliveries,
    rotateWebhookSecret,
} from '../services/webhook.service'
import { logger } from '../lib/logger'

const WebhookEventEnum = z.enum([
    'payment_settled',
    'payment_failed',
    'pool_low',
])

const RegisterSchema = z.object({
    url: z.string().url(),
    events: z.array(WebhookEventEnum).min(1),
})

const UpdateSchema = z.object({
    url: z.string().url().optional(),
    events: z.array(WebhookEventEnum).min(1).optional(),
    active: z.boolean().optional(),
})

export async function register(req: Request, res: Response): Promise<void> {
    const parsed = RegisterSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
    }
    try {
        const webhook = await registerWebhook({
            userId: req.userId!,
            url: parsed.data.url,
            events: parsed.data.events,
        })
        res.status(201).json(webhook)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to register webhook', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function list(req: Request, res: Response): Promise<void> {
    try {
        const webhooks = await getWebhooksByUser(req.userId!)
        res.json(webhooks)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to list webhooks', err)
            res.status(500).json({ error: err.message })
        }
    }
}

export async function update(req: Request, res: Response): Promise<void> {
    const parsed = UpdateSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
    }
    try {
        const webhook = await updateWebhook({
            webhookId: req.params.webhookId,
            userId: req.userId!,
            ...parsed.data,
            events: parsed.data.events,
        })
        res.json(webhook)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to update webhook', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function remove(req: Request, res: Response): Promise<void> {
    try {
        await deleteWebhook(req.params.webhookId, req.userId!)
        res.json({ success: true })
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to delete webhook', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function retry(req: Request, res: Response): Promise<void> {
    try {
        const delivery = await retryDelivery(req.params.deliveryId, req.userId!)
        res.json(delivery)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to retry delivery', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function deliveries(req: Request, res: Response): Promise<void> {
    try {
        const result = await getDeliveries(req.params.webhookId, req.userId!)
        res.json(result)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to get deliveries', err)
            res.status(500).json({ error: err.message })
        }
    }
}

export async function rotateSecret(req: Request, res: Response): Promise<void> {
    try {
        const result = await rotateWebhookSecret(req.params.webhookId, req.userId!)
        res.json(result)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to rotate webhook secret', err)
            res.status(400).json({ error: err.message })
        }
    }
}