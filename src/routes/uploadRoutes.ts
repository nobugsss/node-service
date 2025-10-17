/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:33:48
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:33:55
 * @description:
 * @param:
 * @return:
 */
import { Router } from "express";
import { upload, uploadSingleFile, uploadMultipleFiles } from "../controllers/uploadController";

const router: Router = Router();

// 单文件上传
router.post("/upload/single", upload.single("file"), uploadSingleFile);

// 多文件上传
router.post("/upload/multiple", upload.array("files", 10), uploadMultipleFiles);

export default router;
