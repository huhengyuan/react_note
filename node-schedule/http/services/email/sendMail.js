const nodemailer = require('nodemailer');
/**
 * 
 * @param {*} send_email_config 发送方邮箱配置
 * @param {*} receive_email 接收方邮箱，可以有多个，用数组[]
 * @param {*} topic 主题
 * @param {*} html 
 * @returns 
 */
async function sendEmail(send_email_config, receive_email, topic, dataArr) {
    try {
        let transporter = nodemailer.createTransport({
            host: send_email_config.host,
            port: send_email_config.port,
            secure: true, // 不加密25 加密994
            auth: {
                user: send_email_config.user, // generated ethereal user
                pass: send_email_config.pass // generated ethereal password
            }
        });
        let subject = createSubject(topic)
        let html = createHtml(topic, dataArr)
        // setup email data with unicode symbols
        let mailOptions = {
            from: send_email_config.user, // sender address
            to: receive_email, // list of receivers
            subject: subject, // Subject line
            html: html // plain html body
        };
        // send mail with defined transport object
        let res = await transporter.sendMail(mailOptions)
        // console.log("success")
        return { code: 1, message: '邮件发送成功.' }
    } catch (error) {
        console.log('邮件发送失败：' + error)
        console.log(error)
        return { code: -1, message: '邮件发送失败：' + error.message }
    }

}
module.exports = sendEmail;

function createSubject(topic) {
    const subject_obj = {
        asset_maintain: '设备维护提醒',
        asset_measure: '设备计量校准提醒',
        material_measure: '计量物料校准提醒',
    }
    return subject_obj[topic];
}

function createHtml(topic, dataArr) {
    const headerObj = {
        asset_maintain: ['资产名称', '资产编号', '资产部门', '维护责任人', '维护内容', '规格型号', '下次维护时间'],
        asset_measure: ['资产名称', '资产编号', '计量类型', '资产部门', '资产责任人', '出厂编号', '规格型号', '下次校正日期'],
        material_measure: ['资产名称', '资产编号', '计量类型', '资产部门', '资产责任人', '出厂编号', '规格型号', '下次校正日期'],
    }
    const titleObj = {
        asset_maintain: '到期维护通知单',
        asset_measure: '到期校准资产通知单',
        material_measure: '到期校准物料通知单',
    };
    const contentObj = {
        asset_maintain: `您好！以下是即将到期的设备清单，请尽快确认维护内容并按时实施维护。`,
        asset_measure: `您好！以下是本部门即将到期的设备清单，请尽快确认好使用地方并协调校准的时间，配合计量工程师及时校准。`,
        material_measure: `您好，以下是本部门即将到期的设备清单，请尽快确认好使用地方并协调校准的时间，配合计量工程师及时校准。`,
    };
    let html = `
     <p>${topic === 'asset_maintain' ? '维护工程师: ' : dataArr[0].ownOrgName + "的设备管理员："}</p>
     <p style="text-indent: 30px">${contentObj[topic]}</p>
     <p style="text-indent: 30px">谢谢！</p>
     <h3 style="text-indent: 150px">${titleObj[topic]}</h3>
     <table border="2" cellpadding="5" style="border-collapse: collapse;">
        <tr> 
            ${headerObj[topic].map(item => `<th>${item}</th>`).reduce((pre, cur) => (pre + cur), '')}
        </tr>
        ${dataArr.map(item => `
          <tr>
             ${Object.values(item).map(e => `<td>${e}</td>`).reduce((pre, cur) => (pre + cur), '')}
          </tr>`).reduce((pre, cur) => (pre + cur), '')
        }
    </table>
    <p><strong>该邮件为系统自动提醒邮件，请勿回复！</strong></p>
    `
    return html;
}


// 测试：
// sendEmail(
//     {
//         user: '2574650379@qq.com',
//         pass: 'ilgdrlwvzxaadjcg'
//     },
//     "huang_hongfa@126.com",
//     "资产异常报警提醒-[报警类型]-[资产编号/资产名称]",
//     "您好，【资产编号/资产名称/使用部门/所在位置】产生报警记录，报警设备：【设备编号/IP/MAC/EPC】"
// );