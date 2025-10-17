import { Request, Response } from 'express';
import { UserService } from '../services';
import { ApiResponse } from '../types';
import {
	validate,
	validateQuery,
	userValidation,
	paginationValidation,
} from '../utils/validation';
import { logger } from '../utils/logger';

// 获取所有用户
export const getUsers = async (req: Request, res: Response) => {
	try {
		const page = parseInt(String(req.query.page)) || 1;
		const limit = parseInt(String(req.query.limit)) || 10;
		const result = await UserService.getUsers(page, limit);

		const response: ApiResponse = {
			success: true,
			message: '获取用户列表成功',
			data: result,
		};

		res.json(response);
	} catch (error) {
		logger.error('获取用户列表失败:', error);

		const response: ApiResponse = {
			success: false,
			message: error instanceof Error ? error.message : '获取用户列表失败',
		};

		res.status(500).json(response);
	}
};

// 根据ID获取用户
export const getUserById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await UserService.getUserById(Number(id));

		const response: ApiResponse = {
			success: true,
			message: '获取用户信息成功',
			data: user,
		};

		res.json(response);
	} catch (error) {
		logger.error(`获取用户 ${req.params.id} 失败:`, error);

		const response: ApiResponse = {
			success: false,
			message: error instanceof Error ? error.message : '获取用户信息失败',
		};

		const statusCode =
			error instanceof Error && error.message === '用户不存在' ? 404 : 500;
		res.status(statusCode).json(response);
	}
};

// 创建用户
export const createUser = async (req: Request, res: Response) => {
	try {
		const { username, email } = req.body;
		const user = await UserService.createUser(username, email);

		const response: ApiResponse = {
			success: true,
			message: '用户创建成功',
			data: user,
		};

		res.status(201).json(response);
	} catch (error) {
		logger.error('创建用户失败:', error);

		const response: ApiResponse = {
			success: false,
			message: error instanceof Error ? error.message : '用户创建失败',
		};

		const statusCode =
			error instanceof Error && error.message === '邮箱已存在' ? 409 : 500;
		res.status(statusCode).json(response);
	}
};

// 更新用户
export const updateUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { username, email } = req.body;
		const user = await UserService.updateUser(Number(id), username, email);

		const response: ApiResponse = {
			success: true,
			message: '用户更新成功',
			data: user,
		};

		res.json(response);
	} catch (error) {
		logger.error(`更新用户 ${req.params.id} 失败:`, error);

		const response: ApiResponse = {
			success: false,
			message: error instanceof Error ? error.message : '用户更新失败',
		};

		const statusCode =
			error instanceof Error && error.message === '用户不存在' ? 404 : 500;
		res.status(statusCode).json(response);
	}
};

// 删除用户
export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		await UserService.deleteUser(Number(id));

		const response: ApiResponse = {
			success: true,
			message: '用户删除成功',
		};

		res.json(response);
	} catch (error) {
		logger.error(`删除用户 ${req.params.id} 失败:`, error);

		const response: ApiResponse = {
			success: false,
			message: error instanceof Error ? error.message : '用户删除失败',
		};

		const statusCode =
			error instanceof Error && error.message === '用户不存在' ? 404 : 500;
		res.status(statusCode).json(response);
	}
};
