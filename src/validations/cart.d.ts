import { Document } from "mongoose";

interface ICart extends Document {
  cart_state: 'active' | 'completed' | 'failed' | 'pending';
  cart_products: any[];
  cart_count_product: number;
  cart_userId: number;
}

interface CartProduct {
  productId?: string;
  quantity?: number;
}

interface UpdateCart {
  shopId: string,
  item_products: UpdateItemCart[],
  version: number
}

interface UpdateItemCart {
  quantity: number,
  price: number,
  shopId: string,
  old_quantity: number,
  productId: string,
}