const Joi = require('Joi');
const dayjs = require('dayjs');
const { socket_client_config } = require('../config/config.js')
const { sequelize } = require('../services/mysql/connect');
const { QueryTypes } = sequelize;

/**
 * 获取指定时间范围内的盘点明细数据：
 * method: "POST"
 * url:    "/v1.0/pandian",
 * body: 
 {
    "tenantId": "hgtech",
    "userId": "admin",
    "tableName": "p_pandian_detail", // 指定存储过程名称
    "operateType": "proc", // 固定为proc
    "query": {
        "tenantId": "hgtech",
        "startTime": "2021-12-01 00:00:00",
        "endTime": "2021-12-01"
    }
}
 */
const getPandianDetail = async (ctx, next) => {
    try {
        // 1. 先验证请求参数：
        validateRequestBody(ctx.request.body);
        // 2. 再执行操作
        const { tenantId, operateType, tableName, query: { startTime, endTime } } = ctx.request.body;

        let result = await sequelize.query(`call ${tableName}(?,?,?)`,
            {
                replacements: [tenantId, startTime, endTime],
                type: QueryTypes.SELECT,
            }
        )

        result = JSON.parse(JSON.stringify(Object.values(result[0])));
        result = result.map(e => {
            e.pdTime = dayjs(e.pdTime).format('YYYY-MM-DD hh:mm:ss')
            return e;
        })

        ctx.body = { code: 1, message: '获取盘点明细成功', data: result }
    } catch (error) {
        ctx.body = { code: -1, message: '获取盘点明细失败，error：' + error.message }
    }
    await next()
}

function validateRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        tableName: Joi.string().required(),
        operateType: Joi.string().valid('proc').required(),
        query: Joi.object({
            tenantId: Joi.ref("tenantId", { ancestor: 2 }),
            startTime: Joi.string().required(),
            endTime: Joi.string().required(),
        }).unknown().required()
    }).required();
    const { error } = schema.validate(reqBody)
    if (error) throw Error(error.message)
}

/*******************************************************************************************
 * 开启系统下发主动盘点指令：
 * openPandian
 */
const openPandian = async (ctx,next)=>{
    try {
        // 1. 先验证请求参数：
        validateOpenPandianReauestBody(ctx.request.body);
        // 2. 再执行操作
        createNetSocketCientAndSendMsg(socket_client_config)

        ctx.body = { code: 1, message: '盘点指令下发成功',}
    } catch (error) {
        ctx.body = { code: -1, message: '盘点指令下发失败，error：' + error.message }
    }
    await next()
}

function validateOpenPandianReauestBody(reqBody){
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        command: Joi.string().required().valid("pandian"),
    })
    const {error} = schema.validate(reqBody);
    if(error) throw Error(error.message)
}   



function createNetSocketCientAndSendMsg(client_config) {
    const net = require("net");
    const client = net.connect(client_config, () => { console.log('连接服务器成功...') });
    client.on("connect", () => {
        console.log('connect success...')
        client.write('5a9400010095ca', "hex");
        client.end('客户端，发送断开连接请求')
    })
    client.on('error', err => {
        console.log('err: ', err)
    })
    client.on('close', () => {
        console.log('client close...')
    })
}

module.exports = {
    "POST /v1.0/pandian": getPandianDetail,
    "POST /v1.0/pandian/open": openPandian,
}