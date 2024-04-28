"use strict";
import { IShop } from "@/validations/auth";
//!dmbg
import { model, Schema } from "mongoose"; // Erase if already required
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";
// Declare the Schema of the Mongo model
var shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
 const Shop = model<IShop>(DOCUMENT_NAME, shopSchema);
 export default Shop;
