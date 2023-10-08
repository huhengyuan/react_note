const { Sequelize, DataTypes } = require('sequelize')
const { db_config } = require('../../config/config.js')

const sequelize = new Sequelize(db_config.dbbase, db_config.user, db_config.password, {
    dialect: 'mysql',    //数据库类型
    host: db_config.host,   //主机地址
    port: db_config.port,
    pool: {      //连接池设置
        max: 5,  //最大连接数
        idle: 30000,
        acquire: 60000
    },
    dialectOptions: {
        charset: 'utf8mb4',  //字符集
    },
    define: {   //模型设置
        freezeTableName: true,    //自定义表面，不设置会自动将表名转为复数形式
        timestamps: false    //自动生成更新时间、创建时间字段：updatedAt,createdAt
    },
    // 时区配置
    timezone: '+08:00',
    // 控制打印sql语句
    logging: false
})

module.exports = {
    sequelize,
    DataTypes
}