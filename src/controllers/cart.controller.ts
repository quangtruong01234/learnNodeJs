import { SuccessResponse } from "@/core/success.response";
import CartService from "@/services/cart.service";
import { ProcessCustom } from "@/types/process";

class CartController{
    // new
    addToCart:ProcessCustom = async(req,res,next) => {
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    // update + -
    update:ProcessCustom = async(req,res,next) => {
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    // delete
    delete:ProcessCustom = async(req,res,next) => {
        new SuccessResponse({
            message:'delete new Cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    // listToCart
    listToCart:ProcessCustom = async(req,res,next) => {
        new SuccessResponse({
            message:'List Cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

export default new CartController();