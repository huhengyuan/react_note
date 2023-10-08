const dayjs = require('dayjs');
const token_service = require('../services/auth/token_service')
const dbOperate = require('../services/mysql/dbOperate.js')

const handle_login = async (ctx, next) => {
    try {
        const reqBody = ctx.request.body
        // console.log(ctx.request.body)
        // 1.登录参数校验：
        await verify_request_body_params(reqBody);
        // 2.检查密码是否正确：
        const user_info = await verify_user(reqBody);
        // 3.获取token：
        const res_token = await token_service.token_sign(reqBody.tenantId + reqBody.userId);
        const token = res_token.data;

        ctx.response.body = { code: 1, message: "登录成功", data: { token, user_info } };
    } catch (error) {
        // console.log(error)
        ctx.response.body = { code: -1, message: "登录失败：" + error.message }
    }
    await next()
}

async function verify_request_body_params(reqBody) {
    const { tenantId, userId, password, } = reqBody
    if (!tenantId || !userId || !password) throw new Error("企业账户或用户名或密码不能为空.")
    return reqBody
}

async function verify_user(reqBody) {
    const { tenantId, userId, password } = reqBody
    const find_params = { tableName: 'v_user_list', query: { tenantId, userId } }
    const res_user_list = await dbOperate.findAll(find_params)
    
    if (!res_user_list || res_user_list.length < 1) throw new Error("用户未注册。")
    let user_info = res_user_list[0]

    if (user_info.password !== String(password)) throw new Error("密码错误。")
    // 用户存在，更新用户表状态：
    let res = await dbOperate.update({
        tableName: 'tenant_user',
        query: { tenantId, userId },
        dataContent: {
            latestLoginTime: dayjs(),
            loginCount: user_info.loginCount + 1
        }
    })
    return user_info
}

module.exports = {
    "POST /v1.0/login": handle_login
}