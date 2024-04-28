import { SuccessResponse } from "@/core/success.response";
import CheckoutService from "@/services/checkout.service";
import { ProcessCustom } from "@/types/process";

class CheckoutController{
    checkoutReview:ProcessCustom = async(req,res,next)=>{
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

export default new CheckoutController()