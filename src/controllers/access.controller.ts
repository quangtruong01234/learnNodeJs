import { CustomRequest, Process } from "@/types/process";

import { CREATED, SuccessResponse } from "../core/success.response";
import AccessService from "../services/access.service";
import { NextFunction, Response } from "express";


class AccessController {
  logout = async (req:CustomRequest, res:Response, next:NextFunction):Promise<void> => {
    new SuccessResponse({
      message:'Logout Success',
      metadata: await AccessService.logout(req.keyStore!)
    }).send(res)
  }
  login: Process = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
  signUp: Process = async (req, res, next) => {
    new CREATED({
      message: 'Resisted OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  };
}

export default new AccessController();
