'use strict'
import { ICart } from '@/validations/cart';
import {model, Schema} from 'mongoose'
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    cart_state:{
        type: String, required: true,
        enum:['active','completed','failed','pending'],
        default:'active',
    },
    cart_products:{type:Array, required:true,default:[]},
    cart_count_product:{type:Number,default:0},
    cart_userId:{type:Number, required:true,},
},{
    collection:COLLECTION_NAME,
    timestamps:{
        createdAt:'createdOn',
        updatedAt:'modifiedOn',

    }
});

//Export the model
const cart = model<ICart>(DOCUMENT_NAME, cartSchema);
export default cart;