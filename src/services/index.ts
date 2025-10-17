import { UserModel, ProductModel, CategoryModel } from '../models';
import { User, Product, Category, PaginatedResponse } from '../types';
import { logger } from '../utils/logger';

export class UserService {
	static async getUsers(
		page: number = 1,
		limit: number = 10
	): Promise<PaginatedResponse<User>> {
		try {
			const { users, total } = await UserModel.findAll(page, limit);

			return {
				data: users,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			};
		} catch (error) {
			logger.error('获取用户列表失败:', error);
			throw new Error('获取用户列表失败');
		}
	}

	static async getUserById(id: number): Promise<User> {
		try {
			const user = await UserModel.findById(id);
			if (!user) {
				throw new Error('用户不存在');
			}
			return user;
		} catch (error) {
			logger.error(`获取用户 ${id} 失败:`, error);
			throw error;
		}
	}

	static async createUser(username: string, email: string): Promise<User> {
		try {
			// 检查邮箱是否已存在
			const existingUser = await UserModel.findByEmail(email);
			if (existingUser) {
				throw new Error('邮箱已存在');
			}

			const userId = await UserModel.create(username, email);
			const user = await UserModel.findById(userId);
			return user!;
		} catch (error) {
			logger.error('创建用户失败:', error);
			throw error;
		}
	}

	static async updateUser(
		id: number,
		username: string,
		email: string
	): Promise<User> {
		try {
			const success = await UserModel.update(id, username, email);
			if (!success) {
				throw new Error('用户不存在');
			}

			const user = await UserModel.findById(id);
			return user!;
		} catch (error) {
			logger.error(`更新用户 ${id} 失败:`, error);
			throw error;
		}
	}

	static async deleteUser(id: number): Promise<void> {
		try {
			const success = await UserModel.delete(id);
			if (!success) {
				throw new Error('用户不存在');
			}
		} catch (error) {
			logger.error(`删除用户 ${id} 失败:`, error);
			throw error;
		}
	}
}

export class ProductService {
	static async getProducts(
		page: number = 1,
		limit: number = 10,
		categoryId?: number
	): Promise<PaginatedResponse<Product>> {
		try {
			const { products, total } = await ProductModel.findAll(
				page,
				limit,
				categoryId
			);

			return {
				data: products,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			};
		} catch (error) {
			logger.error('获取产品列表失败:', error);
			throw new Error('获取产品列表失败');
		}
	}

	static async getProductById(id: number): Promise<Product> {
		try {
			const product = await ProductModel.findById(id);
			if (!product) {
				throw new Error('产品不存在');
			}
			return product;
		} catch (error) {
			logger.error(`获取产品 ${id} 失败:`, error);
			throw error;
		}
	}

	static async createProduct(
		name: string,
		description: string,
		price: number,
		stock: number,
		categoryId: number
	): Promise<Product> {
		try {
			// 验证分类是否存在
			const category = await CategoryModel.findById(categoryId);
			if (!category) {
				throw new Error('分类不存在');
			}

			const productId = await ProductModel.create(
				name,
				description,
				price,
				stock,
				categoryId
			);
			const product = await ProductModel.findById(productId);
			return product!;
		} catch (error) {
			logger.error('创建产品失败:', error);
			throw error;
		}
	}

	static async updateProduct(
		id: number,
		name: string,
		description: string,
		price: number,
		stock: number,
		categoryId: number
	): Promise<Product> {
		try {
			// 验证分类是否存在
			const category = await CategoryModel.findById(categoryId);
			if (!category) {
				throw new Error('分类不存在');
			}

			const success = await ProductModel.update(
				id,
				name,
				description,
				price,
				stock,
				categoryId
			);
			if (!success) {
				throw new Error('产品不存在');
			}

			const product = await ProductModel.findById(id);
			return product!;
		} catch (error) {
			logger.error(`更新产品 ${id} 失败:`, error);
			throw error;
		}
	}

	static async deleteProduct(id: number): Promise<void> {
		try {
			const success = await ProductModel.delete(id);
			if (!success) {
				throw new Error('产品不存在');
			}
		} catch (error) {
			logger.error(`删除产品 ${id} 失败:`, error);
			throw error;
		}
	}
}

export class CategoryService {
	static async getCategories(): Promise<Category[]> {
		try {
			return await CategoryModel.findAll();
		} catch (error) {
			logger.error('获取分类列表失败:', error);
			throw new Error('获取分类列表失败');
		}
	}

	static async getCategoryById(id: number): Promise<Category> {
		try {
			const category = await CategoryModel.findById(id);
			if (!category) {
				throw new Error('分类不存在');
			}
			return category;
		} catch (error) {
			logger.error(`获取分类 ${id} 失败:`, error);
			throw error;
		}
	}

	static async createCategory(
		name: string,
		description: string
	): Promise<Category> {
		try {
			const categoryId = await CategoryModel.create(name, description);
			const category = await CategoryModel.findById(categoryId);
			return category!;
		} catch (error) {
			logger.error('创建分类失败:', error);
			throw error;
		}
	}

	static async updateCategory(
		id: number,
		name: string,
		description: string
	): Promise<Category> {
		try {
			const success = await CategoryModel.update(id, name, description);
			if (!success) {
				throw new Error('分类不存在');
			}

			const category = await CategoryModel.findById(id);
			return category!;
		} catch (error) {
			logger.error(`更新分类 ${id} 失败:`, error);
			throw error;
		}
	}

	static async deleteCategory(id: number): Promise<void> {
		try {
			const success = await CategoryModel.delete(id);
			if (!success) {
				throw new Error('分类不存在');
			}
		} catch (error) {
			logger.error(`删除分类 ${id} 失败:`, error);
			throw error;
		}
	}
}
