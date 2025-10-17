import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiResponse } from '../types';

// 安全头中间件
export const securityHeaders = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", 'data:', 'https:'],
		},
	},
	crossOriginEmbedderPolicy: false,
});

// 限流中间件
export const rateLimiter = rateLimit({
	windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
	max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 限制每个IP 15分钟内最多100个请求
	message: {
		success: false,
		message: '请求过于频繁，请稍后再试',
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// 文件上传配置
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = process.env.UPLOAD_DIR || 'uploads';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

// 文件过滤器
const fileFilter = (
	req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) => {
	const allowedTypes = (
		process.env.ALLOWED_FILE_TYPES ||
		'image/jpeg,image/png,image/gif,application/pdf,text/plain'
	).split(',');

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('不支持的文件类型'));
	}
};

// 文件上传中间件
export const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
		files: 10, // 最多10个文件
	},
});

// 单文件上传中间件
export const uploadSingle = upload.single('file');

// 多文件上传中间件
export const uploadMultiple = upload.array('files', 10);

// 文件上传错误处理中间件
export const handleUploadError = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof multer.MulterError) {
		let message = '文件上传失败';

		switch (error.code) {
			case 'LIMIT_FILE_SIZE':
				message = '文件大小超出限制';
				break;
			case 'LIMIT_FILE_COUNT':
				message = '文件数量超出限制';
				break;
			case 'LIMIT_UNEXPECTED_FILE':
				message = '意外的文件字段';
				break;
		}

		const response: ApiResponse = {
			success: false,
			message,
		};

		return res.status(400).json(response);
	}

	if (error.message === '不支持的文件类型') {
		const response: ApiResponse = {
			success: false,
			message: '不支持的文件类型',
		};

		return res.status(400).json(response);
	}

	next(error);
};

// CORS配置中间件
export const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		const allowedOrigins = (
			process.env.CORS_ORIGIN || 'http://localhost:3000'
		).split(',');

		// 允许没有origin的请求（如移动应用）
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error('不允许的CORS源'));
		}
	},
	credentials: true,
	optionsSuccessStatus: 200,
};

// 请求大小限制中间件
export const requestSizeLimit = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const maxSize = parseInt(process.env.MAX_REQUEST_SIZE || '10485760'); // 10MB

	if (
		req.headers['content-length'] &&
		parseInt(req.headers['content-length']) > maxSize
	) {
		const response: ApiResponse = {
			success: false,
			message: '请求体过大',
		};

		return res.status(413).json(response);
	}

	next();
};
