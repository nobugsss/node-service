import Joi from 'joi';

// 用户验证规则
export const userValidation = {
	create: Joi.object({
		username: Joi.string().min(3).max(50).required().messages({
			'string.min': '用户名至少3个字符',
			'string.max': '用户名最多50个字符',
			'any.required': '用户名不能为空',
		}),
		email: Joi.string().email().required().messages({
			'string.email': '邮箱格式不正确',
			'any.required': '邮箱不能为空',
		}),
	}),

	update: Joi.object({
		username: Joi.string().min(3).max(50).messages({
			'string.min': '用户名至少3个字符',
			'string.max': '用户名最多50个字符',
		}),
		email: Joi.string().email().messages({
			'string.email': '邮箱格式不正确',
		}),
	})
		.min(1)
		.messages({
			'object.min': '至少提供一个要更新的字段',
		}),
};

// 产品验证规则
export const productValidation = {
	create: Joi.object({
		name: Joi.string().min(1).max(200).required().messages({
			'string.min': '产品名称不能为空',
			'string.max': '产品名称最多200个字符',
			'any.required': '产品名称不能为空',
		}),
		description: Joi.string().max(1000).messages({
			'string.max': '产品描述最多1000个字符',
		}),
		price: Joi.number().positive().required().messages({
			'number.positive': '价格必须大于0',
			'any.required': '价格不能为空',
		}),
		stock: Joi.number().integer().min(0).required().messages({
			'number.integer': '库存必须是整数',
			'number.min': '库存不能小于0',
			'any.required': '库存不能为空',
		}),
		category_id: Joi.number().integer().positive().required().messages({
			'number.integer': '分类ID必须是整数',
			'number.positive': '分类ID必须大于0',
			'any.required': '分类ID不能为空',
		}),
	}),

	update: Joi.object({
		name: Joi.string().min(1).max(200).messages({
			'string.min': '产品名称不能为空',
			'string.max': '产品名称最多200个字符',
		}),
		description: Joi.string().max(1000).messages({
			'string.max': '产品描述最多1000个字符',
		}),
		price: Joi.number().positive().messages({
			'number.positive': '价格必须大于0',
		}),
		stock: Joi.number().integer().min(0).messages({
			'number.integer': '库存必须是整数',
			'number.min': '库存不能小于0',
		}),
		category_id: Joi.number().integer().positive().messages({
			'number.integer': '分类ID必须是整数',
			'number.positive': '分类ID必须大于0',
		}),
	})
		.min(1)
		.messages({
			'object.min': '至少提供一个要更新的字段',
		}),
};

// 分类验证规则
export const categoryValidation = {
	create: Joi.object({
		name: Joi.string().min(1).max(100).required().messages({
			'string.min': '分类名称不能为空',
			'string.max': '分类名称最多100个字符',
			'any.required': '分类名称不能为空',
		}),
		description: Joi.string().max(500).messages({
			'string.max': '分类描述最多500个字符',
		}),
	}),

	update: Joi.object({
		name: Joi.string().min(1).max(100).messages({
			'string.min': '分类名称不能为空',
			'string.max': '分类名称最多100个字符',
		}),
		description: Joi.string().max(500).messages({
			'string.max': '分类描述最多500个字符',
		}),
	})
		.min(1)
		.messages({
			'object.min': '至少提供一个要更新的字段',
		}),
};

// 分页参数验证
export const paginationValidation = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	limit: Joi.number().integer().min(1).max(100).default(10),
});

// 验证中间件工厂函数
export const validate = (schema: Joi.ObjectSchema) => {
	return (req: any, res: any, next: any) => {
		const { error, value } = schema.validate(req.body);
		if (error) {
			return res.status(400).json({
				success: false,
				message: '请求参数验证失败',
				error: error.details[0].message,
			});
		}
		req.body = value;
		next();
	};
};

// 查询参数验证中间件
export const validateQuery = (schema: Joi.ObjectSchema) => {
	return (req: any, res: any, next: any) => {
		const { error, value } = schema.validate(req.query);
		if (error) {
			return res.status(400).json({
				success: false,
				message: '查询参数验证失败',
				error: error.details[0].message,
			});
		}
		req.query = value;
		next();
	};
};
