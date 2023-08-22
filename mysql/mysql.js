const mysql = require('mysql2');
const os = require('os');

// MySQL连接配置
const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'guns'
};

// 获取MySQL连接数
function getMysqlConnections() {
  const connection = mysql.createConnection(mysqlConfig);
  return connection.promise().query("SHOW STATUS LIKE 'Threads_connected';")
    .then(([rows, fields]) => {
      connection.end();
      return parseInt(rows[0]['Value']);
    })
    .catch(error => {
      console.error("Error:", error);
      return null;
    });
}

// 获取最近执行的查询的平均执行时间
function getAvgQueryTime() {
  const connection = mysql.createConnection(mysqlConfig);
  return connection.promise().query("SHOW GLOBAL STATUS LIKE 'Com_%';")
    .then(([rows, fields]) => {
      connection.end();
      const comStat = rows.reduce((acc, row) => {
        acc[row.Variable_name] = parseInt(row.Value);
        return acc;
      }, {});
      
      const totalQueries = comStat.Com_select + comStat.Com_insert + comStat.Com_update + comStat.Com_delete;
      const totalQueryTime = comStat.Com_select + comStat.Com_insert + comStat.Com_update + comStat.Com_delete;
      
      const avgQueryTime = totalQueryTime / totalQueries || 0;
      return avgQueryTime;
    })
    .catch(error => {
      console.error("Error:", error);
      return null;
    });
}

// 获取系统CPU和内存使用情况
function getSystemResources() {
  const cpuUsage = os.loadavg()[0];
  const memoryUsage = (1 - os.freemem() / os.totalmem()) * 100;
  return { cpuUsage, memoryUsage };
}

// 主程序
(async () => {
  const connections = await getMysqlConnections();
  const avgQueryTime = await getAvgQueryTime();
  const { cpuUsage, memoryUsage } = getSystemResources();

  console.log(`MySQL Connections: ${connections}`);
  console.log(`Avg Query Time: ${avgQueryTime} seconds`);
  console.log(`CPU Usage: ${cpuUsage}%`);
  console.log(`Memory Usage: ${memoryUsage}%`);
})();
