const logService = require('../services/logService/logService');
const dayjs = require('dayjs');

const accessRecord = async (ctx, next) => {
    const start_time = dayjs().format("YYYY-MM-DD HH:mm:ss")
    const start_stamp = Date.now()
    const request_method = ctx.request.method;
    const request_url = ctx.request.url;
    const request_body = ctx.request.body;

    await next();

    const response_body = ctx.body;
    const time_span = Date.now() - start_stamp + 'ms';
    const accessRecord = { start_time, request_method, request_url, request_body, response_body, time_span };
    logService.log_http(JSON.stringify(accessRecord));
}

const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        logService.log_error(error.message);
        ctx.body = {
            code: -1,
            message: error.message
        }
    }
}

module.exports = { accessRecord, errorHandler };