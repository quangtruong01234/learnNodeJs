import { Document, PopulatedDoc } from "mongoose";
import { IShop } from "./auth";

enum ProductType {
    Electronics = 'Electronics',
    Clothing = 'Clothing',
    Furniture = 'Furniture'
}
interface IProduct extends Document {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_slug?: string;
    product_price: number;
    product_quantity: number;
    product_type: ProductType;
    product_shop?: PopulatedDoc<IShop & Document>;
    product_attributes: AttributeType;
    product_ratingAverage:number,
    product_variations:string[],
    isDraft:boolean,
    isPublished:boolean,
}
interface IClose extends Document {
    brand:string,
    size?:string,
    material?:string,
    product_shop?: PopulatedDoc<IShop & Document>;
}
interface IElectronic extends Document {
    manufacturer:string,
    model?:string,
    color?:string,
    product_shop?: PopulatedDoc<IShop & Document>;
}
type AttributeType=IClose | IElectronic;
