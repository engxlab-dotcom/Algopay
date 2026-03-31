import dns from 'dns/promises'
import { logger } from './logger'

const BLOCKED_RANGES = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^0\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/,
]

export async function validateWebhookUrl(url: string): Promise<void> {
    let parsed: URL

    try {
        parsed = new URL(url)
    } catch {
        throw new Error('Invalid webhook URL')
    }

    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Webhook URL must use HTTP or HTTPS')
    }

    if (parsed.hostname === 'localhost') {
        throw new Error('Webhook URL cannot point to localhost')
    }

    try {
        const addresses = await dns.resolve4(parsed.hostname)
        for (const ip of addresses) {
            for (const range of BLOCKED_RANGES) {
                if (range.test(ip)) {
                    logger.warn(`Blocked SSRF attempt to ${url} (${ip})`)
                    throw new Error('Webhook URL points to a private or reserved IP address')
                }
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes('private') || err.message.includes('SSRF')) {
                throw err
            }
        }
        throw new Error('Could not resolve webhook URL hostname')
    }
}