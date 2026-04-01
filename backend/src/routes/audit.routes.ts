import { Router } from 'express'
import { getAuditLogs } from '../services/audit.service'
import { logger } from '../lib/logger'
import type { Request, Response } from 'express'

const router: Router = Router()

router.get('/', async (req: Request, res: Response) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0
        const logs = await getAuditLogs(req.userId!, { limit, offset })
        res.json(logs)
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Failed to get audit logs', err)
            res.status(500).json({ error: err.message })
        }
    }
})

export default router