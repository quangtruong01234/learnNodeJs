import { CustomRequest } from "@/types/process";
import { NextFunction, Request, Response } from "express";
type AsyncFunction = (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
const asyncHandler = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as CustomRequest, res, next).catch(next)
  }
}

export default asyncHandler