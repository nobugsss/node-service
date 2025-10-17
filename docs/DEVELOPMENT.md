# 开发指南

## 项目结构

```
node-service/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── controllers/     # 控制器层
│   ├── middleware/      # 中间件
│   │   ├── index.ts     # 基础中间件
│   │   └── security.ts  # 安全中间件
│   ├── models/          # 数据模型层
│   ├── routes/          # 路由
│   ├── services/        # 服务层
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   │   ├── logger.ts    # 日志工具
│   │   └── validation.ts # 验证工具
│   └── index.ts         # 应用入口
├── tests/               # 测试文件
├── scripts/             # 脚本文件
├── uploads/             # 上传文件目录
├── logs/                # 日志文件目录
└── docs/                # 文档目录
```

## 开发环境设置

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
cp env.example .env
# 编辑 .env 文件，设置数据库连接信息
```

### 3. 初始化数据库

```bash
pnpm run db:create
pnpm run db:seed
```

### 4. 启动开发服务器

```bash
pnpm run dev
```

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 使用 2 空格缩进

### 提交规范

- 使用 Husky 进行 pre-commit 检查
- 提交前自动运行 lint 和格式化
- 提交信息使用约定式提交格式

### 测试规范

- 为新功能编写单元测试
- 测试覆盖率要求 > 80%
- 使用 Jest 作为测试框架

## 调试指南

### VSCode 调试配置

**✅ 项目已配置完整的VSCode调试环境，所有配置都经过测试，确保用户能正常使用。**

#### 🎯 调试配置概览

项目提供6种调试配置，满足不同调试需求：

| 配置名称                   | 用途                   | 端口 | 特点                     |
| -------------------------- | ---------------------- | ---- | ------------------------ |
| **启动开发服务器**         | 日常开发，支持热重载   | 3001 | 自动重启，无需断点       |
| **调试API请求**            | 调试API接口，支持断点  | 3001 | 不自动重启，适合断点调试 |
| **运行测试**               | 运行所有测试用例       | -    | 查看测试结果             |
| **调试当前测试文件**       | 调试当前打开的测试文件 | -    | 支持断点调试             |
| **调试特定测试**           | 调试指定名称的测试     | -    | 精确调试单个测试         |
| **调试测试文件 (使用npx)** | 备用测试调试方案       | -    | 使用npx运行Jest          |

#### 📁 调试配置文件

配置文件位置：`.vscode/launch.json`

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "启动开发服务器",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/src/index.ts",
			"runtimeArgs": ["-r", "tsx/cjs"],
			"env": {
				"NODE_ENV": "development",
				"PORT": "3001"
			},
			"console": "integratedTerminal",
			"restart": true,
			"protocol": "inspector",
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"outFiles": ["${workspaceFolder}/dist/**/*.js"]
		},
		{
			"name": "调试API请求",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/src/index.ts",
			"runtimeArgs": ["-r", "tsx/cjs"],
			"env": {
				"NODE_ENV": "development",
				"PORT": "3001"
			},
			"console": "integratedTerminal",
			"restart": false,
			"protocol": "inspector",
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"stopOnEntry": false
		},
		{
			"name": "运行测试",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
			"args": ["--runInBand", "--no-cache", "--verbose"],
			"console": "integratedTerminal",
			"internalConsoleOptions": "neverOpen",
			"env": {
				"NODE_ENV": "test"
			},
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"cwd": "${workspaceFolder}"
		},
		{
			"name": "调试当前测试文件",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
			"args": [
				"--runInBand",
				"--no-cache",
				"--verbose",
				"${fileBasenameNoExtension}"
			],
			"console": "integratedTerminal",
			"internalConsoleOptions": "neverOpen",
			"env": {
				"NODE_ENV": "test"
			},
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"cwd": "${workspaceFolder}"
		},
		{
			"name": "调试特定测试",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
			"args": [
				"--runInBand",
				"--no-cache",
				"--verbose",
				"--testNamePattern=${input:testName}"
			],
			"console": "integratedTerminal",
			"internalConsoleOptions": "neverOpen",
			"env": {
				"NODE_ENV": "test"
			},
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"cwd": "${workspaceFolder}"
		},
		{
			"name": "调试测试文件 (使用npx)",
			"type": "node",
			"request": "launch",
			"program": "${workspaceFolder}/node_modules/.bin/jest",
			"args": ["--runInBand", "--no-cache", "--verbose"],
			"console": "integratedTerminal",
			"internalConsoleOptions": "neverOpen",
			"env": {
				"NODE_ENV": "test"
			},
			"skipFiles": ["<node_internals>/**"],
			"sourceMaps": true,
			"cwd": "${workspaceFolder}",
			"runtimeExecutable": "npx"
		}
	],
	"inputs": [
		{
			"id": "testName",
			"description": "输入要调试的测试名称",
			"default": "应该返回API基本信息",
			"type": "promptString"
		}
	]
}
```

### 🚀 详细调试指南

#### 1. API接口调试 (推荐)

**适用场景**: 调试控制器、服务层、中间件等API相关代码

**步骤**:

