import { BadRequestError } from "@/core/error.response"
import { findCartById } from "@/models/repositories/cart.repo"
import { checkProductByServer } from "@/models/repositories/product.repo"
import DiscountService from "./discount.service"
import { CheckProduct, ShopOrderItem } from "@/types/checkout"
class CheckoutService {
    /* 
    {
        cartId,
        userId,
        shop_order_ids:[
            {
                shopId,
                shop_discount:[],
                item_products:[
                    {
                    price,
                    quantity,
                    productId
                }
                ]
            }
        ]
    }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids }
        : { cartId: string, userId: string, shop_order_ids: ShopOrderItem[] }) {
        // check cartId ton tai khong?
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart does not exists!')
        const checkout_order = {
            totalPrice:0, // Tong tien hang
            feeShip:0, // phi van chuyen
            totalDiscount:0, // tong tien discount giam gia
            totalCheckout:0, // tong thanh toan
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for(let i=0; i< shop_order_ids.length;i++){
            const {shopId, shop_discounts = [],item_products=[]}= shop_order_ids[i]
            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer::`, checkProductServer)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong!!!')
            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product!.quantity * product!.price)
            },0)

            // tong tien truoc khi xu li
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // new shop_discounts ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length>0){
                // gia su chi co mot discount
                // get amout discount
                const {totalPrice=0, discount=0} = await DiscountService.getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductServer as CheckProduct[]

                })
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount
                // neu tien giam gia lon hon 0
                if(discount>0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
}
export default CheckoutService