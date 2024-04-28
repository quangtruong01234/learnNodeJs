"use strict";
import shopModel from "../models/shop.model"
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service"
import { createTokenPair, verifyJWT } from "../auth/authUtils"
import { getInfoData } from "../utils";
import { BadRequestError, AuthFailureError, ForbiddenError } from "../core/error.response"
import { findByEmail } from "./shop.service"
import { IKeyToken } from "@/validations/keyToken";
import * as JWT from 'jsonwebtoken';
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
   * check this token used?
   * 
   */

  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }: {
    refreshToken: string | string[]
    user: JWT.JwtPayload;
    keyStore: IKeyToken;
  }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(String(refreshToken))) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happened !! Pls relogin')
    }

    if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')

    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered 2')
    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
      }
    })
    return {
      user: { userId, email },
      tokens
    }
  }

  static handlerRefreshToken = async (refreshToken: string) => {

    // check xem token nay da duoc su dung chua?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // decode xem may la thang nao?
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey) as JWT.JwtPayload;
      console.log({ userId, email })
      // xoa tat ca token trong keyStore
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls relogin')
    }

    // No, qua ngon
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError('Shop not registered 1')

    // verifyToken
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey) as JWT.JwtPayload;
    console.log('[2]--', { userId, email });

    // check UserId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError('Shop not registered 2')

    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
      }
    })
    return {
      user: { userId, email },
      tokens
    }

  }

  static logout = async (keyStore: IKeyToken) => {
    const delKey = await KeyTokenService.removeKeyById(String(keyStore._id))
    console.log({ delKey })
    return delKey
  }

  /**
   * 1- check email in dbs
   * 2- match password
   * 3- create AT vs RT and save
   * 4- generate tokens
   * 5- get data return login
   */
  static login = async ({ email, password, refreshToken = null }: LoginParams) => {
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
    const { _id: userId } = foundShop
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey, userId
    })
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async (
    { name, email, password }: RegisterParams
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
  };
}
export default AccessService;
