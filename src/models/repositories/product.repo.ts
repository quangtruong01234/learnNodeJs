import {PopulatedDoc, SortOrder, Types, UpdateQuery } from "mongoose"
import { product } from "../product.model"
import { convertToObjectIdMongodb, getSelectData, unGetSelectData } from "@/utils"
import { IProduct } from "@/validations/product"
import { CheckProduct } from "@/types/checkout"


interface findAll {
    query: { product_shop: string, isDraft: boolean }, limit: number, skip: number
}
interface findAllPublish {
    query: { product_shop: string, isPublished: boolean }, limit: number, skip: number
}

const findAllDraftsForShop = async ({ query, limit, skip }: findAll) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }: findAllPublish) => {
    return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }: { keySearch: string }) => {
    const regexSearch = String(new RegExp(keySearch))
    const results = await product.find({
        isPublished:true,
        $text: { $search: regexSearch }
    },
        { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()
    return results;
}

interface publishProduct {
    product_shop: string, product_id: string
}

const publishProductByShop = async ({ product_shop, product_id }: publishProduct) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }: publishProduct) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = true
    foundShop.isPublished = false

    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findAllProducts= async({limit, sort, page,filter,select}:
    {limit:number, sort:string, page:number,filter:PopulatedDoc<IProduct & Document>,select:string[]})=>{
    const skip = (page -1) *limit;
    const sortBy:Record<string, SortOrder> = sort ==='ctime'? {_id: -1}:{_id: 1}
    const products=  await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    return products
}

const findProduct = async({ product_id, unSelect }: { product_id: string,unSelect:string[] })=>{
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async <T,M extends UpdateQuery<IProduct>>({
    productId,
    bodyUpdate,
    model,
    isNew = true
}: {
    productId: string,
    bodyUpdate: T,
    model: M,
    isNew?: boolean
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    });
}

const queryProduct = async ({ query, limit, skip }: findAll | findAllPublish) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const getProductById = async (productId: string)=>{
    return await product.findOne({_id:convertToObjectIdMongodb(productId)}).lean()
}

const checkProductByServer = async (products: CheckProduct[])=>{
    return await Promise.all(products.map(async product=>{
        const foundProduct = await getProductById(product.productId)
        if(foundProduct){
            return {
                price:foundProduct.product_price,
                quantity:product.quantity,
                productId:product.productId
            }
        }
        return
    }))
}



export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkProductByServer
}