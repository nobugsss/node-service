import winston from 'winston';
import path from 'path';

// 创建日志目录
const logDir = 'logs';

// 配置日志格式
const logFormat = winston.format.combine(
	winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	winston.format.errors({ stack: true }),
	winston.format.json()
);

// 创建logger实例
export const logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: logFormat,
	defaultMeta: { service: 'node-service' },
	transports: [
		// 错误日志文件
		new winston.transports.File({
			filename: path.join(logDir, 'error.log'),
			level: 'error',
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
		// 所有日志文件
		new winston.transports.File({
			filename: path.join(logDir, 'combined.log'),
			maxsize: 5242880, // 5MB
			maxFiles: 5,
		}),
	],
});

// 开发环境下同时输出到控制台
if (process.env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}

export default logger;
