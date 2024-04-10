import { IClose, IElectronic, IProduct} from '@/validations/product';
import {model, Schema} from 'mongoose'
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{
        type:String,
        required:true,
    },
    product_thumb:{
        type:String,
        default:true
    },
    product_description:{
        type:String,
    },
    product_price:{
        type:Number,
        required:true,
    },
    product_quantity:{
        type:Number,
        required:true,
    },
    product_type:{
        type:String,
        required:true,
        enum:['Electronics', 'Clothing','Furniture'],
    },
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'},
    product_attributes:{
        type:Schema.Types.Mixed, 
        required:true
    }
},{
    collection:COLLECTION_NAME,
    timestamps:true
});

// define the product type = clothing
const clothingSchema = new Schema({
    brand:{type:String, required:true},
    size:String,
    material:String,
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'},
},{
    collection:'clothes',
    timestamps:true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer:{type:String, required:true},
    model:String,
    color:String,
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'},
},{
    collection:'electronics',
    timestamps:true
})

const ProductModel = model<IProduct>(DOCUMENT_NAME, productSchema);
const ClothingModel = model<IClose>('Clothing', clothingSchema);
const ElectronicModel = model<IElectronic>('Electronics', electronicSchema);
export {
    ProductModel as product,
    ClothingModel as clothing,
    ElectronicModel as electronic,
} 