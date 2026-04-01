import app from './app'
import dotenv from 'dotenv'
import { logger } from './lib/logger'

dotenv.config()

const PORT = process.env.PORT ?? 4000

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
