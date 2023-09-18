const utility = require("./utility");
const key = "supoin.iot@sz209";
const iv = "iot.supoin#Sz802";
console.log(Buffer.alloc(16, iv, "utf-8").toString());
function encrypt() {
    let res = utility.aes_encrypt(
        key,
        iv,
        "123456");
    console.log(res);
}
function decrypt() {
    // let encodeData = utility.aes_encrypt(
    //     key,
    //     iv,
    //     "123456");
    // console.log(encodeData);
    let encodeData="MLR5wBOAE9bu1ZJGddtvULRbE0AaSVgcEnqmPAxvcOQ=";
    let res = utility.aes_decrypt(
        key,
        iv,
        encodeData);
    console.log(res);
}
// encrypt();
decrypt();
// console.log(Buffer.from("123456", "utf-8").toString("base64"));