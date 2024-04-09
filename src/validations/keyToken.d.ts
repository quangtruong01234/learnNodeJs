import { Document, ObjectId } from "mongoose";

interface IKeyToken extends Document {
    _id: ObjectId;
    user: ObjectId;
    privateKey: string;
    publicKey: string;
    refreshTokensUsed: string[];
    refreshToken: string;
}