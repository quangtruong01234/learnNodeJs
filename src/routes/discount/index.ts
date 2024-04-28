import express from 'express';
import asyncHandler from "../../helpers/asyncHandler";
import { authenticationV2 } from '../../auth/authUtils';
import discountController from '@/controllers/discount.controller';
const router = express.Router();

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))
// authentication//
router.use(authenticationV2)
router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))
export default router;