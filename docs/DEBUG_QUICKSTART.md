# 🚀 调试快速开始指南

**✅ 项目已配置完整的VSCode调试环境，5分钟即可上手！**

## 📋 前置条件

- ✅ VSCode 已安装
- ✅ 项目依赖已安装 (`pnpm install`)
- ✅ MySQL 服务已启动
- ✅ 环境变量已配置 (`.env` 文件)

## 🎯 6种调试配置

| 配置名称                   | 用途         | 端口 | 推荐场景      |
| -------------------------- | ------------ | ---- | ------------- |
| **调试API请求**            | 调试API接口  | 3001 | ⭐ **最常用** |
| **调试当前测试文件**       | 调试测试用例 | -    | 测试开发      |
| **启动开发服务器**         | 日常开发     | 3001 | 不需要断点    |
| **运行测试**               | 查看测试结果 | -    | 快速验证      |
| **调试特定测试**           | 调试单个测试 | -    | 精确调试      |
| **调试测试文件 (使用npx)** | 备用测试调试 | -    | Jest问题备用  |

## 🚀 3分钟快速上手

### 步骤1: 设置断点

1. 打开 `src/controllers/timeController.ts`
2. 在第6行左侧点击设置断点（红色圆点）

```typescript
export const getServerTime = (req: Request, res: Response) => {
	const response: ApiResponse = {
		// ← 在这里设置断点
		success: true,
		message: '获取服务器时间成功',
		// ...
	};
	res.json(response);
};
```

### 步骤2: 启动调试

1. 按 `F5` 或点击左侧调试面板的播放按钮
2. 选择 **"调试API请求"** 配置
3. 等待服务器启动（看到 "Server running on port 3001"）

### 步骤3: 触发断点

1. 打开浏览器或Postman
2. 访问 `http://localhost:3001/api/time/time`
3. 断点会自动暂停执行！

### 步骤4: 开始调试

- ✅ 查看变量值
- ✅ 使用调试工具栏（继续、单步、跳出等）
- ✅ 在调试控制台执行代码
- ✅ 查看调用栈

## 🧪 测试调试示例

### 调试测试文件

1. **打开测试文件**: `tests/api.test.ts`
2. **设置断点**: 在测试代码中设置断点
3. **启动调试**: 选择 "调试当前测试文件" 配置
4. **查看结果**: 断点会在测试执行时暂停

### 调试特定测试

1. **设置断点**: 在测试代码中设置断点
2. **启动调试**: 选择 "调试特定测试" 配置
3. **输入测试名称**: 例如 "应该返回API基本信息"
4. **查看结果**: 只有指定的测试会运行

## 🔧 常见问题解决

### ❌ 问题1: 断点不生效

**原因**: 选择了错误的调试配置
**解决**:

- API调试 → 使用 "调试API请求"
- 测试调试 → 使用 "调试当前测试文件"

### ❌ 问题2: 端口冲突

**原因**: 端口3001被占用
**解决**:

```bash
kill -9 $(lsof -t -i:3001)
```

### ❌ 问题3: Jest调试失败

**原因**: Jest路径或配置问题
**解决**:

- 使用 "调试测试文件 (使用npx)" 配置
- 确保依赖已安装：`pnpm install`

### ❌ 问题4: 断点位置不准确

**原因**: Source Map配置问题
**解决**:

- 确保 `"sourceMaps": true` 已设置
- 重启调试会话

## 🛠️ 调试技巧

### 断点类型

- **普通断点**: 点击代码行左侧设置
- **条件断点**: 右键断点 → "编辑断点" → 设置条件
- **日志断点**: 右键断点 → "编辑断点" → 勾选"记录消息"

### 调试面板功能

- **变量**: 查看当前作用域的所有变量
- **监视**: 添加要监视的表达式
- **调用栈**: 查看函数调用链
- **断点**: 管理所有断点

### 调试控制台

- 在暂停状态下可以执行代码片段
- 查看变量值：输入变量名
- 调用函数：`functionName()`

## 📝 调试最佳实践

1. **选择合适的配置**: 根据调试需求选择对应的配置
2. **设置关键断点**: 在关键逻辑处设置断点
3. **使用条件断点**: 在循环或重复调用中设置条件
4. **查看调用栈**: 利用调用栈理解代码执行流程
5. **使用监视**: 添加复杂表达式到监视面板
6. **日志结合**: 结合日志和断点进行调试

## 🎯 实际调试场景

### 场景1: API接口调试

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

### 场景2: 数据库查询调试

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

### 场景3: 测试调试

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

## 📚 更多资源

- 📖 **详细调试指南**: [DEVELOPMENT.md](DEVELOPMENT.md)
- 🔧 **项目配置**: [README.md](../README.md)
- 🧪 **测试指南**: [DEVELOPMENT.md](DEVELOPMENT.md#测试规范)

---

**🎉 现在你已经掌握了调试的基本技能！开始你的调试之旅吧！**
