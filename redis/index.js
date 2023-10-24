const Redis = require('ioredis');

// 创建 Redis 客户端
const redis = new Redis({
  port: 6379,          // Redis 服务器端口
  host: '127.0.0.1',   // Redis 服务器地址
  password: "root"
});

// 进行操作
redis.set('myKey', 'Hello World');
redis.get('myKey', (err, result) => {
  if (err) throw err;
  console.log(result); // 输出 'Hello World'
});

// 关闭连接
redis.quit();
