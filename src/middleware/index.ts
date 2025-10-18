/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:32:26
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:32:45
 * @description:
 * @param:
 * @return:
 */
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

// 错误处理中间件
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error('Error:', err);

	const response: ApiResponse = {
		success: false,
		message: '服务器内部错误',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined,
	};

	res.status(500).json(response);
};

// 404处理中间件
export const notFoundHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const response: ApiResponse = {
		success: false,
		message: `路由 ${req.originalUrl} 不存在`,
	};

	res.status(404).json(response);
};

// 导入请求日志中间件
export {
	requestLogger,
	slowRequestLogger,
	errorRequestLogger,
} from './requestLogger';
