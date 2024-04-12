

// define Factory class to create product

import { BadRequestError } from "@/core/error.response";
import { clothing, electronic, furniture, product } from "@/models/product.model";
import { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, searchProductByUser, unPublishProductByShop } from "@/models/repositories/product.repo";
import { IShop } from "@/validations/auth";
import { AttributeType, IProduct } from "@/validations/product";
import { PopulatedDoc, Types } from "mongoose";

type typeClass = typeof Electronics | typeof Clothing | typeof Furniture

class ProductFactory {
    /**
     * type:'Clothing'
     * payload
     */
    static productRegistry: { [type: string]: typeClass} = {};

    static registerProductType(type: IProduct['product_type'], classRef: typeClass) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type: string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)
        const productInstance = new productClass(payload)
        return productInstance.createProduct();

    }

    //PUT//
    static async publishProductByShop({product_shop,product_id}:
        {product_shop:string,product_id:string}){
        return await publishProductByShop({product_shop,product_id})
    }
    static async unPublishProductByShop({product_shop,product_id}:
        {product_shop:string,product_id:string}){
        return await unPublishProductByShop({product_shop,product_id})
    }
    //END PUT//

    // query //
    static async findAllDraftsForShop({product_shop, limit = 50, skip =0}:
        {product_shop:string, limit?:number, skip?:number}){
        const query = {product_shop, isDraft:true}
        return await findAllDraftsForShop({query, limit, skip})
    }

    static async findAllPublishForShop({product_shop, limit = 50, skip =0}:
        {product_shop:string, limit?:number, skip?:number}){
        const query = {product_shop, isPublished:true}
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProducts({keySearch}:{keySearch:string}){
        return await searchProductByUser({keySearch});
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

class Furniture extends Product {
    async createProduct(): Promise<IProduct> {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new Electronics error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create new Product error')

        return newProduct;
    }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

export default ProductFactory;