import { Process } from "@/types/process";

import * as JWT from 'jsonwebtoken'; // Make sure to install @types/jsonwebtoken for types
import asyncHandler from '../helpers/asyncHandler';

// Define a type for the payload
interface Payload {
    // Define the structure of your payload here
    [key: string]: any;
}

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
// const authentication = asyncHandler(async ({ req, res, next }: Process) => {
//     next();
//     /**
//      * 1 - check userId missing???
//      * 2 - get access token
//      * 3 - verifyToken
//      * 4 - check user in bds?
//      * 5 - check keyStore with this userId?
//      * 6 - OK all => return next()
//      */
// })
export {
    createTokenPair,
}