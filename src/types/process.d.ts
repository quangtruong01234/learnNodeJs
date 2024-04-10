import { IKeyToken, KeyStore } from '@/validations/keyToken';
import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken';
interface ErrorWithStatus extends Error {
    status?: number;
}
interface CustomRequest extends Request {
    keyStore:IKeyToken;
    user:JWT.JwtPayload;
    refreshToken:string | string[]

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