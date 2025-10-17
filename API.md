# Node Service API 文档

基于Node.js和TypeScript的REST API服务

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
# 开发模式
pnpm run dev

# 生产模式
pnpm run build
pnpm start
```

## API 接口

### 基础信息

- 基础URL: `http://localhost:3000`
- 响应格式: JSON
- 所有响应都包含 `success`、`message` 字段

### 1. 服务器时间接口

#### 获取服务器时间

```
GET /api/time/time
```

响应示例：

```json
{
	"success": true,
	"message": "获取服务器时间成功",
	"data": {
		"timestamp": 1697541234567,
		"datetime": "2023-10-17T10:32:14.567Z",
		"timezone": "Asia/Shanghai"
	}
}
```

#### 健康检查

```
GET /api/time/health
```

### 2. 文件管理接口

#### 获取文件列表

```
GET /api/files/files
```

#### 下载文件

```
GET /api/files/files/:filename
```

### 3. 文件上传接口

#### 单文件上传

```
POST /api/upload/single
Content-Type: multipart/form-data

参数: file (文件)
```

#### 多文件上传

```
POST /api/upload/multiple
Content-Type: multipart/form-data

参数: files (文件数组，最多10个)
```

### 4. 用户管理接口

#### 获取用户列表

```
GET /api/users?page=1&limit=10
```

#### 获取单个用户

```
GET /api/users/:id
```

#### 创建用户

```
POST /api/users
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com"
}
```

#### 更新用户

```
PUT /api/users/:id
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### 删除用户

```
DELETE /api/users/:id
```

### 5. 产品管理接口

#### 获取产品列表

```
GET /api/products?page=1&limit=10&category_id=1
```

#### 获取单个产品

```
GET /api/products/:id
```

#### 创建产品

```
POST /api/products
Content-Type: application/json

{
  "name": "产品名称",
  "description": "产品描述",
  "price": 99.99,
  "stock": 100,
  "category_id": 1
}
```

#### 更新产品

```
PUT /api/products/:id
Content-Type: application/json

{
  "name": "新产品名称",
  "description": "新产品描述",
  "price": 199.99,
  "stock": 50,
  "category_id": 2
}
```

#### 删除产品

```
DELETE /api/products/:id
```

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
│   ├── controllers/      # 控制器
│   ├── middleware/       # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   └── index.ts         # 入口文件
├── scripts/             # 脚本文件
├── uploads/             # 上传文件目录
├── package.json         # 依赖配置
├── tsconfig.json        # TypeScript配置
└── README.md           # 项目说明
```

## 技术栈

- **Node.js**: 运行时环境
- **TypeScript**: 编程语言
- **Express**: Web框架
- **MySQL**: 数据库
- **Multer**: 文件上传处理
- **CORS**: 跨域处理
- **dotenv**: 环境变量管理
