const schedule = require('node-schedule');

// 使用 cron 表达式来定义定时任务
const job = schedule.scheduleJob('1 10 19 * *', function () {
    console.log('每个月1号的0点0分触发的定时任务已执行！');
});


// 创建一个规则，表示在每个月的第一天的0点0分触发
const rule = new schedule.RecurrenceRule();
rule.date = 19; // 指定日期为每个月的第一天
rule.hour = 10; // 指定小时为0
rule.minute = 05; // 指定分钟为0
rule.second = 0;

async function create_maintain_alert() {
    logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**设备维护提醒**邮件发送`);

    const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'asset_maintain' }, fields: ['isOpen'] });
    if (res_control.isOpen) {
        const res_asset = await sequelize.query('call p_cur_month_need_maintain_asset()');
        // logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(res_asset))
        // 需要进行邮件提醒的维护责任人，以及对应的维护列表：
        let needSendMailPersonObj = {};
        let needSendMailMaintainDataList = [];
        // 循环判断，获取需要邮件提醒的维护列表：
        for (let item of res_asset) {
            let { assetName, assetId, period, maintainTime, applyPerson, applyPersonEmail,
                spec, ownOrgName, maintainContent
            } = item;
            if (
                // 1. 判断当前维护时间是否有效
                Date.parse(maintainTime) &&
                // 4. 判断邮箱是否有效
                isEmail(applyPersonEmail) &&
                send_email_config.user && send_email_config.pass
            ) {
                let dataItem = {
                    name: assetName, id: assetId, ownOrgName,
                    applyPerson, maintainContent, spec: spec,
                    expirationDate: dayjs(maintainTime).add(parseInt(period), 'day').format('YYYY-MM-DD'),
                }
                needSendMailPersonObj[applyPersonEmail] = 1;
                needSendMailMaintainDataList.push(dataItem)
            }
        };
        // logServive.log_autoTask(`邮件人数组`+JSON.stringify(needSendMailPersonObj));
        // logServive.log_autoTask(`邮件人信息数组`+JSON.stringify(needSendMailMaintainDataList));
        // console.log(needSendMailMaintainDataList)
        logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(needSendMailMaintainDataList[0]))
        // // 按照负责人发送邮件提醒：
        for (let each_email of Object.keys(needSendMailPersonObj)) {
            // logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送...`+each_email)
            await sendEmail(send_email_config, each_email, 'asset_maintain', needSendMailMaintainDataList)
        }
        logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
    }
}
// 创建定时任务
const job2 = schedule.scheduleJob(rule, function () {
    console.log('定时任务触发了！');
    create_maintain_alert().catch(err => {
        logServive.log_autoTask('create_maintain_alert err: ', err.message)
    })
});
