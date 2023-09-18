const soap = require('soap');
const logger = require("../log").logger;
const url_cmbc_product = "http://195.20.0.23:8188/CMBCGZUtil/services/CMBCGZUtilService?wsdl";

function get_client(url) {
    return new Promise((resolve, reject) => {
        soap.createClient(url, (err, client) => {
            if (err) {

                reject(err);
            }
            else {
                resolve(client);
            }
        })
    })
}

async function send_sms(mobile, message) {
    try {
        let client = await get_client(url_cmbc_product);
        let inputParam = { strPhone: mobile, strMessage: message };
        return new Promise((resolve, reject) => {
            client.SendSMS(inputParam, (err, res) => {
                if (err) {
                    reject(err);
                }
                if (!res.return) {
                    return resolve({ code: -2, message: "短信发送失败，服务返回false." });
                }
                return resolve({ code: 1, message: "短信发送成功" });
            })
        })
    }
    catch (err) {
        logger.error("发送短信:" + url_cmbc_product + "," + mobile);
        logger.error(err);
        return { code: -3, message: "发送短信异常," + err.message };
    }

}
async function send_email(toAddr, ccAddr, bccAddr, title, content) {
    try {
        let client = await get_client(url_cmbc_product);
        let inputParam = {
            strToAddr: toAddr,
            strCCAddr: ccAddr,
            strBCCAddr: bccAddr,
            strTitle: title,
            strBody: content
        }
        return new Promise((resolve, reject) => {
            client.SendMail(inputParam, (err, res) => {

                if (err) {
                    return resolve({ code: -1, message: "发送失败:" + err.message });
                }
                if (!res.return) {
                    return resolve({ code: -2, message: "邮件发送失败，服务返回false." });
                }
                return resolve({ code: 1, message: "邮件发送成功" });
            })
        })
    }
    catch (err) {
        logger.error("发送邮件:" + url_cmbc_product + "," + toAddr);
        logger.error(err);
        return { code: -3, message: "发送邮件异常," + err.message };
    }
}

module.exports.send_sms = send_sms;
module.exports.send_email = send_email;