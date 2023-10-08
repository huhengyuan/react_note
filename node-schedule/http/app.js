const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body')
const bodyParser = require('koa-bodyparser');
const staticServer = require('koa-static');
const cors = require('koa2-cors');
const { server_config: { port } } = require('./config/config.js');
const LogService = require('./services/logService/logService');
const { errorHandler, accessRecord } = require('./middlewares/response.js');
const { tokenValidate } = require('./middlewares/tokenValidate.js')
const controller = require('./controller');
const app = new Koa();
require('./services/autoTask/autoTask');

app.use(cors({ origin: "*" }));
app.use(staticServer(__dirname, 'public'));
app.use(koaBody({
    parsedMethods: ['POST', 'PUT', 'PATCH', 'GET', 'HEAD', 'DELETE'],
    multipart: true,
    jsonLimit: '10mb',
    formidable: {
        maxFileSize: 200 * 1024 * 1024  // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(bodyParser({ jsonLimit: '50mb', extendTypes: { json: ['application/x-javascript'] } }));

app.use(accessRecord)
app.use(errorHandler);

// app.use(tokenValidate);
app.use(controller('controllers'));
app.use(router.routes());

app.on('error', err => {
    LogService.log_error('server error', err)
    console.log('server error', err)
});

app.listen(port, () => {
    LogService.log_http(`[${new Date().toLocaleString()}] | iot_asset_hgtech的后台服务已启动，启动环境为：${process.env.NODE_ENV || "dev"}，端口号：${port}...`)
    console.log(`[${new Date().toLocaleString()}] | iot_asset_hgtech的后台服务已启动，启动环境为：${process.env.NODE_ENV || "dev"}，端口号：${port}...`)
})
