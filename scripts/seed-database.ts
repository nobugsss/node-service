import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  let connection;
  
  try {
    // 连接到数据库
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'node_service_db'
    });

    console.log('✅ 已连接到数据库');

    // 插入示例分类数据
    const categories = [
      { name: '电子产品', description: '各种电子设备和配件' },
      { name: '服装', description: '男装、女装、童装等' },
      { name: '家居用品', description: '家具、装饰品、生活用品' },
      { name: '图书', description: '各类图书和杂志' },
      { name: '运动用品', description: '体育器材和运动装备' }
    ];

    for (const category of categories) {
      await connection.execute(
        'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
    }
    console.log('✅ 分类数据插入成功');

    // 插入示例用户数据
    const users = [
      { username: 'admin', email: 'admin@example.com' },
      { username: 'user1', email: 'user1@example.com' },
      { username: 'user2', email: 'user2@example.com' },
      { username: 'test', email: 'test@example.com' }
    ];

    for (const user of users) {
      await connection.execute(
        'INSERT IGNORE INTO users (username, email) VALUES (?, ?)',
        [user.username, user.email]
      );
    }
    console.log('✅ 用户数据插入成功');

    // 插入示例产品数据
    const products = [
      { name: 'iPhone 15', description: '最新款苹果手机', price: 7999.00, stock: 50, category_id: 1 },
      { name: 'MacBook Pro', description: '专业级笔记本电脑', price: 12999.00, stock: 30, category_id: 1 },
      { name: 'Nike运动鞋', description: '舒适的运动鞋', price: 599.00, stock: 100, category_id: 5 },
      { name: '咖啡机', description: '全自动咖啡机', price: 1299.00, stock: 25, category_id: 3 },
      { name: '编程书籍', description: 'JavaScript高级编程', price: 89.00, stock: 200, category_id: 4 },
      { name: '羽绒服', description: '冬季保暖外套', price: 399.00, stock: 80, category_id: 2 },
      { name: '蓝牙耳机', description: '无线降噪耳机', price: 299.00, stock: 150, category_id: 1 },
      { name: '瑜伽垫', description: '防滑瑜伽垫', price: 199.00, stock: 60, category_id: 5 }
    ];

    for (const product of products) {
      await connection.execute(
        'INSERT IGNORE INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.stock, product.category_id]
      );
    }
    console.log('✅ 产品数据插入成功');

    console.log('🎉 数据库种子数据插入完成！');

  } catch (error) {
    console.error('❌ 数据插入失败:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('📝 数据库连接已关闭');
    }
  }
}

// 运行脚本
seedDatabase();
