import { Request, Response } from "express";
import { pool } from "../config/database";
import { ApiResponse, Product, PaginatedResponse } from "../types";

// 获取所有产品
export const getProducts = async (req: Request, res: Response) => {
	try {
		const { page = 1, limit = 10, category_id } = req.query;
		const offset = (Number(page) - 1) * Number(limit);

		let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
		let countQuery = "SELECT COUNT(*) as total FROM products p";
		const params: any[] = [];

		if (category_id) {
			query += " WHERE p.category_id = ?";
			countQuery += " WHERE p.category_id = ?";
			params.push(category_id);
		}

		query += ` ORDER BY p.created_at DESC LIMIT ${Number(limit)} OFFSET ${offset}`;

		// 获取总数
		const [countResult] = await pool.execute(countQuery, category_id ? [category_id] : []);
		const total = (countResult as any)[0].total;

		// 获取产品列表
		const [rows] = await pool.execute(query);

		const response: ApiResponse<PaginatedResponse<Product>> = {
			success: true,
			message: "获取产品列表成功",
			data: {
				data: rows as Product[],
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
			message: "获取产品列表失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 根据ID获取产品
export const getProductById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const [rows] = await pool.execute(
			`SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
			[id]
		);

		const products = rows as Product[];

		if (products.length === 0) {
			const response: ApiResponse = {
				success: false,
				message: "产品不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse<Product> = {
			success: true,
			message: "获取产品信息成功",
			data: products[0]
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "获取产品信息失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 创建产品
export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, description, price, stock, category_id } = req.body;

		if (!name || !price || !stock || !category_id) {
			const response: ApiResponse = {
				success: false,
				message: "产品名称、价格、库存和分类ID不能为空"
			};
			return res.status(400).json(response);
		}

		const [result] = await pool.execute("INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)", [name, description, price, stock, category_id]);

		const insertResult = result as any;

		const response: ApiResponse = {
			success: true,
			message: "产品创建成功",
			data: {
				id: insertResult.insertId,
				name,
				description,
				price,
				stock,
				category_id
			}
		};

		res.status(201).json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "产品创建失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 更新产品
export const updateProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name, description, price, stock, category_id } = req.body;

		const [result] = await pool.execute("UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, updated_at = NOW() WHERE id = ?", [name, description, price, stock, category_id, id]);

		const updateResult = result as any;

		if (updateResult.affectedRows === 0) {
			const response: ApiResponse = {
				success: false,
				message: "产品不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse = {
			success: true,
			message: "产品更新成功"
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "产品更新失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};

// 删除产品
export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);

		const deleteResult = result as any;

		if (deleteResult.affectedRows === 0) {
			const response: ApiResponse = {
				success: false,
				message: "产品不存在"
			};
			return res.status(404).json(response);
		}

		const response: ApiResponse = {
			success: true,
			message: "产品删除成功"
		};

		res.json(response);
	} catch (error) {
		const response: ApiResponse = {
			success: false,
			message: "产品删除失败",
			error: error instanceof Error ? error.message : "未知错误"
		};

		res.status(500).json(response);
	}
};
