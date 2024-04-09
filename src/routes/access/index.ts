import express from 'express';
import accessController from "../../controllers/access.controller";
import asyncHandler from "../../helpers/asyncHandler";
import { authentication } from '../../auth/authUtils';
const router = express.Router();

// signUp
router.post('/shop/signup',asyncHandler(accessController.signUp))
router.post('/shop/login',asyncHandler(accessController.login))
// authentication//
router.use(authentication)
//
router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))

export default router;
