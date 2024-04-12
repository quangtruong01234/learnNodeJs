import { PopulatedDoc, Types } from "mongoose"
import { product } from "../product.model"
import { IShop } from "@/validations/auth"

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

const queryProduct = async ({ query, limit, skip }: findAll | findAllPublish) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
}