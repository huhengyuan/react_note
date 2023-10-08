const path = require('path');
const current_config = require(`./config.${process.env.NODE_ENV || "dev"}.json`);

module.exports = {
    // 是否开启控制台打印数据，测试时开启，项目部署的时候需要关掉：
    isOpenConsoleLog: current_config.isOpenConsoleLog || false,
    // 服务器配置：
    server_config: {
        port: current_config.server_config.port || 6001, //服务端口配置
    },
    db_config: {
        // host: '192.168.17.201',// 华工正源服务器地址
        // host: current_config.db_config.host || 'localhost',
        host: "47.94.5.22",
        port: 3306,
        dbbase: 'iot.asset.hgtech',
        user: 'supoin',
        "password": "SupoinSz@2021"
        // password: 'SupoinSz2020@',
    },
    // 指定上传文件存储根路径：
    upload_file_path: current_config.upload_file_path || path.resolve(__dirname, '../upload'),
    // 指定服务端主动连接socket客户端的配置（用来做下发盘点指令）
    socket_client_config: {
        // port: 6202,
        // host: "iot.supoin.com",
        port: current_config.socket_client_config.port || 6001,
        host: current_config.socket_client_config.host || "192.168.50.139"
    },
    // 发送邮件的配置：
    send_email_config: {
        // host: current_config.send_email_config.host,
        // port: current_config.send_email_config.port,
        // user: current_config.send_email_config.user,
        // pass: current_config.send_email_config.pass,
        "host": "smtp.qq.com",
        "port": 465,
        "user": "1992395918@qq.com",
        "pass": "jjzdbvveizulegfb"
    },
    // 邮件推送计划：
    push_email_config: {
        // 维护相关：
        maintain:{
            // 维护周期设定，查到超过这个范围的就不发送邮件提醒：
            period_span: {
                min: 1,
                max: 24,
            },
        },
        // 计量相关
        measure: {
            // 指定开始计算计量提醒的日期点："DD HH:mm:ss", 每个月的1号/25号计算计量提醒
            alert_date: ["01 00:00:00", "25 00:00:00"]
        }
    }
}