import {ProcessCustom } from "@/types/process";
import {SuccessResponse } from "../core/success.response";
import ProductService from "../services/product.service";
import ProductServiceV2 from "../services/product.service.xxx";
import { NextFunction, Response } from "express";


class ProductController {
    createProduct:ProcessCustom = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product successfully',
        //     metadata: await ProductService.createProduct(req.body.product_type,{
        //         ...req.body,
        //         product_shop:req.user.userId
        //     })
        // }).send(res)
        new SuccessResponse({
            message: 'Create new Product successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)
    }
}

export default new ProductController();
