import { IKeyToken, KeyStore } from '@/validations/keyToken';
import { Request, Response, NextFunction } from 'express';
interface ErrorWithStatus extends Error {
    status?: number;
}
interface CustomRequest extends Request {
    keyStore?:IKeyToken;
}
interface Process {
    (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void>;
}