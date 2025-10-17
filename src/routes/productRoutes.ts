/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:34:11
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:34:18
 * @description:
 * @param:
 * @return:
 */
import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/productController";

const router: Router = Router();

// 产品路由
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
