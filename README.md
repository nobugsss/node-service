# node-service

基于Node.js和TypeScript的REST API服务

## 功能特性

✅ **已完成的功能**

- ✅ 提供返回服务器时间接口
- ✅ 提供返回服务器上的文件的接口
- ✅ 提供上传文件到服务器的接口
- ✅ 使用命令行在MySQL中手动创建数据库、创建表
- ✅ 通过脚本文本文件执行相同操作
- ✅ 构建REST API来从数据库中获取数据，并插入到数据库中

## 技术栈

### 核心框架

- **Node.js**: 运行时环境
- **TypeScript**: 编程语言
- **Express**: Web框架
- **MySQL**: 数据库

### 开发工具

- **Jest**: 测试框架
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Husky**: Git hooks
- **Winston**: 日志管理

### 安全工具

- **Helmet**: 安全头设置
- **express-rate-limit**: 限流保护
- **Joi**: 数据验证
- **bcryptjs**: 密码加密
- **jsonwebtoken**: JWT认证

### 其他工具

- **Multer**: 文件上传处理
- **CORS**: 跨域处理
- **dotenv**: 环境变量管理

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env` 并修改配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，设置您的配置信息：

```env
# 应用配置
NODE_ENV=development
PORT=3000

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=node_service_db

# 安全配置
JWT_SECRET=your_jwt_secret_here
BCRYPT_ROUNDS=12

# 文件上传配置
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain
```

### 3. 创建数据库

```bash
# 使用TypeScript脚本创建数据库
pnpm run db:create

# 或者使用SQL脚本
mysql -u root -p < scripts/database.sql
```

### 4. 插入示例数据

```bash
pnpm run db:seed
```

### 5. 启动服务

```bash
# 开发模式（推荐）
pnpm run dev

# 生产模式
pnpm run build
pnpm start
```

### 6. 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm run test:coverage

# 监听模式运行测试
pnpm run test:watch
```

### 7. 代码质量检查

```bash
# 运行 ESLint 检查
pnpm run lint

# 自动修复 ESLint 问题
pnpm run lint:fix

# 检查代码格式
pnpm run format:check

# 自动格式化代码
pnpm run format

# TypeScript 类型检查
pnpm run type-check
```

### 8. VSCode 调试设置

**✅ 项目已配置完整的VSCode调试环境，开箱即用！**

#### 快速调试步骤：

1. **打开项目**: 在VSCode中打开项目根目录
2. **设置断点**: 在需要调试的代码行左侧点击设置断点
3. **启动调试**: 按 `F5` 或点击左侧调试面板的播放按钮
4. **选择配置**:
   - **调试API请求** (推荐): 调试API接口，支持断点
   - **调试当前测试文件**: 调试测试用例
   - **启动开发服务器**: 日常开发，支持热重载

#### 调试示例：

**API调试**:

1. 在 `src/controllers/timeController.ts` 第6行设置断点
2. 选择 "调试API请求" 配置
3. 按F5启动调试
4. 访问 `http://localhost:3001/api/time/time` 触发断点

**测试调试**:

1. 打开 `tests/api.test.ts` 文件
2. 在测试代码中设置断点
3. 选择 "调试当前测试文件" 配置
4. 按F5启动调试

#### 调试配置说明：

| 配置名称             | 用途         | 端口 | 特点                 |
| -------------------- | ------------ | ---- | -------------------- |
| **调试API请求**      | 调试API接口  | 3001 | 支持断点，不自动重启 |
| **调试当前测试文件** | 调试测试用例 | -    | 支持断点调试         |
| **启动开发服务器**   | 日常开发     | 3001 | 自动重启，热重载     |

> 📖 **详细调试指南**: 查看 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) 获取完整的调试说明和技巧
>
> 🚀 **快速上手**: 查看 [docs/DEBUG_QUICKSTART.md](docs/DEBUG_QUICKSTART.md) 5分钟学会调试

## API 接口

### 基础信息

- 基础URL: `http://localhost:3000`
- 响应格式: JSON
- 所有响应都包含 `success`、`message` 字段

### 主要端点

| 功能       | 方法   | 端点                         | 描述                               |
| ---------- | ------ | ---------------------------- | ---------------------------------- |
| 根路径     | GET    | `/`                          | 获取API基本信息                    |
| 服务器时间 | GET    | `/api/time/time`             | 获取服务器时间                     |
| 健康检查   | GET    | `/api/time/health`           | 服务健康状态                       |
| 文件列表   | GET    | `/api/files/files`           | 获取上传文件列表                   |
| 下载文件   | GET    | `/api/files/files/:filename` | 下载指定文件                       |
| 单文件上传 | POST   | `/api/upload/single`         | 上传单个文件                       |
| 多文件上传 | POST   | `/api/upload/multiple`       | 上传多个文件                       |
| 用户列表   | GET    | `/api/users`                 | 获取用户列表（支持分页）           |
| 用户详情   | GET    | `/api/users/:id`             | 获取单个用户信息                   |
| 创建用户   | POST   | `/api/users`                 | 创建新用户                         |
| 更新用户   | PUT    | `/api/users/:id`             | 更新用户信息                       |
| 删除用户   | DELETE | `/api/users/:id`             | 删除用户                           |
| 产品列表   | GET    | `/api/products`              | 获取产品列表（支持分页和分类筛选） |
| 产品详情   | GET    | `/api/products/:id`          | 获取单个产品信息                   |
| 创建产品   | POST   | `/api/products`              | 创建新产品                         |
| 更新产品   | PUT    | `/api/products/:id`          | 更新产品信息                       |
| 删除产品   | DELETE | `/api/products/:id`          | 删除产品                           |

## 数据库结构

### 用户表 (users)

