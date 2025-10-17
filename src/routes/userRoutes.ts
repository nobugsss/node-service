/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:33:58
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:34:05
 * @description:
 * @param:
 * @return:
 */
import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController";

const router: Router = Router();

// 用户路由
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
