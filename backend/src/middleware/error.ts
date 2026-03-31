import { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    logger.error('unhandled error', { error: err });
    res.status(500).json({ error: 'Internal Server Error' });
}