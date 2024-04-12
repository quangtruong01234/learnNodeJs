import express from 'express';
import asyncHandler from "../../helpers/asyncHandler";
import { authenticationV2 } from '../../auth/authUtils';
import productController from '@/controllers/product.controller';
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
// authentication//
router.use(authenticationV2)
//
router.post('',asyncHandler(productController.createProduct))
router.post('/publish/:id',asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id',asyncHandler(productController.unPublishProductByShop))

// QUERY //
router.get('/drafts/all',asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishForShop))
export default router;
