import { Request, Response } from "express";
import { ApiResponse } from "../types";

// 获取服务器时间
export const getServerTime = (req: Request, res: Response) => {
	const response: ApiResponse = {
		success: true,
		message: "获取服务器时间成功",
		data: {
			timestamp: Date.now(),
			datetime: new Date().toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
		}
	};

	res.json(response);
};

// 健康检查
export const healthCheck = (req: Request, res: Response) => {
	const response: ApiResponse = {
		success: true,
		message: "服务运行正常",
		data: {
			status: "healthy",
			uptime: process.uptime(),
			memory: process.memoryUsage(),
			version: process.version
		}
	};

	res.json(response);
};
