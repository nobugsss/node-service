import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { ApiResponse } from "../types";

// 获取文件列表
export const getFileList = async (req: Request, res: Response) => {
	try {
		const uploadDir = path.join(process.cwd(), "uploads");

		// 确保uploads目录存在
		try {
			await fs.access(uploadDir);
		} catch {
			await fs.mkdir(uploadDir, { recursive: true });
		}

		const files = await fs.readdir(uploadDir);
		const fileDetails = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(uploadDir, file);
				const stats = await fs.stat(filePath);
				return {
					name: file,
					size: stats.size,
					created: stats.birthtime,
					modified: stats.mtime,
					isDirectory: stats.isDirectory()
				};
			})
		);

		const response: ApiResponse = {
			success: true,
			message: "获取文件列表成功",
			data: fileDetails
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "获取文件列表失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 下载文件
export const downloadFile = async (req: Request, res: Response) => {
	try {
		const { filename } = req.params;
		const filePath = path.join(process.cwd(), "uploads", filename);

		// 检查文件是否存在
		await fs.access(filePath);

		res.download(filePath);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "文件不存在或下载失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(404).json(response);
	}
};
