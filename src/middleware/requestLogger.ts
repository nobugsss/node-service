import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 请求日志中间件
export const requestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const startTime = Date.now();
	const timestamp = new Date().toISOString();

	// 获取客户端IP地址
	const clientIP =
		req.ip ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
		'unknown';

	// 记录请求开始
	const requestInfo = {
		method: req.method,
		url: req.originalUrl,
		path: req.path,
		query: req.query,
		ip: clientIP,
		userAgent: req.get('User-Agent') || 'unknown',
		timestamp,
		contentLength: req.get('Content-Length') || '0',
		contentType: req.get('Content-Type') || 'unknown',
		referer: req.get('Referer') || 'unknown',
	};

	// 记录请求开始（简化版）
	console.log(
		`[${timestamp}] 📥 ${req.method} ${req.originalUrl} - IP: ${clientIP}`
	);

	// 监听响应完成事件
	res.on('finish', () => {
		const endTime = Date.now();
		const duration = endTime - startTime;
		const statusCode = res.statusCode;

		// 根据状态码选择日志级别和颜色
		let logLevel = 'info';
		let emoji = '✅';

		if (statusCode >= 500) {
			logLevel = 'error';
			emoji = '❌';
		} else if (statusCode >= 400) {
			logLevel = 'warn';
			emoji = '⚠️';
		} else if (statusCode >= 300) {
			logLevel = 'info';
			emoji = '🔄';
		}

		const responseInfo = {
			...requestInfo,
			statusCode,
			duration: `${duration}ms`,
			responseSize: res.get('Content-Length') || 'unknown',
			responseType: res.get('Content-Type') || 'unknown',
		};

		// 控制台输出（简化版）
		console.log(
			`[${new Date().toISOString()}] ${emoji} ${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms - IP: ${clientIP}`
		);

		// 使用winston记录详细日志
		if (logLevel === 'error') {
			logger.error('HTTP Request', responseInfo);
		} else if (logLevel === 'warn') {
			logger.warn('HTTP Request', responseInfo);
		} else {
			logger.info('HTTP Request', responseInfo);
		}
	});

	next();
};

// 慢请求警告中间件
export const slowRequestLogger = (threshold: number = 1000) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const startTime = Date.now();

		res.on('finish', () => {
			const duration = Date.now() - startTime;
			if (duration > threshold) {
				logger.warn('Slow Request Detected', {
					method: req.method,
					url: req.originalUrl,
					duration: `${duration}ms`,
					threshold: `${threshold}ms`,
					ip: req.ip || 'unknown',
				});
			}
		});

		next();
	};
};

// 错误请求日志中间件
export const errorRequestLogger = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const originalSend = res.send;

	res.send = function (data) {
		// 记录错误响应
		if (res.statusCode >= 400) {
			logger.error('Error Response', {
				method: req.method,
				url: req.originalUrl,
				statusCode: res.statusCode,
				ip: req.ip || 'unknown',
				userAgent: req.get('User-Agent') || 'unknown',
				body: req.body,
				query: req.query,
				params: req.params,
				response: typeof data === 'string' ? data.substring(0, 500) : data,
			});
		}

		return originalSend.call(this, data);
	};

	next();
};
