import { Process } from "@/types/process";
import {SuccessResponse } from "../core/success.response";
import ProductService from "../services/product.service";
import { NextFunction, Response } from "express";


class ProductController {
    createProduct:Process = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product successfully',
            metadata: await ProductService.createProduct(req.body.product_type,req.body)
        }).send(res)
    }
}

export default new ProductController();
