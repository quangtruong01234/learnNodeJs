'use strict'

import { IApiKey } from '@/validations/apikey';
import { IInventory } from '@/validations/inven';
import {model, Schema, Types} from 'mongoose'
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    inven_productId:{type:Schema.Types.ObjectId, ref:'Product'},
    inven_location:{type:String, default:'unknown'},
    inven_stock:{type:Number, required:true},
    inven_shopId:{type:Schema.Types.ObjectId, ref:'Shop'},
    inven_reservations:{type:Array, default:[]},

    /**
     * cardId,
     * stock:1,
     * createOn:
     */
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//Export the model
const inventory = model<IInventory>(DOCUMENT_NAME, inventorySchema);
export default inventory;