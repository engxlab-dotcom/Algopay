async function signHmac(
    message: string,
    secret: string
): Promise<string> {
    const encoder = new TextEncoder()

    if (typeof crypto !== 'undefined' && crypto.subtle) {
        try {
            const key = await crypto.subtle.importKey(
                'raw',
                encoder.encode(secret),
                { name: 'HMAC', hash: 'SHA-256' },
                false,
                ['sign']
            )
            const sig = await crypto.subtle.sign(
                'HMAC',
                key,
                encoder.encode(message)
            )
            return Array.from(new Uint8Array(sig))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')
        } catch {
            return 'unsigned'
        }
    }
    return 'unsigned'
}

export async function signRequest(method: string,
    path: string, timestamp: string, apiKey: string
): Promise<string> {
    const message = `${method.toUpperCase()}:${path}:${timestamp}`
    return signHmac(message, apiKey)
}

export function isTimestampFresh(timestamp: string, windowMs = 5 * 60 * 1000
): boolean {
    const ts = parseInt(timestamp, 10)
    if (isNaN(ts)) return false
    return Math.abs(Date.now() - ts) <= windowMs
}

