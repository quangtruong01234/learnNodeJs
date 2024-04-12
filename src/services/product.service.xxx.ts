

// define Factory class to create product

import { BadRequestError } from "@/core/error.response";
import { clothing, electronic, furniture, product } from "@/models/product.model";
import { findAllDraftsForShop, findAllProducts, findAllPublishForShop, findProduct, publishProductByShop, searchProductByUser, unPublishProductByShop, updateProductById } from "@/models/repositories/product.repo";
import { removeUndefinedObject, updateNestedObjectParser } from "@/utils";
import { IShop } from "@/validations/auth";
import { AttributeType, IProduct, ProductType } from "@/validations/product";
import { PopulatedDoc, Types } from "mongoose";

type typeClass =  typeof Electronics | typeof Clothing | typeof Furniture

class ProductFactory {
    /**
     * type:'Clothing'
     * payload
     */
    static productRegistry: { [type: string]: typeClass } = {};

    static registerProductType(type: ProductType, classRef: typeClass) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type: string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)
        const productInstance = new productClass(payload)
        return productInstance.createProduct();

    }

    static async updateProduct(type: string,productId:string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)
        const productInstance = new productClass(payload)
        return productInstance.updateProduct(productId);
    }

    //PUT//
    static async publishProductByShop({ product_shop, product_id }:
        { product_shop: string, product_id: string }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unPublishProductByShop({ product_shop, product_id }:
        { product_shop: string, product_id: string }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }
    //END PUT//

    // query //
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }:
        { product_shop: string, limit?: number, skip?: number }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }:
        { product_shop: string, limit?: number, skip?: number }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }: { keySearch: string }) {
        return await searchProductByUser({ keySearch });
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }:
        { limit?: number, sort?: string, page?: number, filter?: { isPublished: boolean } }) {
        return await findAllProducts({
            limit, sort, page, filter,
            select: ['product_name', 'product_price', 'product_thumb']
        });
    }

    static async findProduct({ product_id }: { product_id: string }) {
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] });
    }


}

// define base product class

class Product {
    product_name: string;
    product_thumb?: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: ProductType;
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

    // update Product
    async updateProduct(productId: string, bodyUpdate?: this) {
        return await updateProductById<this,typeof product>({ productId, bodyUpdate:bodyUpdate!, model: product })
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
    async updateProduct(productId:string){
        /**
         * a:undefined,
         * b:null
         */
        // 1. remove attr has null undefined
        // console.log('[1]::', this)
        const objectParams = removeUndefinedObject(this) 
        // console.log('[2]::', objectParams)
        // 2. Check xem update o cho nao?
        if(objectParams.product_attributes){
            //update child
            await updateProductById<this,typeof clothing>({ productId,bodyUpdate:updateNestedObjectParser(objectParams.product_attributes) , model: clothing })
        }

        const updateProduct = await super.updateProduct(productId,updateNestedObjectParser(objectParams))
        return updateProduct;
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
    // async updateProduct(productId:string){
    //     /**
    //      * a:undefined,
    //      * b:null
    //      */
    //     // 1. remove attr has null undefined
    //     const objectParams = this 
    //     // 2. Check xem update o cho nao?
    //     if(objectParams.product_attributes){
    //         //update child
    //         await updateProductById<this,typeof electronic>({ productId,bodyUpdate:objectParams, model: electronic })
    //     }

    //     const updateProduct = await super.updateProduct(productId,objectParams)
    //     return updateProduct;
    // }
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
    // async updateProduct(productId:string){
    //     /**
    //      * a:undefined,
    //      * b:null
    //      */
    //     // 1. remove attr has null undefined
    //     const objectParams = this 
    //     // 2. Check xem update o cho nao?
    //     if(objectParams.product_attributes){
    //         //update child
    //         await updateProductById<this,typeof furniture>({ productId,bodyUpdate:objectParams, model: furniture })
    //     }

    //     const updateProduct = await super.updateProduct(productId,objectParams)
    //     return updateProduct;
    // }
}

// register product types
ProductFactory.registerProductType('Electronics' as ProductType, Electronics)
ProductFactory.registerProductType('Clothing' as ProductType, Clothing)
ProductFactory.registerProductType('Furniture' as ProductType, Furniture)

export default ProductFactory;