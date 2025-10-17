-- 创建数据库
CREATE DATABASE IF NOT EXISTS node_service_db;
USE node_service_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 插入示例分类数据
INSERT IGNORE INTO categories (name, description) VALUES 
('电子产品', '各种电子设备和配件'),
('服装', '男装、女装、童装等'),
('家居用品', '家具、装饰品、生活用品'),
('图书', '各类图书和杂志'),
('运动用品', '体育器材和运动装备');

-- 插入示例用户数据
INSERT IGNORE INTO users (username, email) VALUES 
('admin', 'admin@example.com'),
('user1', 'user1@example.com'),
('user2', 'user2@example.com'),
('test', 'test@example.com');

-- 插入示例产品数据
INSERT IGNORE INTO products (name, description, price, stock, category_id) VALUES 
('iPhone 15', '最新款苹果手机', 7999.00, 50, 1),
('MacBook Pro', '专业级笔记本电脑', 12999.00, 30, 1),
('Nike运动鞋', '舒适的运动鞋', 599.00, 100, 5),
('咖啡机', '全自动咖啡机', 1299.00, 25, 3),
('编程书籍', 'JavaScript高级编程', 89.00, 200, 4),
('羽绒服', '冬季保暖外套', 399.00, 80, 2),
('蓝牙耳机', '无线降噪耳机', 299.00, 150, 1),
('瑜伽垫', '防滑瑜伽垫', 199.00, 60, 5);

-- 显示创建的表
SHOW TABLES;

-- 显示各表的数据统计
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'products' as table_name, COUNT(*) as record_count FROM products;
