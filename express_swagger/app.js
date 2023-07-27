// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
const os = require('os')
// write your code here...
// const swaggerUi = require('swagger-ui-express');
// const swaggerSpecs = require('./utils/swagger');


const swaggerInstall = require("./utils/swaggers");
swaggerInstall(app);
// 导入 cors 中间件
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())
// 通过 express.json() 这个中间件，解析表单中的 JSON 格式的数据
app.use(express.json())
app.use(express.urlencoded({ extended: false }))




// 导入并注册用户路由模块
const userRouter = require('./routes/user')
app.use('/api', userRouter)











// 添加Swagger UI界面和API文档路由
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
// 调用 app.listen 方法，指定端口号并启动web服务器
const port = 9752
// 启动服务器监听指定端口
app.listen(port, () => {
    console.log(`app is listen on ` + getIpAddress() + ':' + port)
});
process.on("uncaughtException", (err) => {
    console.log(err);
});



/**
 * 获取当前机器的ip地址
 */
function getIpAddress() {
    var ifaces = os.networkInterfaces()

    for (var key in ifaces) {
        if (key.indexOf('VMware') < 0) {
            let iface = ifaces[key]
            for (let i = 0; i < iface.length; i++) {
                let { family, address, internal } = iface[i]

                if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                    return address
                }
            }
        }
    }
}