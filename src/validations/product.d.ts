import { Document, PopulatedDoc } from "mongoose";
import { IShop } from "./auth";

interface IProduct extends Document {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: 'Electronics' | 'Clothing' | 'Furniture';
    product_shop?: PopulatedDoc<IShop & Document>;
    product_attributes: any;
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

