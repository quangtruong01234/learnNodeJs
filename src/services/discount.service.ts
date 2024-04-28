/**
    Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [user]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [user]
 */

import { BadRequestError, NotFoundError } from "@/core/error.response"
import discount from "@/models/discount.model"
import { convertToObjectIdMongodb } from "@/utils"
import { findAllProducts } from '@/models/repositories/product.repo';
import { checkDiscountExists, findAllDiscountCodesUnSelect } from '@/models/repositories/discount.repo';
import { IDiscount } from '@/validations/discount';
import { CreateDiscount } from "@/types/createItem";
import { CheckProduct } from "@/types/checkout";
class DiscountService {
    static async createDiscountCode(payload: CreateDiscount) {
        const { code, start_date, end_date, is_active,
            shopId, min_order_value, product_ids, applies_to, name,
            description, type, value, max_uses, uses_count, max_uses_per_user,
            max_value, users_used
        } = payload
        //kiem tra
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }
        //create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }
        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,

            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,

            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids

        })
        return newDiscount;
    }
    static async updateDiscountCode() {

    }

    static async getAllDiscountCodeWithProduct({
        code = 'hello', shopId = 'hello', limit = 1, page = 1
    }: { code?: string, shopId?: string, limit?: number, page?: number }) {
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('discount not exists!')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount;
        let products;
        if (discount_applies_to === 'all') {
            // get all product
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            // get the products ids
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products;
    }
    static async getAllDiscountCodesByShop({
        limit = 1, page = 1, shopId
    }: { limit?: number, page?: number, shopId: string }) {
        console.log(shopId)
        const discounts = await findAllDiscountCodesUnSelect<typeof discount>({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        })
        return discounts
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }: {
        codeId: string, userId: string, shopId: string, products: CheckProduct[]
    }) {
        const foundDiscount: IDiscount = await checkDiscountExists<typeof discount>({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        })
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exist`)
        const {
            discount_users_used,
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_type,
            discount_value,

        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError(`discount expired!`)
        if (!discount_max_uses) throw new NotFoundError(`discount are out!`)

        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired!')
        }
        // check xem co xet gia tri toi thieu hay khong?
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`)
            }
        }
        if (discount_max_uses_per_user > 0) {
            const userDiscount = discount_users_used.find(user => user.userId === userId)
            if (userDiscount) {
                //...
                if(userDiscount.uses>=discount_max_uses_per_user) throw new NotFoundError(`You used discount exceeded maximum turn!`)
            }
        }
        // check xem discount nay la fixed-amount
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        }
    }
    static async deleteDiscountCode({ shopId, codeId }: { shopId: string, codeId: string }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }


    static async cancelDiscountCode({ codeId, shopId, userId }
        : { codeId: string, shopId: string, userId: string }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId)
            }
        })
        if (!foundDiscount) throw new NotFoundError(`discount doesn't exist`)

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

export default DiscountService;