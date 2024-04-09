import express from 'express';
import asyncHandler from "../../helpers/asyncHandler";
import { authenticationV2 } from '../../auth/authUtils';
import productController from '@/controllers/product.controller';
const router = express.Router();
// authentication//
router.use(authenticationV2)
//
router.post('',asyncHandler(productController.createProduct))

export default router;
