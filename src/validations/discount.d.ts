import { Document, PopulatedDoc, Types } from "mongoose";
import { IShop } from "./auth";

interface IDiscount extends Document {
    discount_name: string;
    discount_description: string;
    discount_type: string;
    discount_value: number;
    discount_code: string;
    discount_start_date: Date;
    discount_end_date: Date;
    discount_max_uses: number;
    discount_uses_count: number;
    discount_users_used: {userId:string,uses:number}[];
    discount_max_uses_per_user: number;
    discount_min_order_value: number;
    discount_shopId: PopulatedDoc<IShop & Document>;
    discount_is_active: boolean;
    discount_applies_to: 'all' | 'specific';
    discount_product_ids: Types.Array<string>; 
}