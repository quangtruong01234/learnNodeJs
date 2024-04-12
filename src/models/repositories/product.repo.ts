import { PopulatedDoc, SortOrder, Types } from "mongoose"
import { product } from "../product.model"
import { IShop } from "@/validations/auth"
import { getSelectData, unGetSelectData } from "@/utils"

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
    {limit:number, sort:string, page:number,filter:{isPublished:boolean},select:string[]})=>{
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


const queryProduct = async ({ query, limit, skip }: findAll | findAllPublish) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findProduct = async({ product_id, unSelect }: { product_id: string,unSelect:string[] })=>{
    return await product.findById(product_id).select(unGetSelectData(unSelect))
}

export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct
}