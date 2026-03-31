import type { Request, Response } from 'express'
import { z } from 'zod'
import {
    createAgent,
    getAgentStatus,
    getAgentsByUser,
    getAgentsByPool,
    suspendAgent,
    updateAgent,
} from '../services/agent.service'
import { logger } from '../lib/logger'

const CreateAgentSchema = z.object({
    poolId: z.string().uuid(),
    name: z.string().min(1),
    algoAddress: z.string().min(1),
    dailyLimitCents: z.number().int().min(1),
    vendorWhitelistHash: z.string().min(1),
})

const UpdateAgentSchema = z.object({
    name: z.string().min(1).optional(),
    dailyLimitCents: z.number().int().min(1).optional(),
    vendorWhitelistHash: z.string().min(1).optional(),
})

export async function create(req: Request, res: Response): Promise<void> {
    const parsed = CreateAgentSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
    }
    try {
        const agent = await createAgent({
            userId: req.userId!,
            poolId: parsed.data.poolId,
            name: parsed.data.name,
            algoAddr: parsed.data.algoAddress,
            dailyLimitCents: parsed.data.dailyLimitCents,
            vendorWhitelistHash: parsed.data.vendorWhitelistHash,
        })
        res.status(201).json(agent)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to create agent', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function getStatus(req: Request, res: Response): Promise<void> {
    try {
        const status = await getAgentStatus(req.params.agentId)
        res.json(status)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to get agent status', err)
            res.status(404).json({ error: err.message })
        }
    }
}

export async function listByUser(req: Request, res: Response): Promise<void> {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
        const agents = await getAgentsByUser(req.userId!, { limit, offset })
        res.json(agents)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to list agents', err)
            res.status(500).json({ error: err.message })
        }
    }
}

export async function listByPool(req: Request, res: Response): Promise<void> {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
        const agents = await getAgentsByPool(req.params.poolId, { limit, offset })
        res.json(agents)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to list agents by pool', err)
            res.status(500).json({ error: err.message })
        }
    }
}

export async function suspend(req: Request, res: Response): Promise<void> {
    try {
        const agent = await suspendAgent(req.params.agentId)
        res.json(agent)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to suspend agent', err)
            res.status(400).json({ error: err.message })
        }
    }
}

export async function update(req: Request, res: Response): Promise<void> {
    const parsed = UpdateAgentSchema.safeParse(req.body)
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() })
        return
    }
    try {
        const agent = await updateAgent({
            agentId: req.params.agentId,
            ...parsed.data,
        })
        res.json(agent)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to update agent', err)
            res.status(400).json({ error: err.message })
        }
    }
}