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

- **Node.js**: 运行时环境
- **TypeScript**: 编程语言
- **Express**: Web框架
- **MySQL**: 数据库
- **Multer**: 文件上传处理
- **CORS**: 跨域处理
- **dotenv**: 环境变量管理

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env` 并修改数据库配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，设置您的MySQL数据库连接信息：

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=node_service_db
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
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

### 6. 测试API

```bash
# 确保服务器运行后执行
pnpm run test:api
```

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
│   │   └── database.ts # 数据库配置
│   ├── controllers/     # 控制器
│   │   ├── timeController.ts    # 时间相关控制器
│   │   ├── fileController.ts     # 文件管理控制器
│   │   ├── uploadController.ts   # 文件上传控制器
│   │   ├── userController.ts     # 用户管理控制器
│   │   └── productController.ts  # 产品管理控制器
│   ├── middleware/      # 中间件
│   │   └── index.ts    # 错误处理、日志等中间件
│   ├── routes/         # 路由
│   │   ├── timeRoutes.ts
│   │   ├── fileRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   ├── userRoutes.ts
│   │   └── productRoutes.ts
│   ├── types/          # 类型定义
│   │   └── index.ts    # API响应类型、数据库模型类型
│   ├── utils/          # 工具函数
│   └── index.ts        # 应用入口文件
├── scripts/            # 脚本文件
│   ├── create-database.ts  # 创建数据库脚本
│   ├── seed-database.ts    # 插入示例数据脚本
│   ├── test-api.ts         # API测试脚本
│   └── database.sql        # SQL脚本
├── uploads/            # 上传文件目录
├── dist/               # 编译输出目录
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
├── .gitignore         # Git忽略文件
├── env.example        # 环境变量示例
├── API.md            # API详细文档
└── README.md         # 项目说明
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

## 注意事项

1. **环境变量**: 请确保正确配置 `.env` 文件中的数据库连接信息
2. **MySQL服务**: 确保MySQL服务正在运行
3. **文件上传**: 上传的文件会保存在 `uploads/` 目录中
4. **端口冲突**: 默认端口3000，可在 `.env` 文件中修改
5. **跨域**: 已配置CORS，支持跨域请求

## 许可证

MIT License
