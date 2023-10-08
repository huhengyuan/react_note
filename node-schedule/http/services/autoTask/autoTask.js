const dayjs = require('dayjs');
const { sequelize } = require('../mysql/connect');
const { push_email_config: { maintain, measure }, send_email_config } = require('../../config/config');
const sendEmail = require('../email/sendMail');
const { isEmail } = require('../../utility/util');
const logServive = require('../logService/logService');
const dbOperate = require('../mysql/dbOperate');

const schedule = require('node-schedule');



/***********************************************************************************************
 * 设备维护提醒：
 * 当月1号发送当月需要维护的资产清单给维护责任人。
 * 注意：周期为天
 */
logServive.log_autoTask('已启动邮件提醒的定时器服务...')
// create_maintain_alert()
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

/***********************************************************************************************
 * 设备计量提醒：按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
 * @alert_date 到期提醒的指定日期：1号、25号
 * 当月1号发送当月到期邮件提醒，
 * 当月25号发送下个月到期邮件提醒：
 * 注意：周期为月
 */
// create_measure_alert(25)
async function create_measure_alert(alert_date) {
    logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**设备计量提醒**邮件发送`);

    const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'asset_measure' }, fields: ['isOpen'] });
    if (res_control.isOpen) {
        const res_asset = await sequelize.query(`call p_need_correct_asset(${alert_date})`);
        // 需要进行邮件提醒的计量责任人/设备责任人的邮箱，以及对应的计量设备列表：
        let needSendMail_responsible = {};
        let needSendMail_applyPerson = {};
        // 循环判断，获取需要邮件提醒的计量设备列表：
        for (item of res_asset) {
            const { assetName, assetId, measureType, outFactoryNo, spec, period, correctTime, applyPerson,
                responsible, applyPersonEmail, responsibleEmail, ownOrgName
            } = item;
            if (
                // 1. 判断当前校准时间是否有效
                Date.parse(correctTime) &&
                // 4. 判断邮箱是否有效
                isEmail(applyPersonEmail) &&
                isEmail(responsibleEmail) &&
                send_email_config.user && send_email_config.pass
            ) {
                let dataItem = {
                    name: assetName,
                    id: assetId,
                    measureType,
                    ownOrgName,
                    responsible,
                    outFactoryNo,
                    spec,
                    expirationDate: dayjs(correctTime).add(parseInt(period), 'month').format('YYYY-MM-DD'),
                }
                if (!needSendMail_responsible[responsibleEmail]) {
                    needSendMail_responsible[responsibleEmail] = { responsibleEmail: responsibleEmail, dataArr: [] }
                }
                needSendMail_responsible[responsibleEmail]['dataArr'].push(dataItem);
                needSendMail_applyPerson[applyPersonEmail] = 1;
            }
        }
        logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(Object.values(needSendMail_responsible)[0]))
        // 按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
        for (e of Object.values(needSendMail_responsible)) {
            await sendEmail(send_email_config, [e.responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'asset_measure', e.dataArr);
        }
        logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
    }
}
/***********************************************************************************************
 * 计量物料计量提醒： 
 * 同设备计量
 */
//  create_material_measure_alert(25)
async function create_material_measure_alert(alert_date) {
    logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**物料计量提醒**邮件发送`);
    const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'material_measure' }, fields: ['isOpen'] });
    if (res_control.isOpen) {
        const res_material = await sequelize.query(`call p_need_correct_material(${alert_date})`);
        logServive.log_autoTask('计量物料数据：' + JSON.stringify(res_material))
        // 需要进行邮件提醒的计量责任人/设备责任人的邮箱，以及对应的计量设备列表：
        let needSendMail_responsible = {};
        let needSendMail_applyPerson = {};
        // 循环判断，获取需要邮件提醒的计量物料列表：
        for (item of res_material) {
            const { materialId, materialName, period, correctTime, applyPerson, responsible, ownOrgName, applyPersonEmail, responsibleEmail,
                measureType, spec
            } = item;

            if (
                // 1. 判断当前校准时间是否有效
                Date.parse(correctTime) &&
                // 4. 判断邮箱是否有效
                isEmail(applyPersonEmail) &&
                isEmail(responsibleEmail) &&
                send_email_config.user &&
                send_email_config.pass
            ) {
                let dataItem = {
                    name: materialName,
                    id: materialId,
                    measureType,
                    ownOrgName,
                    responsible,
                    outFactoryNo: '',
                    spec,
                    expirationDate: dayjs(correctTime).add(parseInt(period), 'month').format('YYYY-MM-DD'),
                }
                if (!needSendMail_responsible[applyPersonEmail]) {
                    needSendMail_responsible[responsibleEmail] = { responsibleEmail: responsibleEmail, dataArr: [] }
                }
                needSendMail_responsible[responsibleEmail]['dataArr'].push(dataItem);
                needSendMail_applyPerson[applyPersonEmail] = 1;
            }
        }
        logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(Object.values(needSendMail_responsible)[0]))
        // logServive.log_autoTask(needSendMail_applyPerson)
        // 按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
        for (e of Object.values(needSendMail_responsible)) {
            await sendEmail(send_email_config, [e.responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'material_measure', e.dataArr);
        }
        logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
    }

}

