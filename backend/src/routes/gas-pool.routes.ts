import { Router } from 'express'
import {
    create,
    getBalance,
    topUp,
    updateSettings,
} from '../controllers/gas-pool.controller'

const router: Router = Router()

router.post('/', create)
router.get('/:apiKeyId/balance', getBalance)
router.post('/:apiKeyId/topup', topUp)
router.patch('/:apiKeyId/settings', updateSettings)

export default router