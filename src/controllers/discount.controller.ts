import { SuccessResponse } from "@/core/success.response";
import DiscountService from "@/services/discount.service";
import { ProcessCustom } from "@/types/process";

class DiscountController{
    createDiscountCode:ProcessCustom = async(req,res,next)=>{
        new SuccessResponse({
            message:'Success Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId:req.user.userId,

            })
        }).send(res)
    }
    getAllDiscountCodes:ProcessCustom = async(req,res,next)=>{
        new SuccessResponse({
            message:'Success Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId:req.user.userId,
            })
        }).send(res)
    }
    getDiscountAmount:ProcessCustom = async(req,res,next)=>{
        new SuccessResponse({
            message:'Success Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
    getAllDiscountCodeWithProduct:ProcessCustom = async(req,res,next)=>{
        new SuccessResponse({
            message:'Success Code Found',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }
    
}

export default new DiscountController()