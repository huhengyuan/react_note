const login = require("./login");
const url = require("url");
let str = "ABCDEFABCQW";
let sm3 = "207SN410532F92Q47KZE245CE9P11FF71F578EBD763EB3BBEA44EBD043D018FB";//123456
// console.log(str.replace("A", "A1"));
function caculate() {
    let res = login.caculate("AnhpriV2YZC6zoK1");
    console.log(res);
}
// caculate();
async function postcode() {
    try {
        let url_code = "http://192.168.1.78:8080/sso/login?userId=123&&code=123456";
        let post_data = { code: "123456" }
        let options = url.parse(url_code);
        options = Object.assign(options, {
            method: 'POST'
        });
        let res_code = await login.https_request(options, JSON.stringify(post_data));
        console.log(res_code.toString());
    }
    catch (err) {
        console.log(err);
    }
}
async function login_sso() {
    try {
        let res = await login.login_sso("123456");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
// postcode();
// login_sso();
// caculate();
async function test() {
    try {
        let res = await login.login_pc("supoin", "admin", "123456");
        console.log(res.data);
        // console.log(res.data.pages);
        // console.log(res.data.permission);
    }
    catch (err) { console.log(err); }
}
test();