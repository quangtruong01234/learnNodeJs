"use strict";
import keyTokenModel from "../models/keyToken.model";
interface createToken{
  userId?:string, 
  publicKey?:string, 
  privateKey?:string,
  refreshToken?:string,
}
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey,refreshToken }:createToken) => {
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
      return tokens? tokens.publicKey:null
    } catch (error) {
      return error;
    }
  };
}

export default KeyTokenService;
