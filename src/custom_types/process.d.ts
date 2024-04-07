import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      objKey?: APIKey | null; // Optional property with the defined APIKey type
    }
  }
}