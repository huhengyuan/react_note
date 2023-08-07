
const sendEmail = require('./sendEmail')
const dayjs = require('dayjs');
async function test() {
    const send_email_config = {
        "host": "smtp.qq.com",
        "port": 465,
        "user": "1992395918@qq.com",
        "pass": "jjzdbvveizulegfb"
    }
    const receive_email = "hhydeyx@gmail.com"
    const topic = "asset_maintain"
    const dataArr = []
    let dataItem = {
        name: "XXXX打印机", id: "GRP_10101001", ownOrgName:"Tom",
        applyPerson:"Jerry", maintainContent:"AABBCCDDEEFFF", spec: "1台",
        expirationDate: "2023-7-31",
    }
    dataArr.push(dataItem)
    let res = await sendEmail(send_email_config, receive_email, topic, dataArr)
    console.log('res', res)
}

test()