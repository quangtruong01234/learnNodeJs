"use strict";

import express from "express";
import { apiKey, permission } from "../auth/checkAuth";
import accessRoutes from "./access";
import productRoutes from "./product";
import discountRoutes from "./discount";
import cartRoutes from "./cart";
const router = express.Router();

//check apiKey
router.use(apiKey)
//check permission
router.use(permission('0000'))

router.use('/v1/api/product',productRoutes)
router.use('/v1/api/cart',cartRoutes)
router.use('/v1/api/discount',discountRoutes)
router.use('/v1/api',accessRoutes)

// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome FanTipjs",
//   });
// });

export default router;