// 计量相关的定时器,每月1、15号的早上00点：
// setInterval(async () => {
//     if (dayjs().format("DD HH:mm:ss") === '13 17:13:00') {
//         await create_measure_alert(1).catch(err => {
//             logServive.log_autoTask('create_measure_alert err: ', err)
//         });
//         await create_material_measure_alert(1).catch(err => {
//             logServive.log_autoTask('create_material_measure_alert err: ', err)
//         });
//     }
//     if (dayjs().format("DD HH:mm:ss") === '15 00:00:00') {
//         await create_measure_alert(25).catch(err => {
//             logServive.log_autoTask('create_measure_alert err: ', err)
//         });
//         await create_material_measure_alert(25).catch(err => {
//             logServive.log_autoTask('create_material_measure_alert err: ', err)
//         });
//     }
// }, 1000)

// 设备维护邮件提醒定时器，只要判断当前时间为每月1号的早上9点即可：
// 创建一个规则，表示在每个月的第一天的0点0分触发
const maintain_rule = new schedule.RecurrenceRule();
maintain_rule.date = 19; // 指定日期为每个月的第一天
maintain_rule.hour = 10; // 指定小时为0
maintain_rule.minute = 22; // 指定分钟为0
maintain_rule.second = 0;
// 创建定时任务
const maintain_job = schedule.scheduleJob(maintain_rule, async function () {
    logServive.log_autoTask('node-schedule: ' + " 触发定时任务-设备维护！")
    await create_maintain_alert().catch(err => {
        logServive.log_autoTask('create_maintain_alert err: ', err.message)
    })
});

const measure_rule1 = new schedule.RecurrenceRule();
measure_rule1.date = 1; // 指定日期为每个月的第一天
measure_rule1.hour = 0; // 指定小时为0
measure_rule1.minute = 0; // 指定分钟为0
measure_rule1.second = 0;
// 创建定时任务
const measure_job1 = schedule.scheduleJob(measure_rule1, async function () {
    logServive.log_autoTask('node-schedule: ' + " 触发定时任务-计量提醒！")
    await create_measure_alert(1).catch(err => {
        logServive.log_autoTask('create_measure_alert err: ', err)
    });
    await create_material_measure_alert(1).catch(err => {
        logServive.log_autoTask('create_material_measure_alert err: ', err)
    });
});
const measure_rule15 = new schedule.RecurrenceRule();
measure_rule15.date = 15; // 指定日期为每个月的第一天
measure_rule15.hour = 0; // 指定小时为0
measure_rule15.minute = 0; // 指定分钟为0
measure_rule15.second = 0;
// 创建定时任务
const measure_job15 = schedule.scheduleJob(measure_rule15, async function () {
    logServive.log_autoTask('node-schedule: ' + " 触发定时任务-计量提醒！")
    await create_measure_alert(25).catch(err => {
        logServive.log_autoTask('create_measure_alert err: ', err)
    });
    await create_material_measure_alert(25).catch(err => {
        logServive.log_autoTask('create_material_measure_alert err: ', err)
    });
});
// setInterval(async () => {
//     if (dayjs().format('DD HH:mm:ss') === '01 09:00:00')
//         await create_maintain_alert().catch(err => {
//             logServive.log_autoTask('create_maintain_alert err: ', err.message)
//         })
// }, 1000)

