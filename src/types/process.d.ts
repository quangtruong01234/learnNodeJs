import { IApiKey } from '@/validations/apikey';
import { IKeyToken, KeyStore } from '@/validations/keyToken';
import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
interface ErrorWithStatus extends Error {
    status?: number;
}
interface CustomRequest extends Request {
    keyStore: IKeyToken;
    user: {userId:string, email:string} ;
    refreshToken: string | string[]

}
interface ApiRequest extends Request {
    objKey: IApiKey,
}
interface Process {
    (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void>;
}

interface ProcessCustom {
    (
        req: CustomRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void>;
}