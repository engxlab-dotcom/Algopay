import morgan from 'morgan';
import { logger } from '../lib/logger';
import { StreamOptions } from 'morgan';

const stream: StreamOptions = {
    write: (message: string) => logger.info(message.trim()),
}

export const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
)
