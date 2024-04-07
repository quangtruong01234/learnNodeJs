import { Document } from "mongoose";

interface IKeyToken extends Document {
    user: mongoose.Types.ObjectId;
    privateKey: string;
    publicKey: string;
    refreshTokensUsed: string[];
    refreshToken: string;
}