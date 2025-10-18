import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
	requestLogger,
	errorHandler,
	notFoundHandler,
	slowRequestLogger,
	errorRequestLogger,
} from './middleware';
import {
	securityHeaders,
	rateLimiter,
	corsOptions,
	requestSizeLimit,
} from './middleware/security';
import timeRoutes from './routes/timeRoutes';
import fileRoutes from './routes/fileRoutes';
import uploadRoutes from './routes/uploadRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(securityHeaders);
app.use(rateLimiter);

// CORS配置
app.use(cors(corsOptions));

// 请求体解析中间件
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求大小限制
app.use(requestSizeLimit);

// 请求日志中间件
app.use(requestLogger);
app.use(slowRequestLogger(1000)); // 超过1秒的请求会记录警告
app.use(errorRequestLogger); // 记录错误请求详情

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 路由
app.use('/api/time', timeRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', uploadRoutes);
app.use('/api', userRoutes);
app.use('/api', productRoutes);

// 根路由
app.get('/', (req, res) => {
	res.json({
		success: true,
		message: 'Node Service API 运行中',
		version: '1.0.0',
		environment: process.env.NODE_ENV || 'development',
		endpoints: {
			time: '/api/time',
			files: '/api/files',
			upload: '/api/upload',
			users: '/api/users',
			products: '/api/products',
		},
	});
});

// 健康检查路由
app.get('/health', (req, res) => {
	res.json({
		success: true,
		message: '服务健康',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

// 错误处理中间件
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
	logger.info(`🚀 服务器运行在端口 ${PORT}`);
	logger.info(`📖 API文档: http://localhost:${PORT}`);
	logger.info(`🔍 健康检查: http://localhost:${PORT}/health`);
});

export default app;