- `id`: 主键，自增
- `username`: 用户名，唯一
- `email`: 邮箱，唯一
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 分类表 (categories)

- `id`: 主键，自增
- `name`: 分类名称，唯一
- `description`: 分类描述
- `created_at`: 创建时间
- `updated_at`: 更新时间

### 产品表 (products)

- `id`: 主键，自增
- `name`: 产品名称
- `description`: 产品描述
- `price`: 价格
- `stock`: 库存
- `category_id`: 分类ID，外键
- `created_at`: 创建时间
- `updated_at`: 更新时间

## 项目结构

```
node-service/
├── src/
│   ├── config/          # 配置文件
│   │   └── database.ts  # 数据库配置
│   ├── controllers/     # 控制器层
│   │   ├── timeController.ts
│   │   ├── fileController.ts
│   │   ├── uploadController.ts
│   │   ├── userController.ts
│   │   └── productController.ts
│   ├── middleware/      # 中间件
│   │   ├── index.ts     # 基础中间件
│   │   └── security.ts  # 安全中间件
│   ├── models/          # 数据模型层
│   │   └── index.ts     # 数据库模型
│   ├── routes/          # 路由
│   │   ├── timeRoutes.ts
│   │   ├── fileRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── productRoutes.ts
│   ├── services/        # 服务层
│   │   └── index.ts     # 业务逻辑服务
│   ├── types/           # 类型定义
│   │   └── index.ts     # TypeScript类型定义
│   ├── utils/           # 工具函数
│   │   ├── logger.ts    # 日志工具
│   │   └── validation.ts # 验证工具
│   └── index.ts         # 应用入口文件
├── tests/               # 测试文件
│   └── api.test.ts      # API测试
├── scripts/             # 脚本文件
│   ├── create-database.ts
│   ├── seed-database.ts
│   ├── test-api.ts
│   └── database.sql
├── docs/                # 文档目录
│   └── DEVELOPMENT.md   # 开发指南
├── uploads/             # 上传文件目录
├── logs/                # 日志文件目录
├── .vscode/             # VSCode配置
│   ├── launch.json      # 调试配置
│   └── settings.json    # 编辑器设置
├── .husky/              # Git hooks
│   └── pre-commit       # 提交前检查
├── dist/                # 编译输出目录
├── coverage/            # 测试覆盖率报告
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── .gitignore           # Git忽略文件
├── env.example          # 环境变量示例
├── API.md               # API详细文档
└── README.md            # 项目说明
```

## 使用示例

### 1. 获取服务器时间

```bash
curl http://localhost:3000/api/time/time
```

### 2. 上传文件

```bash
curl -X POST -F "file=@example.txt" http://localhost:3000/api/upload/single
```

### 3. 创建用户

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}' \
  http://localhost:3000/api/users
```

### 4. 获取产品列表

```bash
curl "http://localhost:3000/api/products?page=1&limit=10&category_id=1"
```

## 开发说明

### 开发模式

```bash
pnpm run dev
```

使用 `tsx watch` 模式，文件修改后自动重启服务。

### 调试

使用 VSCode 调试功能：

1. 按 F5 启动调试
2. 设置断点进行调试
3. 查看变量和调用栈

### 代码质量

项目集成了完整的代码质量工具：

- **ESLint**: 代码检查，确保代码质量
- **Prettier**: 代码格式化，保持代码风格一致
- **Husky**: Git hooks，提交前自动检查
- **Jest**: 单元测试，确保功能正确性

### 生产部署

```bash
pnpm run build
pnpm start
```

先编译TypeScript代码，然后运行编译后的JavaScript代码。

### 数据库操作

```bash
# 创建数据库和表
pnpm run db:create

# 插入示例数据
pnpm run db:seed
```

## 安全特性

- ✅ **输入验证**: 使用 Joi 进行严格的数据验证
- ✅ **SQL注入防护**: 使用参数化查询
- ✅ **文件上传安全**: 限制文件类型和大小
- ✅ **安全头**: 使用 Helmet 设置安全头
- ✅ **限流保护**: 防止API滥用
- ✅ **CORS配置**: 安全的跨域配置
- ✅ **日志记录**: 完整的操作日志

## 注意事项

1. **环境变量**: 请确保正确配置 `.env` 文件中的所有必要配置
2. **MySQL服务**: 确保MySQL服务正在运行
3. **文件上传**: 上传的文件会保存在 `uploads/` 目录中
4. **端口冲突**:
   - 开发服务器默认端口3000
   - **调试配置使用端口3001**，避免冲突
   - 如果端口被占用，运行 `kill -9 $(lsof -t -i:3001)`
5. **安全配置**: 生产环境请修改默认的JWT密钥和密码
6. **日志文件**: 日志文件保存在 `logs/` 目录中
7. **测试覆盖**: 建议保持测试覆盖率 > 80%
8. **调试设置**:
   - VSCode调试配置已预配置，开箱即用
   - 推荐使用 "调试API请求" 配置进行API调试
   - 测试调试使用 "调试当前测试文件" 配置

## 快速调试指南

### 🚀 5分钟上手调试

1. **打开项目**: 在VSCode中打开项目根目录
2. **设置断点**: 在 `src/controllers/timeController.ts` 第6行设置断点
3. **启动调试**: 按F5，选择 "调试API请求"
4. **触发断点**: 访问 `http://localhost:3001/api/time/time`
5. **开始调试**: 断点会自动暂停，可以查看变量值

### 🔧 常见调试问题

- **断点不生效**: 确保选择了正确的调试配置
- **端口冲突**: 调试使用端口3001，不会与开发服务器冲突
- **Jest调试失败**: 使用 "调试测试文件 (使用npx)" 配置

详细的开发指南请参考 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## 许可证

MIT License
