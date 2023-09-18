/*！
 * 发送电子邮件服务
 */
const cmbcService = require("../soap/soap.cmbc");
/**
 * 
 * @param {string} toAddr 目标地址
 * @param {string} ccAddress 抄送地址
 * @param {string} title 标题
 * @param {string} content 正文
 */
async function email_send_cmbc(toAddr, ccAddress, title, content) {
    return cmbcService.send_email(toAddr, ccAddress, "", title, content);
    // return { code: 1, message: "success" };
}
module.exports.email_send_cmbc = email_send_cmbc;