// const dayjs = require('dayjs');
// const { sequelize } = require('../mysql/connect');
// const { push_email_config: { maintain, measure }, send_email_config } = require('../../config/config');
// const sendEmail = require('../email/sendMail');
// const { isEmail } = require('../../utility/util');
// const logServive = require('../logService/logService');
// const dbOperate = require('../mysql/dbOperate');

// /***********************************************************************************************
//  * 设备维护提醒：
//  * 当月1号发送当月需要维护的资产清单给维护责任人。
//  * 注意：周期为天
//  */
// logServive.log_autoTask('已启动邮件提醒的定时器服务...')
// // create_maintain_alert()
// async function create_maintain_alert() {
//     logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**设备维护提醒**邮件发送`);

//     const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'asset_maintain' }, fields: ['isOpen'] });
//     if (res_control.isOpen) {
//         const res_asset = await sequelize.query('call p_cur_month_need_maintain_asset()');
//         console.log('res_asset', res_asset)
//         // 需要进行邮件提醒的维护责任人，以及对应的维护列表：
//         let needSendMailPersonObj = {};
//         let needSendMailMaintainDataList = [];
//         // 循环判断，获取需要邮件提醒的维护列表：
//         for (item of res_asset) {
//             const { assetName, assetId, period, maintainTime, applyPerson, applyPersonEmail,
//                 spec, ownOrgName, maintainContent
//             } = item;
//             if (
//                 // 1. 判断当前维护时间是否有效
//                 Date.parse(maintainTime) &&
//                 // 4. 判断邮箱是否有效
//                 isEmail(applyPersonEmail) &&
//                 send_email_config.user && send_email_config.pass
//             ) {
//                 let dataItem = {
//                     name: assetName, id: assetId, ownOrgName,
//                     applyPerson, maintainContent, spec: spec,
//                     expirationDate: dayjs(maintainTime).add(parseInt(period), 'day').format('YYYY-MM-DD'),
//                 }
//                 needSendMailPersonObj[applyPersonEmail] = 1;
//                 needSendMailMaintainDataList.push(dataItem)
//             }
//         };
//         console.log('needSendMailMaintainDataList', needSendMailMaintainDataList)
//         logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(needSendMailMaintainDataList[0]))
//         // // 按照负责人发送邮件提醒：
//         for (each_email of Object.keys(needSendMailPersonObj)) {
//             await sendEmail(send_email_config, each_email, 'asset_maintain', needSendMailMaintainDataList)
//         }
//         logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
//     }
// }

// /***********************************************************************************************
//  * 设备计量提醒：按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
//  * @alert_date 到期提醒的指定日期：1号、25号
//  * 当月1号发送当月到期邮件提醒，
//  * 当月25号发送下个月到期邮件提醒：
//  * 注意：周期为月
//  */
// // create_measure_alert(25)
// async function create_measure_alert(alert_date) {
//     logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**设备计量提醒**邮件发送`);

