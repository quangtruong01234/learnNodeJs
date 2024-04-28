import * as JWT from 'jsonwebtoken'; // Make sure to install @types/jsonwebtoken for types
import { AuthFailureError, NotFoundError } from "@/core/error.response";
import KeyTokenService from "@/services/keyToken.service";
import asyncHandler from '@/helpers/asyncHandler';

// Define a type for the payload
interface Payload {
    userId: string,
    email: string,
    [key: string]: any;
}
const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: 'x-rtoken-id'
};
const createTokenPair = async (
    payload: Payload,
    publicKey: string,
    privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        // accessToken
        const accessToken = JWT.sign(payload, publicKey, {
            // algorithm:'RS256',
            expiresIn: '2 days',
        });

        const refreshToken = JWT.sign(payload, privateKey, {
            // algorithm:'RS256',
            expiresIn: '7 days',
        });

        // Consider using promisify or another method to handle asynchronous verification if needed
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Error verify`, err);
            } else {
                console.log(`Decode verify`, decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        // Consider handling or throwing the error appropriately
        throw error;
    }
};
const authentication = asyncHandler(async (req, res, next) => {
    /**
 * 1 - check userId missing???
 * 2 - get access token
 * 3 - verifyToken
 * 4 - check user in bds?
 * 5 - check keyStore with this userId?
 * 6 - OK all => return next()
 */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //2
    const keyStore = await KeyTokenService.findByUserId(String(userId))
    if (!keyStore) throw new NotFoundError('Not found key store')

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(String(accessToken), keyStore.publicKey) as JWT.JwtPayload
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**
 * 1 - check userId missing???
 * 2 - get access token
 * 3 - verifyToken
 * 4 - check user in bds?
 * 5 - check keyStore with this userId?
 * 6 - OK all => return next()
 */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //2
    const keyStore = await KeyTokenService.findByUserId(String(userId))
    if (!keyStore) throw new NotFoundError('Not found key store')

    //3
    if (req.headers[HEADER.REFRESHTOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]!
            const decodeUser = JWT.verify(String(refreshToken), keyStore.privateKey) as {userId:string, email:string} 
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')
    try {
        const decodeUser= JWT.verify(String(accessToken), keyStore.publicKey) as {userId:string, email:string} 
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        req.user = decodeUser // {userId, email}
        return next()
    } catch (error) {
        throw error
    }

})

const verifyJWT = async (token: string, keySecret: string) => {
    return await JWT.verify(token, keySecret)
}
export {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT
}