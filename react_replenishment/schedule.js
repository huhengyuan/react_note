const schedule = require('node-schedule');

function scheduled() {
    // 创建定时任务，在每周一的0点（午夜）执行
    const job = schedule.scheduleJob('0 */1 * * * *', function () {
        // 在这里编写你的定时任务逻辑
        console.log('任务执行了！');
    });
}
scheduled()