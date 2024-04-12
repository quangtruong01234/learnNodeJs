import { ProcessCustom } from "@/types/process";
import { SuccessResponse } from "../core/success.response";
import ProductService from "../services/product.service";
import ProductServiceV2 from "../services/product.service.xxx";
import { NextFunction, Response } from "express";

class ProductController {
    createProduct: ProcessCustom = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Create new Product successfully',
        //     metadata: await ProductService.createProduct(req.body.product_type,{
        //         ...req.body,
        //         product_shop:req.user.userId
        //     })
        // }).send(res)
        new SuccessResponse({
            message: 'Create new Product successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishProductByShop: ProcessCustom = async (req, res, next) => {
        new SuccessResponse({
            message: 'publishProductByShop successfully',
            metadata: await ProductServiceV2.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }
    unPublishProductByShop: ProcessCustom = async (req, res, next) => {
        new SuccessResponse({
            message: 'unPublishProductByShop successfully',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id,
            })
        }).send(res)
    }
    // QUERY//
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @return {JSON}
     */
    getAllDraftsForShop: ProcessCustom = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId})
        }).send(res)
    }

    getAllPublishForShop: ProcessCustom = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getAllPublishForShop success',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId})
        }).send(res)
    }

    getListSearchProduct: ProcessCustom = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list getListSearchProduct success',
            metadata: await ProductServiceV2.searchProducts({keySearch:req.params.keySearch})
        }).send(res)
    }
    // END QUERY//
}

export default new ProductController();