1. **设置断点**: 在需要调试的代码行左侧点击设置断点（红色圆点）
2. **启动调试**:
   - 按 `F5` 或点击左侧调试面板的播放按钮
   - 选择 "调试API请求" 配置
3. **触发断点**:
   - 服务器启动后，访问对应的API接口
   - 例如：`http://localhost:3001/api/time/time`
4. **调试操作**:
   - 断点会自动暂停执行
   - 查看变量值、调用栈等信息
   - 使用调试工具栏控制执行流程

**示例**:

```typescript
// 在 src/controllers/timeController.ts 第6行设置断点
export const getServerTime = (req: Request, res: Response) => {
	const response: ApiResponse = {
		// ← 在这里设置断点
		success: true,
		message: '获取服务器时间成功',
		data: {
			timestamp: Date.now(),
			datetime: new Date().toISOString(),
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	};
	res.json(response);
};
```

#### 2. 测试调试

**适用场景**: 调试测试用例，验证业务逻辑

**方法A: 调试当前测试文件**

1. **打开测试文件**: `tests/api.test.ts`
2. **设置断点**: 在测试代码中设置断点
3. **启动调试**: 选择 "调试当前测试文件" 配置
4. **查看结果**: 断点会在测试执行时暂停

**方法B: 调试特定测试**

1. **设置断点**: 在测试代码中设置断点
2. **启动调试**: 选择 "调试特定测试" 配置
3. **输入测试名称**: 例如 "应该返回API基本信息"
4. **查看结果**: 只有指定的测试会运行并触发断点

**示例**:

```typescript
// 在 tests/api.test.ts 中设置断点
describe('GET /', () => {
	it('应该返回API基本信息', async () => {
		// 在这里设置断点，查看测试数据
		const response = await request(app).get('/').expect(200);

		// 在这里设置断点，查看响应结果
		expect(response.body.success).toBe(true);
	});
});
```

#### 3. 开发服务器调试

**适用场景**: 日常开发，不需要断点调试

**步骤**:

1. **启动调试**: 选择 "启动开发服务器" 配置
2. **自动重启**: 文件变化时自动重启
3. **查看日志**: 在集成终端中查看运行日志

#### 4. 测试运行 (无断点)

**适用场景**: 快速查看测试结果

**步骤**:

1. **启动调试**: 选择 "运行测试" 配置
2. **查看结果**: 在集成终端中查看测试结果
3. **无需断点**: 直接运行所有测试用例

### 🛠️ 调试技巧

#### 断点类型

- **普通断点**: 点击代码行左侧设置
- **条件断点**: 右键断点 → "编辑断点" → 设置条件
- **日志断点**: 右键断点 → "编辑断点" → 勾选"记录消息"

#### 调试面板功能

- **变量**: 查看当前作用域的所有变量
- **监视**: 添加要监视的表达式
- **调用栈**: 查看函数调用链
- **断点**: 管理所有断点

#### 调试控制台

- 在暂停状态下可以执行代码片段
- 查看变量值：输入变量名
- 调用函数：`functionName()`

### 🔧 常见问题解决

#### 问题1: 断点不生效

**原因**: 可能选择了错误的调试配置
**解决**:

- API调试使用 "调试API请求"
- 测试调试使用 "调试当前测试文件"

#### 问题2: 端口冲突

**原因**: 端口3000被占用
**解决**:

- 调试配置使用端口3001
- 如果仍有冲突，运行 `kill -9 $(lsof -t -i:3001)`

#### 问题3: Jest调试失败

**原因**: Jest路径或配置问题
**解决**:

- 使用 "调试测试文件 (使用npx)" 配置
- 确保已安装所有依赖：`pnpm install`

#### 问题4: 断点位置不准确

**原因**: Source Map配置问题
**解决**:

- 确保 `"sourceMaps": true` 已设置
- 重启调试会话

### 📝 调试最佳实践

1. **选择合适的配置**: 根据调试需求选择对应的配置
2. **设置关键断点**: 在关键逻辑处设置断点
3. **使用条件断点**: 在循环或重复调用中设置条件
4. **查看调用栈**: 利用调用栈理解代码执行流程
5. **使用监视**: 添加复杂表达式到监视面板
6. **日志结合**: 结合日志和断点进行调试

### 常见调试场景

#### 1. API接口调试

```typescript
// 在控制器中设置断点
export const createUser = async (req: Request, res: Response) => {
	// 在这里设置断点，查看请求数据
	const { username, email } = req.body;

	try {
		const user = await UserService.createUser(username, email);
		// 在这里设置断点，查看返回结果
		res.status(201).json(response);
	} catch (error) {
		// 在这里设置断点，查看错误信息
		res.status(500).json(response);
	}
};
```

#### 2. 数据库查询调试

```typescript
// 在模型层设置断点
static async findAll(page: number = 1, limit: number = 10) {
  const offset = (page - 1) * limit;

  // 在这里设置断点，查看查询参数
  const [countResult] = await pool.execute(
    'SELECT COUNT(*) as total FROM users'
  );

  // 在这里设置断点，查看查询结果
  const total = (countResult as any)[0].total;
  return { users: rows as User[], total };
}
```

