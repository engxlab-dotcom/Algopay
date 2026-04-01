export const logger = {
    info: (msg: string, meta?: object) =>
        console.log(JSON.stringify({ level: 'info', ts: new Date().toISOString(), msg, ...meta })),
    warn: (msg: string, meta?: object) =>
        console.warn(JSON.stringify({ level: 'warn', ts: new Date().toISOString(), msg, ...meta })),
    error: (msg: string, meta?: object) =>
        console.error(JSON.stringify({ level: 'error', ts: new Date().toISOString(), msg, ...meta })),
    debug: (msg: string, meta?: object) =>
        process.env.NODE_ENV === 'development' &&
        console.debug(JSON.stringify({ level: 'debug', ts: new Date().toISOString(), msg, ...meta })),
}