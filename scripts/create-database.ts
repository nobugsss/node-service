import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createDatabase() {
	let connection;

	try {
		// 连接到MySQL服务器（不指定数据库）
		connection = await mysql.createConnection({
			host: process.env.DB_HOST || "localhost",
			port: parseInt(process.env.DB_PORT || "3306"),
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASSWORD || ""
		});

		console.log("✅ 已连接到MySQL服务器");

		// 创建数据库
		const dbName = process.env.DB_NAME || "node_service_db";
		await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
		console.log(`✅ 数据库 '${dbName}' 创建成功`);

		// 重新连接到指定数据库
		await connection.end();
		connection = await mysql.createConnection({
			host: process.env.DB_HOST || "localhost",
			port: parseInt(process.env.DB_PORT || "3306"),
			user: process.env.DB_USER || "root",
			password: process.env.DB_PASSWORD || "",
			database: dbName
		});

		// 创建用户表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("✅ 用户表创建成功");

		// 创建分类表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
		console.log("✅ 分类表创建成功");

		// 创建产品表
		await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        category_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
		console.log("✅ 产品表创建成功");

		console.log("🎉 数据库初始化完成！");
	} catch (error) {
		console.error("❌ 数据库创建失败:", error);
		process.exit(1);
	} finally {
		if (connection) {
			await connection.end();
			console.log("📝 数据库连接已关闭");
		}
	}
}

// 运行脚本
createDatabase();
