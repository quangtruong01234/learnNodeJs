"use strict";
import shopModel from "../models/shop.model"
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service"
import { createTokenPair } from "../auth/authUtils"
import { getInfoData } from "../utils";
import { BadRequestError, AuthFailureError } from "../core/error.response"
import { findByEmail } from "./shop.service"
import { IShop } from "@/validations/auth";
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
interface LoginParams {
  email: string;
  password: string;
  refreshToken?: string | null;
}
interface RegisterParams {
  email: string;
  password: string;
  name?: string;
}
class AccessService {
  /**
   * 1- check email in dbs
   * 2- match password
   * 3- create AT vs RT and save
   * 4- generate tokens
   * 5- get data return login
   */
  static login = async ({ email, password, refreshToken = null }:LoginParams) => {
    //1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered");
    //2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");
    //3
    // created privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //4
    const {_id:userId} = foundShop
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
        refreshToken:tokens.refreshToken,
        privateKey, publicKey,userId
    })
    return {
        shop: getInfoData({
          fields: ["_id" , "name", "email"],
          object: foundShop,
        }),
        tokens,
    };
  };

  static signUp = async (
    { name, email, password }:RegisterParams
    ) => {
    // try {
    // step1: check email exists??
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error:Shop already registered!");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // created privateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); // save collection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        // throw new BadRequestError('Error:Shop already registered!')
        return {
          code: "xxxx",
          message: "keyStore error",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success`, tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //     console.error(error)
    //     return{
    //         code:'XXX',
    //         message:error.message,
    //         static:'error'
    //     }
    // }
  };
}
export default AccessService;
