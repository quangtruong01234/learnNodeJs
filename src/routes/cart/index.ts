import express from 'express';
import asyncHandler from "../../helpers/asyncHandler";
import { authenticationV2 } from '../../auth/authUtils';
import cartController from '@/controllers/cart.controller';
const router = express.Router();

router.post('',asyncHandler(cartController.addToCart))
router.delete('',asyncHandler(cartController.delete))
router.post('/update',asyncHandler(cartController.update))
router.get('',asyncHandler(cartController.listToCart))

export default router;