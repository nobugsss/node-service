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
				winston.format.timestamp({ format: 'HH:mm:ss' }),
				winston.format.colorize(),
				winston.format.printf(({ timestamp, level, message, ...meta }) => {
					// 格式化HTTP请求日志
					if (message === 'HTTP Request' && meta.method) {
						const { method, url, statusCode, duration, ip } = meta as {
							method: string;
							url: string;
							statusCode: number;
							duration: string;
							ip: string;
						};
						const statusEmoji =
							statusCode >= 500
								? '❌'
								: statusCode >= 400
									? '⚠️'
									: statusCode >= 300
										? '🔄'
										: '✅';
						return `${timestamp} ${level} ${statusEmoji} ${method} ${url} - ${statusCode} - ${duration} - IP: ${ip}`;
					}

					// 格式化其他日志
					const metaStr = Object.keys(meta).length
						? JSON.stringify(meta, null, 2)
						: '';
					return `${timestamp} ${level} ${message} ${metaStr}`;
				})
			),
		})
	);
}

export default logger;
