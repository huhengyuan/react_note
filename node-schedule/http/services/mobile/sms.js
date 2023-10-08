var QcloudSms = require('qcloudsms_js');
var smsConfig = {
    /**
     * 该账号的发送频率限制为：
     * 1. 对同一个手机号，30秒内 发送短信条数不超过1条；
     * 2. 对同一个手机号，30秒内 发送短信条数不超过5条；1024
     * 3. 对同一个手机号，一个自然日内 发送短信条数不超过10条；1025
     */
    Qcloud: {
        appid: '1400066975',
        appkey: '7c7b1a9db1514c2bd0df58ab4b064653'
    }
};
var qcloudsms = QcloudSms(smsConfig.Qcloud.appid, smsConfig.Qcloud.appkey);
// 单发短信
var ssender = qcloudsms.SmsSingleSender();
// 群发短信
var msender = qcloudsms.SmsMultiSender();
// 设置发送的手机号码，单发为一个字符串，群发为一个数组；
var phoneNumbers = ['18138800593'];
// 短信指定签名模板： 设备预警=524532、短信验证=83018
var templateId = 83018;

// 定义发送之后的回调：
function smsCallBack(err, res, resData) {
    if (err) {
        console.log('err: ', err);
    } else {
        console.log('短信发送成功！');
        console.log('response data: ', resData);
    }
}

var params = [' 桐乡店的设备1100000103发生离线，请注意排查！'];

// 封装成外部可以直接使用的模块：
function sendMessage(phoneNumbers, params) {
    return new Promise((resolve, reject) => {
        if (phoneNumbers && params && phoneNumbers.length === 11) {
            const smsCallBack = (err, res, resData) => {
                if (err) {
                    reject('err: ', err);
                } else {
                    // console.log('短信发送成功！');
                    // console.log('response data: ', resData);
                    resolve(resData)
                }
            }
            ssender.sendWithParam(
                '86',
                phoneNumbers,
                templateId,
                params,
                '',
                '',
                '',
                smsCallBack
            );
        } else {
            const errmsg = 'sendMessage failed because of the invalid params of the function. '
            console.log(errmsg);
            reject({ message: errmsg })
        }
    })
}
module.exports = sendMessage;