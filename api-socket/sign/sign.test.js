const utility = require("../utility");
const sign = require("./sign");
const key = "supoin.iot@sz209";
const iv = "iot.supoin#Sz802";
const salt = "supoin@ms.bank";
function testSign() {
    let body = JSON.stringify({ "sn": "86060606060606" });
    let res = utility.aes_encrypt(key, iv, body);
    console.log(res);
    let raw = res + salt + utility.getDateTime("YYYY-MM-dd");
    console.log(raw);
    let sin_temp = utility.md5(raw);
    console.log(sin_temp);
}
function verify(rawData, signature) {
    console.log(sign.verifySignature(rawData, signature));
}
// testSign();
    let body = JSON.stringify({ "sn": "86060606060606" });
verify({"sn":"86060606060606"},"86d7db909a6f5273ed34d7e38b480eba");
