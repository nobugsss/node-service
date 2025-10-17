import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { requestLogger, errorHandler, notFoundHandler } from "./middleware";
import timeRoutes from "./routes/timeRoutes";
import fileRoutes from "./routes/fileRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

// 加载环境变量
dotenv.config();

const app: express.Application = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// 静态文件服务
app.use("/uploads", express.static("uploads"));

// 路由
app.use("/api/time", timeRoutes);
app.use("/api/files", fileRoutes);
app.use("/api", uploadRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);

// 根路由
app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "Node Service API 运行中",
		version: "1.0.0",
		endpoints: {
			time: "/api/time",
			files: "/api/files",
			upload: "/api/upload",
			users: "/api/users",
			products: "/api/products"
		}
	});
});

// 错误处理中间件
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
	console.log(`🚀 服务器运行在端口 ${PORT}`);
	console.log(`📖 API文档: http://localhost:${PORT}`);
});

export default app;
