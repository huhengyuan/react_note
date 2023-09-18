const cmbcService = require("./soap.cmbc");
// let args = { strPhone: "17620920211", strMessage: "001-你好，这是一个测试短信" };
// let args_email = {
//     strToAddr: "zhuchenjie@cmbc.com.cn",
//     strCCAddr: "zhuchenjie@cmbc.com.cn",
//     strBCCAddr: "zhuchenjie@cmbc.com.cn",
//     strTitle: "档案管理系统测试邮件-002",
//     strBody: "002-你好，这是一个测试邮件"
// }
// soap.createClient(url, function (err, client) {
//     // console.log(JSON.stringify(client.describe()));
//     // client.SendSMS(args, (err, res) => {
//     //     if (err) {
//     //         console.log(err);
//     //     }
//     //     console.log(res);
//     // });
//     client.SendMail(args_email, (err, res) => {
//         if (err) {
//             console.log(err);
//         }
//         console.log(res);
//     })
// });
async function sendSMS() {
  let res = await cmbcService.send_sms("17603008504", "002-档案管理系统提醒测试,这是第二条测试短信.");
  console.log(res);
}
async function sendEmail() {
  let res = await cmbcService.send_email(
    "291856618@qq.com",
    "",
    "",
    "003-档案管理系统提醒测试",
    "003-档案管理系统提醒测试,这是第三封测试邮件."
  );
  console.log(res);
}
sendSMS();
sendEmail();
