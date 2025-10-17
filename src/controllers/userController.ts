import { Request, Response } from "express";
import { pool } from "../config/database";
import { ApiResponse, User, PaginationParams, PaginatedResponse } from "../types";

// 获取所有用户
export const getUsers = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const offset = (Number(page) - 1) * Number(limit);

		// 获取总数
		const [countResult] = await pool.execute("SELECT COUNT(*) as total FROM users");
		const total = (countResult as any)[0].total;

		// 获取用户列表
		const [rows] = await pool.execute(`SELECT * FROM users ORDER BY created_at DESC LIMIT ${Number(limit)} OFFSET ${offset}`);

		const response: ApiResponse<PaginatedResponse<User>> = {
			success: true,
			message: "获取用户列表成功",
			data: {
				data: rows as User[],
				pagination: {
					page: Number(page),
					limit: Number(limit),
					total,
					totalPages: Math.ceil(total / Number(limit))
				}
			}
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "获取用户列表失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 根据ID获取用户
export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);

		const users = rows as User[];

		if (users.length === 0) {
			const response: ApiResponse = {
				success: false,
				message: "用户不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse<User> = {
			success: true,
			message: "获取用户信息成功",
			data: users[0]
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "获取用户信息失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 创建用户
export const createUser = async (req: Request, res: Response) => {
	try {
		const { username, email } = req.body;

		if (!username || !email) {
			const response: ApiResponse = {
				success: false,
				message: "用户名和邮箱不能为空"
			};
			return res.status(400).json(response);
		}

		const [result] = await pool.execute("INSERT INTO users (username, email) VALUES (?, ?)", [username, email]);

		const insertResult = result as any;

		const response: ApiResponse = {
			success: true,
			message: "用户创建成功",
			data: {
				id: insertResult.insertId,
				username,
				email
			}
		};

		res.status(201).json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "用户创建失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 更新用户
export const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { username, email } = req.body;

		const [result] = await pool.execute("UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?", [username, email, id]);

		const updateResult = result as any;

		if (updateResult.affectedRows === 0) {
			const response: ApiResponse = {
				success: false,
				message: "用户不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse = {
			success: true,
			message: "用户更新成功"
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "用户更新失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 删除用户
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

		const deleteResult = result as any;

		if (deleteResult.affectedRows === 0) {
			const response: ApiResponse = {
				success: false,
				message: "用户不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse = {
			success: true,
			message: "用户删除成功"
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "用户删除失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};
