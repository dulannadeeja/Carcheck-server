import jwt from 'jsonwebtoken'

export const signJwt = (object: Object, options?: jwt.SignOptions | undefined) => {
    const privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY as string;
    return jwt.sign(object, privateKey, { algorithm: 'RS256', ...options });
}

export const verifyJwt = (token: string) => {
    try {
        const publicKey = process.env.ACCESS_TOKEN_PUBLIC_KEY as string;
        const decodedToken= jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        return {
            expired: false,
            decoded: decodedToken
        }
    } catch (error:any) {
        return {
            expired: error.message === 'jwt expired',
            decoded: null
        }
    }
};