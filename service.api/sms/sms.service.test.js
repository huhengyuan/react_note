const sms = require("./sms.service");
async function send_sms() {
    let res = await sms.sms_send_cmbc("18810172121", "你好，这是一个测试短信.");
    console.log(res);
}