const token_service = require('../services/auth/token_service')

// token验证中间件
const tokenValidate = async (ctx, next) => {
    const { url, method, body, query } = ctx.request;
    let tenantId = method === "POST" ? body.tenantId : query.tenantId;
    let userId = method === "POST" ? body.userId : query.userId;

    if (url.indexOf('/file') !== -1) {
        return await next()
    }

    if (!tenantId || !userId) throw new Error("reqBody err: tenantId or userId cannot be empty!")

    if (url.indexOf('/v1.0') !== -1 && url !== '/v1.0/login') {
        const token = ctx.headers["access_token"]
        // 2.验证token：
        const res_token = await token_service.token_verify(tenantId + userId, token);
        // console.log(res_token)
        if (res_token.code != 1) throw new Error(res_token.message)
    }
    await next()
}

module.exports = { tokenValidate };