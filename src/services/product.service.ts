

// define Factory class to create product

import { BadRequestError } from "@/core/error.response";
import { clothing, electronic, product } from "@/models/product.model";
import { IShop } from "@/validations/auth";
import { AttributeType, IProduct } from "@/validations/product";
import { PopulatedDoc, Types } from "mongoose";

class ProductFactory {
    /**
     * type:'Clothing'
     * payload
     */
    static async createProduct(type: string, payload: IProduct) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`Invalid Product Type ${type}`)
        }
    }
}

// define base product class

class Product {
    product_name: string;
    product_thumb?: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: 'Electronics' | 'Clothing' | 'Furniture';
    product_shop: PopulatedDoc<IShop & Document>;
    product_attributes: AttributeType;
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }: IProduct) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_shop = product_shop;
        this.product_type = product_type;
        this.product_attributes = product_attributes;
    }

    // create new product

    async createProduct(product_id: Types.ObjectId): Promise<IProduct> {
        return await product.create({ ...this, _id: product_id })
    }
}

// Define sub-class for different product types Clothing

class Clothing extends Product {
    async createProduct(): Promise<IProduct> {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct(): Promise<IProduct> {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

export default ProductFactory;