import jwt, { SignOptions, VerifyOptions, JwtPayload as DefaultJwtPayload } from 'jsonwebtoken'
import crypto from 'crypto';
export interface JwtPayload extends DefaultJwtPayload {
    userId: string
    provider: 'github' | 'google'
    email: string
}

export function signJwt(
    user: { id: string; provider: 'github' | 'google'; email: string },
    options: { expiresIn?: string } = {}
): string {
    const secret = process.env.JWT_SECRET!
    if (!secret || secret.length < 10) throw new Error('Invalid JWT secret')

    const payload: Omit<JwtPayload, keyof DefaultJwtPayload> = {
        userId: user.id,
        provider: user.provider,
        email: user.email,
    }

    const signOptions: SignOptions = {
        expiresIn: (options.expiresIn ?? '15m') as SignOptions['expiresIn'],
        algorithm: 'HS256',
        issuer: 'algostack',
        audience: 'algostack-api',
    }

    return jwt.sign(payload, secret, signOptions)
}

export function verifyJwt(token: string): JwtPayload | null {
    const secret = process.env.JWT_SECRET!
    if (!secret || secret.length < 10) throw new Error('Invalid JWT secret')

    try {
        const verifyOptions: VerifyOptions = {
            algorithms: ['HS256'],
            issuer: 'algostack',
            audience: 'algostack-api',
        }

        const payload = jwt.verify(token, secret, verifyOptions)
        if (typeof payload === 'string' || !payload) return null
        return payload as JwtPayload
    } catch {
        return null
    }
}

export function signAccessToken(
    user: { id: string; provider: 'github' | 'google'; email: string }
): string {
    return signJwt(user, { expiresIn: '15m' })
}

export function signRefreshToken(): string {
    return crypto.randomBytes(64).toString('hex')
}