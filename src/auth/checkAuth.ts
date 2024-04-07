import { findById } from "../services/apiKey.service"
import { NextFunction, Response } from "express";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req:any, res:Response, next:NextFunction) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next()
  } catch (error) {

  }
}

const permission = (permission: string)=>{
  return (req:any, res:Response, next:NextFunction) => {
    if(!req.objKey.permissions){
      return res.status(403).json({
        message: "permission denied",
      });
    }

    console.log('permissions::', req.objKey.permissions)
    const validPermission = req.objKey.permissions.includes(permission);
    if(!validPermission){
      return res.status(403).json({
        message: "permission denied",
      });
    }
    return next()
  }
}

export {
    apiKey,
    permission,
}
