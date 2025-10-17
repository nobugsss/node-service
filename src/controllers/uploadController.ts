/*
 * @Author: boykaaa
 * @Date: 2025-10-17 10:32:49
 * @LastEditors: boykaaa
 * @LastEditTime: 2025-10-17 10:33:06
 * @description:
 * @param:
 * @return:
 */
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { ApiResponse } from "../types";

// 配置multer存储
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
	}
});

// 文件过滤器
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
	// 允许所有文件类型，但可以在这里添加限制
	cb(null, true);
};

export const upload = multer({
	storage: storage,
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760") // 10MB
	},
	fileFilter: fileFilter
});

// 单文件上传
export const uploadSingleFile = (req: Request, res: Response) => {
	try {
		if (!req.file) {
			const response: ApiResponse = {
				success: false,
				message: "没有上传文件"
			};
			return res.status(400).json(response);
		}

		const response: ApiResponse = {
			success: true,
			message: "文件上传成功",
			data: {
				filename: req.file.filename,
				originalName: req.file.originalname,
				size: req.file.size,
				mimetype: req.file.mimetype,
				path: req.file.path
			}
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "文件上传失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 多文件上传
export const uploadMultipleFiles = (req: Request, res: Response) => {
	try {
		if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
			const response: ApiResponse = {
				success: false,
				message: "没有上传文件"
			};
			return res.status(400).json(response);
		}

		const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

		const uploadedFiles = files.map((file) => ({
			filename: file.filename,
			originalName: file.originalname,
			size: file.size,
			mimetype: file.mimetype,
			path: file.path
		}));

		const response: ApiResponse = {
			success: true,
			message: `成功上传 ${uploadedFiles.length} 个文件`,
			data: uploadedFiles
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "文件上传失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};
