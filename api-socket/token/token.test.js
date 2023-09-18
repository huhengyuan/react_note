const token = require("./token");
async function signTest() {
    let res = await token.sign("admin");
    console.log(res);
}
async function signAndVerify() {
    let res = {};

    res = await token.sign("admin");
    let tokenId = res.data;
    res = await token.verify("admin", tokenId);
    console.log(res);
    // token.verify("admin1", tokenId, (res) => {
    //     console.log(res);
    // });
    // token.verify("admin", tokenId, (res) => {
    //     console.log(res);
    // });
    // setTimeout(() => {
    //     token.verify("admin", tokenId, (res) => {
    //         console.log(res);
    //     });
    // }, 2000)
    // setTimeout(() => {
    //     token.verify("admin", tokenId, (res) => {
    //         console.log(res);
    //     });
    // }, 4000)

    // setTimeout(() => {
    //     token.verify("admin", tokenId, (res) => {
    //         console.log(res);
    //     });
    // }, 8000)

}
//signTest();
signAndVerify();