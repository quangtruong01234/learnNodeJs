import { getSelectData, unGetSelectData } from "@/utils";
import { IDiscount } from "@/validations/discount";
import { PopulatedDoc, SortOrder, UpdateQuery } from "mongoose";

const findAllDiscountCodesUnSelect = async <M extends UpdateQuery<IDiscount>>({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}:
    { limit?: number, sort?: string, page?: number, filter: PopulatedDoc<IDiscount & Document>, unSelect: string[], model: M }) => {
    const skip = (page - 1) * limit;
    const sortBy: Record<string, SortOrder> = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()
    return products
}

const findAllDiscountCodesSelect = async <M extends UpdateQuery<IDiscount>>({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}:
    { limit?: number, sort?: string, page?: number, filter: PopulatedDoc<IDiscount & Document>, select: string[], model: M }) => {
    const skip = (page - 1) * limit;
    const sortBy: Record<string, SortOrder> = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return products
}

const checkDiscountExists = async <M extends UpdateQuery<IDiscount>>(
    { model, filter }: { model: M, filter: PopulatedDoc<IDiscount & Document> }) => {
    return await model.findOne(filter).lean()
}

export {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountExists,
}