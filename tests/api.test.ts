import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
	requestLogger,
	errorHandler,
	notFoundHandler,
} from '../src/middleware';
import {
	securityHeaders,
	rateLimiter,
	corsOptions,
	requestSizeLimit,
} from '../src/middleware/security';
import timeRoutes from '../src/routes/timeRoutes';
import fileRoutes from '../src/routes/fileRoutes';
import uploadRoutes from '../src/routes/uploadRoutes';
import userRoutes from '../src/routes/userRoutes';
import productRoutes from '../src/routes/productRoutes';
import { pool } from '../src/config/database';

// 加载环境变量
dotenv.config();

// 创建测试应用实例
const createTestApp = () => {
	const app = express();

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
			environment: 'test',
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

	return app;
};

const app = createTestApp();

describe('API 测试', () => {
	// 测试前清理数据
	beforeAll(async () => {
		await pool.execute(
			'DELETE FROM users WHERE email LIKE "test%@example.com"'
		);
	});

	// 测试后清理数据
	afterAll(async () => {
		await pool.execute(
			'DELETE FROM users WHERE email LIKE "test%@example.com"'
		);
		// 不关闭连接池，因为其他测试可能还在使用
	});

	describe('GET /', () => {
		it('应该返回API基本信息', async () => {
			const response = await request(app).get('/').expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('Node Service API 运行中');
			expect(response.body.version).toBe('1.0.0');
			expect(response.body.environment).toBe('test');
			expect(response.body.endpoints).toBeDefined();
		});
	});

	describe('GET /health', () => {
		it('应该返回健康状态', async () => {
			const response = await request(app).get('/health').expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('服务健康');
			expect(response.body.timestamp).toBeDefined();
			expect(response.body.uptime).toBeDefined();
		});
	});

	describe('GET /api/time/time', () => {
		it('应该返回服务器时间', async () => {
			const response = await request(app).get('/api/time/time').expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeDefined();
			expect(response.body.data.timestamp).toBeDefined();
			expect(response.body.data.datetime).toBeDefined();
		});
	});

	describe('GET /api/users', () => {
		it('应该返回用户列表', async () => {
			const response = await request(app).get('/api/users').expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeDefined();
			expect(response.body.data.data).toBeInstanceOf(Array);
			expect(response.body.data.pagination).toBeDefined();
		});

		it('应该支持分页参数', async () => {
			const response = await request(app)
				.get('/api/users?page=1&limit=5')
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.pagination.page).toBe(1);
			expect(response.body.data.pagination.limit).toBe(5);
		});
	});

	describe('POST /api/users', () => {
		it('应该创建新用户', async () => {
			const userData = {
				username: 'testuser',
				email: 'test@example.com',
			};

			const response = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data.username).toBe(userData.username);
			expect(response.body.data.email).toBe(userData.email);
		});

		it('应该验证必填字段', async () => {
			const response = await request(app)
				.post('/api/users')
				.send({})
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toContain('验证失败');
		});

		it('应该验证邮箱格式', async () => {
			const userData = {
				username: 'testuser',
				email: 'invalid-email',
			};

			const response = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toContain('验证失败');
		});
	});

	describe('GET /api/users/:id', () => {
		it('应该返回指定用户', async () => {
			// 先创建一个用户
			const userData = {
				username: 'testuser2',
				email: 'test2@example.com',
			};

			const createResponse = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(201);

			const userId = createResponse.body.data.id;

			// 获取用户
			const response = await request(app)
				.get(`/api/users/${userId}`)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.id).toBe(userId);
			expect(response.body.data.username).toBe(userData.username);
		});

		it('应该处理不存在的用户', async () => {
			const response = await request(app).get('/api/users/99999').expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('用户不存在');
		});
	});

	describe('PUT /api/users/:id', () => {
		it('应该更新用户信息', async () => {
			// 先创建一个用户
			const userData = {
				username: 'testuser3',
				email: 'test3@example.com',
			};

			const createResponse = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(201);

			const userId = createResponse.body.data.id;

			// 更新用户
			const updateData = {
				username: 'updateduser',
				email: 'updated@example.com',
			};

			const response = await request(app)
				.put(`/api/users/${userId}`)
				.send(updateData)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.username).toBe(updateData.username);
			expect(response.body.data.email).toBe(updateData.email);
		});

		it('应该处理不存在的用户更新', async () => {
			const updateData = {
				username: 'updateduser',
				email: 'updated@example.com',
			};

			const response = await request(app)
				.put('/api/users/99999')
				.send(updateData)
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('用户不存在');
		});
	});

	describe('DELETE /api/users/:id', () => {
		it('应该删除用户', async () => {
			// 先创建一个用户
			const userData = {
				username: 'testuser4',
				email: 'test4@example.com',
			};

			const createResponse = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(201);

			const userId = createResponse.body.data.id;

			// 删除用户
			const response = await request(app)
				.delete(`/api/users/${userId}`)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.message).toBe('用户删除成功');

			// 验证用户已被删除
			await request(app).get(`/api/users/${userId}`).expect(404);
		});

		it('应该处理不存在的用户删除', async () => {
			const response = await request(app)
				.delete('/api/users/99999')
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.message).toBe('用户不存在');
		});
	});
});
