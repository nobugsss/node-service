/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:45:00
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:45:19
 * @description:
 * @param:
 * @return:
 */
import axios from "axios";

/**
 * API测试脚本
 * 用于测试Node Service API的基本功能
 */

const BASE_URL = "http://localhost:3000";

// 测试函数
async function testAPI() {
	console.log("🚀 开始测试 Node Service API...\n");

	try {
		// 1. 测试根路径
		console.log("1. 测试根路径...");
		const rootResponse = await axios.get(`${BASE_URL}/`);
		console.log("✅ 根路径响应:", rootResponse.data.message);
		console.log("📋 可用端点:", Object.keys(rootResponse.data.endpoints).join(", "));
		console.log("");

		// 2. 测试服务器时间接口
		console.log("2. 测试服务器时间接口...");
		const timeResponse = await axios.get(`${BASE_URL}/api/time/time`);
		console.log("✅ 服务器时间:", timeResponse.data.data.datetime);
		console.log("");

		// 3. 测试健康检查接口
		console.log("3. 测试健康检查接口...");
		const healthResponse = await axios.get(`${BASE_URL}/api/time/health`);
		console.log("✅ 服务状态:", healthResponse.data.data.status);
		console.log("⏱️  运行时间:", Math.round(healthResponse.data.data.uptime), "秒");
		console.log("");

		// 4. 测试文件列表接口
		console.log("4. 测试文件列表接口...");
		const filesResponse = await axios.get(`${BASE_URL}/api/files/files`);
		console.log("✅ 文件列表获取成功，文件数量:", filesResponse.data.data.length);
		console.log("");

		// 5. 测试用户接口
		console.log("5. 测试用户接口...");
		const usersResponse = await axios.get(`${BASE_URL}/api/users`);
		console.log("✅ 用户列表获取成功，用户数量:", usersResponse.data.data.data.length);
		console.log("");

		// 6. 测试产品接口
		console.log("6. 测试产品接口...");
		const productsResponse = await axios.get(`${BASE_URL}/api/products`);
		console.log("✅ 产品列表获取成功，产品数量:", productsResponse.data.data.data.length);
		console.log("");

		console.log("🎉 所有API测试通过！");
	} catch (error) {
		console.error("❌ API测试失败:", error.message);
		if (error.response) {
			console.error("响应状态:", error.response.status);
			console.error("响应数据:", error.response.data);
		}
		process.exit(1);
	}
}

// 检查服务器是否运行
async function checkServer() {
	try {
		await axios.get(`${BASE_URL}/api/time/health`);
		return true;
	} catch {
		return false;
	}
}

// 主函数
async function main() {
	console.log("🔍 检查服务器状态...");
	const isServerRunning = await checkServer();

	if (!isServerRunning) {
		console.log("❌ 服务器未运行！");
		console.log("请先启动服务器: pnpm run dev");
		process.exit(1);
	}

	console.log("✅ 服务器运行正常\n");
	await testAPI();
}

// 运行测试
main();
