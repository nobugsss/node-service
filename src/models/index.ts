import { pool } from '../config/database';
import { User, Product, Category } from '../types';

export class UserModel {
	static async findAll(
		page: number = 1,
		limit: number = 10
	): Promise<{ users: User[]; total: number }> {
		const offset = (page - 1) * limit;

		const [countResult] = await pool.execute(
			'SELECT COUNT(*) as total FROM users'
		);
		const total = (countResult as any)[0].total;

		const [rows] = await pool.execute(
			'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
			[Math.floor(Number(limit)), Math.floor(Number(offset))]
		);

		return {
			users: rows as User[],
			total,
		};
	}

	static async findById(id: number): Promise<User | null> {
		const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
		const users = rows as User[];
		return users.length > 0 ? users[0] : null;
	}

	static async findByEmail(email: string): Promise<User | null> {
		const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
			email,
		]);
		const users = rows as User[];
		return users.length > 0 ? users[0] : null;
	}

	static async create(username: string, email: string): Promise<number> {
		const [result] = await pool.execute(
			'INSERT INTO users (username, email) VALUES (?, ?)',
			[username, email]
		);
		return (result as any).insertId;
	}

	static async update(
		id: number,
		username: string,
		email: string
	): Promise<boolean> {
		const [result] = await pool.execute(
			'UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?',
			[username, email, id]
		);
		return (result as any).affectedRows > 0;
	}

	static async delete(id: number): Promise<boolean> {
		const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
		return (result as any).affectedRows > 0;
	}
}

export class ProductModel {
	static async findAll(
		page: number = 1,
		limit: number = 10,
		categoryId?: number
	): Promise<{ products: Product[]; total: number }> {
		const offset = (page - 1) * limit;
		let whereClause = '';
		let params: any[] = [];

		if (categoryId) {
			whereClause = 'WHERE category_id = ?';
			params = [categoryId];
		}

		const [countResult] = await pool.execute(
			`SELECT COUNT(*) as total FROM products ${whereClause}`,
			params
		);
		const total = (countResult as any)[0].total;

		const [rows] = await pool.execute(
			`SELECT p.*, c.name as category_name FROM products p 
			 LEFT JOIN categories c ON p.category_id = c.id 
			 ${whereClause} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
			[...params, Math.floor(Number(limit)), Math.floor(Number(offset))]
		);

		return {
			products: rows as Product[],
			total,
		};
	}

	static async findById(id: number): Promise<Product | null> {
		const [rows] = await pool.execute(
			'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
			[id]
		);
		const products = rows as Product[];
		return products.length > 0 ? products[0] : null;
	}

	static async create(
		name: string,
		description: string,
		price: number,
		stock: number,
		categoryId: number
	): Promise<number> {
		const [result] = await pool.execute(
			'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
			[name, description, price, stock, categoryId]
		);
		return (result as any).insertId;
	}

	static async update(
		id: number,
		name: string,
		description: string,
		price: number,
		stock: number,
		categoryId: number
	): Promise<boolean> {
		const [result] = await pool.execute(
			'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ?, updated_at = NOW() WHERE id = ?',
			[name, description, price, stock, categoryId, id]
		);
		return (result as any).affectedRows > 0;
	}

	static async delete(id: number): Promise<boolean> {
		const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [
			id,
		]);
		return (result as any).affectedRows > 0;
	}
}

export class CategoryModel {
	static async findAll(): Promise<Category[]> {
		const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
		return rows as Category[];
	}

	static async findById(id: number): Promise<Category | null> {
		const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [
			id,
		]);
		const categories = rows as Category[];
		return categories.length > 0 ? categories[0] : null;
	}

	static async create(name: string, description: string): Promise<number> {
		const [result] = await pool.execute(
			'INSERT INTO categories (name, description) VALUES (?, ?)',
			[name, description]
		);
		return (result as any).insertId;
	}

	static async update(
		id: number,
		name: string,
		description: string
	): Promise<boolean> {
		const [result] = await pool.execute(
			'UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
			[name, description, id]
		);
		return (result as any).affectedRows > 0;
	}

	static async delete(id: number): Promise<boolean> {
		const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [
			id,
		]);
		return (result as any).affectedRows > 0;
	}
}