#### 3. 测试调试

```typescript
// 在测试文件中设置断点
describe('POST /api/users', () => {
	it('应该创建新用户', async () => {
		const userData = {
			username: 'testuser',
			email: 'test@example.com',
		};

		// 在这里设置断点，查看测试数据
		const response = await request(app)
			.post('/api/users')
			.send(userData)
			.expect(201);

		// 在这里设置断点，查看响应结果
		expect(response.body.success).toBe(true);
	});
});
```

#### 4. 错误调试

```typescript
// 在错误处理中间件设置断点
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// 在这里设置断点，分析错误原因
	console.error('Error:', err);

	const response: ApiResponse = {
		success: false,
		message: '服务器内部错误',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined,
	};

	res.status(500).json(response);
};
```

### 日志调试

#### 日志配置

- **开发环境**: 日志输出到控制台和文件
- **生产环境**: 日志仅输出到文件
- **日志级别**: error, warn, info, debug
- **日志文件**:
  - `logs/error.log` - 错误日志
  - `logs/combined.log` - 所有日志

#### 使用日志调试

```typescript
import { logger } from '../utils/logger';

// 在代码中添加日志
export const createUser = async (req: Request, res: Response) => {
	logger.info('开始创建用户', { body: req.body });

	try {
		const { username, email } = req.body;
		logger.debug('用户数据验证通过', { username, email });

		const user = await UserService.createUser(username, email);
		logger.info('用户创建成功', { userId: user.id });

		res.status(201).json(response);
	} catch (error) {
		logger.error('用户创建失败', { error: error.message, body: req.body });
		res.status(500).json(response);
	}
};
```

### 调试最佳实践

1. **合理设置断点**: 不要设置过多断点，影响调试效率
2. **使用条件断点**: 只在特定条件下暂停执行
3. **利用监视功能**: 持续观察关键变量的变化
4. **查看调用栈**: 理解代码执行路径
5. **使用日志**: 在关键位置添加日志，便于问题定位
6. **测试驱动调试**: 先写测试，再调试实现

## API 开发

### 添加新 API

1. 在 `src/types/` 中定义类型
2. 在 `src/models/` 中创建数据模型
3. 在 `src/services/` 中实现业务逻辑
4. 在 `src/controllers/` 中创建控制器
5. 在 `src/routes/` 中定义路由
6. 在 `src/utils/validation.ts` 中添加验证规则
7. 编写测试用例

### 示例：添加分类 API

```typescript
// 1. 定义类型 (src/types/index.ts)
export interface Category {
	id: number;
	name: string;
	description: string;
	created_at: Date;
	updated_at: Date;
}

// 2. 创建模型 (src/models/index.ts)
export class CategoryModel {
	static async findAll(): Promise<Category[]> {
		// 实现数据库查询
	}
}

// 3. 创建服务 (src/services/index.ts)
export class CategoryService {
	static async getCategories(): Promise<Category[]> {
		// 实现业务逻辑
	}
}

// 4. 创建控制器 (src/controllers/categoryController.ts)
export const getCategories = async (req: Request, res: Response) => {
	// 实现控制器逻辑
};

// 5. 定义路由 (src/routes/categoryRoutes.ts)
router.get('/categories', getCategories);

// 6. 添加验证规则 (src/utils/validation.ts)
export const categoryValidation = {
	create: Joi.object({
		name: Joi.string().required(),
		description: Joi.string(),
	}),
};
```

## 安全最佳实践

### 输入验证

- 使用 Joi 进行数据验证
- 验证所有用户输入
- 设置合理的字段长度限制

### 文件上传

- 限制文件类型和大小
- 验证文件内容
- 使用安全的文件名

### 数据库安全

- 使用参数化查询
- 避免 SQL 注入
- 设置适当的数据库权限

### 安全头

- 使用 Helmet 设置安全头
- 配置 CORS 策略
- 启用限流保护

## 性能优化

### 数据库优化

- 使用连接池
- 添加适当的索引
- 优化查询语句

### 缓存策略

- 实现 Redis 缓存
- 设置合理的缓存过期时间
- 使用缓存预热

### 监控和日志

- 使用 Winston 进行日志记录
- 监控 API 响应时间
- 设置错误告警

## 部署指南

### 生产环境配置

1. 设置 `NODE_ENV=production`
2. 配置生产数据库
3. 设置日志级别
4. 配置反向代理

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 环境变量

生产环境必须设置的环境变量：

- `NODE_ENV=production`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CORS_ORIGIN`

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务是否运行
   - 验证连接配置
   - 检查网络连接

2. **端口被占用**
   - 更改 PORT 环境变量
   - 杀死占用端口的进程

3. **文件上传失败**
   - 检查 uploads 目录权限
   - 验证文件大小限制
   - 检查文件类型限制

### 日志分析

- 查看 `logs/error.log` 了解错误信息
- 查看 `logs/combined.log` 了解完整日志
- 使用日志级别过滤信息

## 更新日志

### v1.0.0

- 初始版本发布
- 基础 CRUD 功能
- 文件上传功能
- 安全中间件
- 测试框架
