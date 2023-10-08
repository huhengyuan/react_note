const dayjs = require('dayjs');
const { sequelize } = require('../mysql/connect');
const { push_email_config: { maintain, measure }, send_email_config } = require('../../config/config');
const sendEmail = require('../email/sendMail');
const { isEmail } = require('../../utility/util');
const logServive = require('../logService/logService');
const dbOperate = require('../mysql/dbOperate');


/***********************************************************************************************
 * 计量物料计量提醒： 
 * 同设备计量
 */
 create_material_measure_alert(1)
async function create_material_measure_alert(alert_date) {
    logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 开启**物料计量提醒**邮件发送`);
    const res_control = await dbOperate.findOne({ tableName: 'tenant_email_control', query: { tenantId: 'hgtech', alertType: 'material_measure' }, fields: ['isOpen'] });
    if (res_control.isOpen) {
        const res_material = await sequelize.query(`call p_need_correct_material(${alert_date})`);
        console.log(res_material)
        logServive.log_autoTask('计量物料数据：' + JSON.stringify(res_material))
        // 需要进行邮件提醒的计量责任人/设备责任人的邮箱，以及对应的计量设备列表：
        let needSendMail_responsible = {};
        let needSendMail_applyPerson = {};
        let responsibleDataMap = new Map();
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
                if (!responsibleDataMap.has(responsibleEmail)) {
                    responsibleDataMap.set(responsibleEmail, []);
                }
        
                responsibleDataMap.get(responsibleEmail).push(dataItem);
                
                needSendMail_responsible[responsibleEmail]['dataArr'].push(dataItem);
                needSendMail_applyPerson[applyPersonEmail] = 1;
            }
        }
        for (const [responsibleEmail, dataArr] of responsibleDataMap) {
            await sendEmail(send_email_config, [responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'material_measure', dataArr);
        }
        // console.log('needSendMail_responsible', needSendMail_responsible)
        // logServive.log_autoTask('待发送的第一条邮件：' + JSON.stringify(Object.values(needSendMail_responsible)[0]))
        // // logServive.log_autoTask(needSendMail_applyPerson)
        // // 按照资产负责人发送邮件提醒（每发一封邮件，都得附带转发给所有的计量工程师）：
        // for (e of Object.values(needSendMail_responsible)) {
        //     await sendEmail(send_email_config, [e.responsibleEmail, ...Object.keys(needSendMail_applyPerson)], 'material_measure', e.dataArr);
        // }
        // logServive.log_autoTask(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] 邮件发送完成...`)
    }

}