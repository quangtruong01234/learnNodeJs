import express from 'express';
import accessController from "../../controllers/access.controller";
import asyncHandler from "../../helpers/asyncHandler";
const router = express.Router();

// signUp
router.post('/shop/signup',asyncHandler(accessController.signUp))
router.post('/shop/login',asyncHandler(accessController.login))
// authentication//

//
export default router;
