const MAX_ID_LENGTH = 200
const MAX_STRING_LENGTH = 1000
const SAFE_ID_REGEX = /^[a-zA-Z0-9\-_.]+$/
const DANGEROUS_CHARS = /[<>'"`;(){}[\]\\]/g

export function sanitizeId(id: unknown, name: string): string {
    if (!id || typeof id !== 'string') {
        throw new TypeError(`${name} must be a non-empty string`)
    }
    if (id.trim().length === 0) {
        throw new TypeError(`${name} cannot be blank`)
    }
    if (id.length > MAX_ID_LENGTH) {
        throw new RangeError(`${name} exceeds maximum length of ${MAX_ID_LENGTH}`)
    }
    if (id.includes('..')) {
        throw new Error(`${name} contains invalid path traversal sequence`)
    }
    if (!SAFE_ID_REGEX.test(id)) {
        throw new Error(`${name} contains invalid characters`)
    }
    return id
}

export function sanitizeString(value: unknown, name: string): string {
    if (typeof value !== 'string') {
        throw new TypeError(`${name} must be a string`)
    }
    if (value.length > MAX_STRING_LENGTH) {
        throw new RangeError(`${name} exceeds maximum length`)
    }
    return value.replace(DANGEROUS_CHARS, '')
}

export function sanitizePositiveInt(value: unknown, name: string): number {
    const num = Number(value)
    if (!Number.isInteger(num) || num < 0) {
        throw new TypeError(`${name} must be a non-negative integer`)
    }
    if (num > Number.MAX_SAFE_INTEGER) {
        throw new RangeError(`${name} exceeds maximum safe integer`)
    }
    return num
}

export function sanitizeUrl(url: unknown, name: string): string {
    if (!url || typeof url !== 'string') {
        throw new TypeError(`${name} must be a non-empty string`)
    }
    try {
        const parsed = new URL(url)
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error(`${name} must use HTTP or HTTPS protocol`)
        }
        return url
    } catch (err: any) {
        throw new Error(err.message ?? `${name} is not a valid URL`)
    }
}

export function sanitizeParams(
    params: Record<string, string | number | undefined>
): Record<string, string> {
    const clean: Record<string, string> = {}
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue
        const str = String(value)
        clean[key] = str
            .replace(/\.\./g, '')
            .replace(DANGEROUS_CHARS, '')
            .trim()
    }
    return clean
}

export function sanitizeWebhookEvents(events: unknown[]): string[] {
    const valid = ['payment_settled', 'payment_failed', 'pool_low']
    if (!Array.isArray(events) || events.length === 0) {
        throw new Error('events must be a non-empty array')
    }
    for (const event of events) {
        if (!valid.includes(event as string)) {
            throw new Error(`Invalid webhook event: ${event}`)
        }
    }
    return events as string[]
}