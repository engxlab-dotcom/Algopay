import { Router } from 'express'
import {
    create,
    getStatus,
    listByUser,
    listByPool,
    suspend,
    update,
} from '../controllers/agent.controller'

const router: Router = Router()

router.post('/', create)
router.get('/', listByUser)
router.get('/pool/:poolId', listByPool)
router.get('/:agentId', getStatus)
router.patch('/:agentId', update)
router.post('/:agentId/suspend', suspend)

export default router