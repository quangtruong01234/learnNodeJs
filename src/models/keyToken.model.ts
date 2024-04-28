'use strict'

import { IKeyToken } from '@/validations/keyToken';
import {Schema,model} from 'mongoose' // Erase if already required
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Shop'
    },
    privateKey:{
        type:String,
        required:true,
    },
    publicKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,// nhung RT da duoc su dung
        default:[]
    },
    refreshToken:{
        type:String,
        required:true,
    }
},{
    collection:COLLECTION_NAME,
    timestamps:true
});
//Export the model
const keyToken = model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);

export default keyToken;