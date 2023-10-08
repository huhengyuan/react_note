const dayjs = require('dayjs');
const { sequelize } = require('../services/mysql/connect.js');
const dbOperate = require('../services/mysql/dbOperate.js');

let month_manual_count = {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
};


/**
 * 手动核算统计报表数据接口：
 * @param {*} ctx 
 * @param {*} next 
 */
const handleManualStatistics = async (ctx, next) => {
    try {
        // 1.验证请求参数：
        validateReqBody(ctx.request.body)
        const { tenantId, userId } = ctx.request.body;
        // 2.验证该月份是否已经核算过一次，若核算过则禁止再次核算：
        const last_month = dayjs().month();
        month_manual_count[last_month] = 0;
        const this_month = dayjs().month() + 1;
        if (month_manual_count[this_month] === 1) {
            ctx.body = { code: 1, message: "该月份已手动核算过一次，无法再次核算" }
            return await next() 
        }
        // 3.进行核算：
        const res = await dbOperate.executeTransaction(async (transaction) => {
            // 3.1 先清除上个月已核算的数据：
            let res1 = await dbOperate.destroy(
                {
                    tableName: 'tenant_report_month_year_statistics',
                    query: { tenantId, year: String(dayjs().year()), month: String(dayjs().month()).padStart(2, '0') }
                },
                transaction
            )
            let res2 = await dbOperate.destroy(
                {
                    tableName: 'tenant_report_every_month_bill_data_cache',
                    query: { tenantId, year: String(dayjs().year()), month: String(dayjs().month()).padStart(2, '0') }
                },
                transaction
            )
            // 3.2 执行存储过程再次核算：
            let res3 = await sequelize.query(`call p_save_report_month_year_statistics()`, { transaction: transaction })

            let res4 = await sequelize.query(`call p_save_report_every_month_bill_data_cache()`, { transaction: transaction })
        })
        // 更新本月的手动核算次数为：1，下次接口命令过来就不做操作了。
        month_manual_count[this_month] = 1;

        ctx.body = { code: 1, message: "手动核算上个月的统计报表数据成功." }
    } catch (error) {
        console.log(error);

        ctx.body = { code: -1, message: `手动核算上个月的统计报表数据失败，error: ${error.message}` }
        await next()
    }
}
function validateReqBody(reqBody) {
    if (!reqBody.tenantId) throw new Error('tenantId不能为空.')
    if (!reqBody.userId) throw new Error('userId 不能为空.')
    if (reqBody.userId !== 'admin') throw new Error('必须admin账户才有操作权限.')
}

module.exports = {
    "POST /v1.0/manual/statistics": handleManualStatistics,
}