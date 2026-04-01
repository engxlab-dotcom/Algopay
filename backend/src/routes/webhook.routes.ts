import { Router } from 'express'
import {
    register,
    list,
    update,
    remove,
    retry,
    deliveries,
    rotateSecret,
} from '../controllers/webhook.controller'

const router: Router = Router()

router.post('/', register)
router.get('/', list)
router.patch('/:webhookId', update)
router.delete('/:webhookId', remove)
router.get('/:webhookId/deliveries', deliveries)
router.post('/deliveries/:deliveryId/retry', retry)
router.post('/:webhookId/rotate-secret', rotateSecret)

export default router