import { Request, Response, NextFunction } from 'express';
interface ErrorWithStatus extends Error {
    status?: number;
}
interface Process {
    (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void>;
}