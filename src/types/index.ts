// 用户接口类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

// 产品接口类型定义
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category_id: number;
  created_at: Date;
  updated_at: Date;
}

// 分类接口类型定义
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

// API响应类型定义
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 分页参数类型定义
export interface PaginationParams {
  page: number;
  limit: number;
}

// 分页响应类型定义
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
