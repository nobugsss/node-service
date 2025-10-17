/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:33:36
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:33:44
 * @description:
 * @param:
 * @return:
 */
import { Router } from "express";
import { getFileList, downloadFile } from "../controllers/fileController";

const router: Router = Router();

// 获取文件列表
router.get("/files", getFileList);

// 下载文件
router.get("/files/:filename", downloadFile);

export default router;
