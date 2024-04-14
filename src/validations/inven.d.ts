import { IProduct } from '@/validations/product';
import { Document, ObjectId,PopulatedDoc } from "mongoose";
import { IShop } from './auth';

interface IInventory extends Document {
    inven_productId: PopulatedDoc<IProduct & Document>;
    inven_location: string;
    inven_stock: number;
    inven_shopId: PopulatedDoc<IShop & Document>;
    inven_reservations: string[];
  }