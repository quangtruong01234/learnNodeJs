/**
 * key features: Cart Service
 * - add product to cart [user]
 * - reduce product quantity by one [user]
 * - increase product quantity by one [user]
 * - get cart [user]
 * - delete cart [user]
 * - delete cart item [user]
 */

import { NotFoundError } from "@/core/error.response";
import cart from "@/models/cart.model";
import { getProductById } from "@/models/repositories/product.repo";
import { CartProduct, UpdateCart } from "@/validations/cart";

class CartService {
    // START REPO CART////
    static async createUserCart({ userId, product }: { userId: number, product: CartProduct }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }
    static async updateUserCartQuantity({ userId, product }: { userId: number, product: CartProduct }) {
        const { productId, quantity } = product

        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity,
            }
        }, options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateSet, options);
    }
    /// END REPO CART ///
    static async addToCart({ userId, product = {} }: { userId: number, product?: CartProduct }) {
        // check cart ton tai hay khong?
        const userCart = await cart.findOne({ cart_userId: userId })
        if (!userCart) {
            // create cart for User
            return await CartService.createUserCart({ userId, product })
        }

        // neu co gio hang roi nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }

        // gio hang ton tai, va co san pham  nay thi update quantity
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    //update cart
    /**
    shop_order_ids:[
        {
            shopId,
            item_products:[
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId,
                }
            ],
            version
        }
    ]
     */
    static async addToCartV2({ userId, shop_order_ids }: { userId: number, shop_order_ids: UpdateCart[] }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        //check product
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('')
        // compare
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }
        if (quantity === 0) {
            //deleted
        }
        return await CartService.updateUserCartQuantity({
            userId,
            product:{
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteUserCart({userId,productId}: { userId: number,productId:string}){
        const query = {cart_userId:userId, cart_state:'active'},
        updateSet={
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        const deleteCart = await cart.updateOne(query,updateSet)
        return deleteCart
    }
    static async getListUserCart({userId}:{userId?:number}){
        return await cart.findOne({
            cart_userId:+userId!
        }).lean()
    }
}

export default CartService