//     const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'asset_measure' }, fields: ['isOpen'] });
//     if (res_control.isOpen) {
//         const res_asset = await sequelize.query(`call p_need_correct_asset(${alert_date})`);
//         // console.log('res_asset', res_asset)
//         // 需要进行邮件提醒的计量责任人/设备责任人的邮箱，以及对应的计量设备列表：
//         let needSendMail_responsible = {};
//         let needSendMail_applyPerson = {};
//         // 循环判断，获取需要邮件提醒的计量设备列表：
//         for (item of res_asset) {
//             const { assetName, assetId, measureType, outFactoryNo, spec, period, correctTime, applyPerson,
//                 responsible, applyPersonEmail, responsibleEmail, ownOrgName
//             } = item;
//             // console.log('item', item)
//             if (
//                 // 1. 判断当前校准时间是否有效
//                 Date.parse(correctTime) &&
//                 // 4. 判断邮箱是否有效
//                 isEmail(applyPersonEmail) &&
//                 isEmail(responsibleEmail) &&
//                 send_email_config.user && send_email_config.pass
//             ) {
//                 let dataItem = {
//                     name: assetName,
//                     id: assetId,
//                     measureType,
//                     ownOrgName,
//                     responsible,
//                     outFactoryNo,
//                     spec,
//                     expirationDate: dayjs(correctTime).add(parseInt(period), 'month').format('YYYY-MM-DD'),
//                 }
//                 if (!needSendMail_responsible[responsibleEmail]) {
//                     needSendMail_responsible[responsibleEmail] = { responsibleEmail: responsibleEmail, dataArr: [] }
//                 }
//                 needSendMail_responsible[responsibleEmail]['dataArr'].push(dataItem);
//                 needSendMail_applyPerson[applyPersonEmail] = 1;
//                 // console.log('dataItem', dataItem)
//             }
//         }
//         // console.log('资产责任人', needSendMail_responsible)
//         // console.log('计量工程师', needSendMail_applyPerson)
//         logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(Object.values(needSendMail_responsible)[0]))
//         // 按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
//         for (e of Object.values(needSendMail_responsible)) {
//             await sendEmail(send_email_config, [e.responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'asset_measure', e.dataArr);
//         }
//         logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
//     }
// }
// /***********************************************************************************************
//  * 计量物料计量提醒：
//  * 同设备计量
//  */
// //  create_material_measure_alert(25)
// async function create_material_measure_alert(alert_date) {
//     logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**物料计量提醒**邮件发送`);
//     const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'material_measure' }, fields: ['isOpen'] });
//     if (res_control.isOpen) {
//         const res_material = await sequelize.query(`call p_need_correct_material(${alert_date})`);
//         // 需要进行邮件提醒的计量责任人/设备责任人的邮箱，以及对应的计量设备列表：
//         let needSendMail_responsible = {};
//         let needSendMail_applyPerson = {};
//         // 循环判断，获取需要邮件提醒的计量物料列表：
//         logServive.log_autoTask('计量物料数据：' + JSON.stringify(res_material))
//         for (item of res_material) {
//             const { materialId, materialName, period, correctTime, applyPerson, responsible, ownOrgName, applyPersonEmail, responsibleEmail,
//                 measureType, spec
//             } = item;

//             if (
//                 // 1. 判断当前校准时间是否有效
//                 Date.parse(correctTime) &&
//                 // 4. 判断邮箱是否有效
//                 isEmail(applyPersonEmail) &&
//                 isEmail(responsibleEmail) &&
//                 send_email_config.user &&
//                 send_email_config.pass
//             ) {
//                 let dataItem = {
//                     name: materialName,
//                     id: materialId,
//                     measureType,
//                     ownOrgName,
//                     responsible,
//                     outFactoryNo: '',
//                     spec,
//                     expirationDate: dayjs(correctTime).add(parseInt(period), 'month').format('YYYY-MM-DD'),
//                 }
//                 if (!needSendMail_responsible[applyPersonEmail]) {
//                     needSendMail_responsible[responsibleEmail] = { responsibleEmail: responsibleEmail, dataArr: [] }
//                 }
//                 needSendMail_responsible[responsibleEmail]['dataArr'].push(dataItem);
//                 needSendMail_applyPerson[applyPersonEmail] = 1;
//             }
//         }
//         logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(Object.values(needSendMail_responsible)[0]))
//         // logServive.log_autoTask(needSendMail_applyPerson)
//         // 按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
//         for (e of Object.values(needSendMail_responsible)) {
//             await sendEmail(send_email_config, [e.responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'material_measure', e.dataArr);
//         }
//         logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
//     }

// }

// // 计量相关的定时器,每月1、25号的早上00点：
// setInterval(async () => {
//     if (dayjs().format("DD HH:mm:ss") === '13 17:08:00') {
//         await create_measure_alert(1).catch(err => {
//             logServive.log_autoTask('create_measure_alert err: ', err)
//         });
//         await create_material_measure_alert(1).catch(err => {
//             logServive.log_autoTask('create_material_measure_alert err: ', err)
//         });
//     }
//     if (dayjs().format("DD HH:mm:ss") === '11 14:06:00') {
//         await create_measure_alert(25).catch(err => {
//             logServive.log_autoTask('create_measure_alert err: ', err)
//         });
//         await create_material_measure_alert(25).catch(err => {
//             logServive.log_autoTask('create_material_measure_alert err: ', err)
//         });
//     }
// }, 1000)

// // 设备维护邮件提醒定时器，只要判断当前时间为每月1号的早上9点即可：
// setInterval(async () => {
//     if (dayjs().format('DD HH:mm:ss') === '11 13:58:00')
//         await create_maintain_alert().catch(err => {
//             logServive.log_autoTask('create_maintain_alert err: ', err.message)
//         })
// }, 1000)
