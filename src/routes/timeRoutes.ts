import { Router } from "express";
import { getServerTime, healthCheck } from "../controllers/timeController";

const router: Router = Router();

// 获取服务器时间
router.get("/time", getServerTime);

// 健康检查
router.get("/health", healthCheck);

export default router;
