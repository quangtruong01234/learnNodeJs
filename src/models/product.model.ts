import { IClose, IElectronic, IProduct} from '@/validations/product';
import {model, Schema} from 'mongoose'
import slugify from 'slugify';
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name:{ type:String, required:true},
    product_thumb:{ type:String, default:true},
    product_description:{ type:String},
    product_slug:{ type:String}, // quan-jean-cao-cap
    product_price:{ type:Number, required:true},
    product_quantity:{ type:Number, required:true},
    product_type:{ type:String, required:true, enum:['Electronics', 'Clothing','Furniture']},
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'},
    product_attributes:{ type:Schema.Types.Mixed, required:true},
    product_ratingAverage:{
        type: Number,
        default: 4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be above 5.0'],
        // 4.234234 => 4.2
        set: (val:number)=> Math.round(val*10)/10
    },
    product_variations:{type:Array, default:[]},
    isDraft:{ type: Boolean, default:true, index:true, select:false},
    isPublished:{ type: Boolean, default:false, index:true, select:false},

},{
    collection:COLLECTION_NAME,
    timestamps:true
});

//create index for search
productSchema.index({product_name:'text',product_description:'text'})
// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next){
    this.product_slug = slugify(this.product_name,{lower:true}) 
    next();
})

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

const furnitureSchema = new Schema({
    brand:{type:String, required:true},
    size:String,
    material:String,
    product_shop:{type: Schema.Types.ObjectId, ref:'Shop'},
},{
    collection:'furnitures',
    timestamps:true
})

const ProductModel = model<IProduct>(DOCUMENT_NAME, productSchema);
const ClothingModel = model<IClose>('Clothing', clothingSchema);
const ElectronicModel = model<IElectronic>('Electronics', electronicSchema);
const FurnitureModel = model<IClose>('Furnitures', furnitureSchema);
export {
    ProductModel as product,
    ClothingModel as clothing,
    ElectronicModel as electronic,
    FurnitureModel as furniture,
} 