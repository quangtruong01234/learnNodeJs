"use strict";
import { ObjectId, Types } from "mongoose";
import keyTokenModel from "../models/keyToken.model";
import { IKeyToken } from "@/validations/keyToken";
interface createToken {
  userId?: string,
  publicKey?: string,
  privateKey?: string,
  refreshToken?: string,
}
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: createToken) => {
    try {
      //level 0
      // const tokens = await keyTokenModel.create({
      //     user: userId,
      //     publicKey,
      //     privateKey
      // })
      // return tokens ? tokens.publicKey : null;

      //level xx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId: string) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  }
  static async removeKeyById(id:string): Promise<void> {
    await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  }
  static findByRefreshTokenUsed = async (refreshToken:string) =>{
    return await keyTokenModel.findOne({ refreshTokensUsed:refreshToken}).lean();
  }

  static findByRefreshToken = async (refreshToken:string) =>{
    return await keyTokenModel.findOne({ refreshToken})
  }

  static deleteKeyById = async (userId:string) => {
    return await keyTokenModel.deleteOne({user:userId})
  }
}

export default KeyTokenService;
