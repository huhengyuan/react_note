/**
 * 登录逻辑实现，包含 pc用户名密码登录 pda sn验证登录三种登录的实现
 */
const token = require("../token/token");
const dbClient = require("../db/db.mysql");
const tableEnum = require("../db/db.mysql").ta

/**
 * 用户验证登录
 * @param {*} userId 
 * @param {*} pwd 
 */
async function login_pc(tenantId, userId, pwd) {
    try {
        // console.log("login.pc",tenantId,userId,pwd);
        let res = await dbClient.Query("v_user", { tenantId: tenantId, userId: userId });
        if (res.results.length < 1) {
            throw new Error("用户不存在.");
        }
        let user = res.results[0];
        if (user.password != pwd) {
            throw new Error("用户不存在或密码错误.");
        }
        let res_token = await token.createToken(userId);
        if (res_token.code == 1) {
            let res_page = await dbClient.Query("tenant_page", { tenantId: tenantId });
            let pages = res_page.results;
            // let res_permission = await dbClient.Query("tenant_org_permission",
            //     { tenantId: tenantId }
            // );
            let res_permission = await dbClient.Query("v_user_permission",
                { tenantId: tenantId, userId: userId }
            );

            let permission = res_permission.results;


            return {
                code: 1, message: "success.",
                data: {
                    access_token: res_token.data
                    , user: user
                    , pages: pages
                    , permission: permission
                }
            };
        }
        return res_token;
    }
    catch (err) {

        return { code: -102, message: err.message, }
    }
}
/**
 * pda验证登录 验证sn存在即可
 * @param {*} sn 
 */
async function login_pda(sn) {
    try {

        // console.log("execute query.login_pda");
        let table_device = "tenant_device";
        let query = { deviceId: sn };
        console.log("login_pda", query);
        let res_device = await dbClient.Query(table_device, query);
        // console.log(res_device);
        if (res_device.results.length < 1) {
            return { code: -102, message: "该设备没有注册信息." };
        }
        let devciceObj = res_device.results[0];
        if (devciceObj.status != 1) {
            return { code: -103, message: "该设备没有启用，请修改设备状态." };
        }
        let res_token = await token.createToken(sn);
        if (res_token.code == 1) {
            return { code: 1, message: "success.", data: { access_token: res_token.data } };
        }
        return res_token;
    }
    catch (err) {
        return { code: -103, message: err.message };
    }

}
module.exports.login_pc = login_pc;
module.exports.login_pda = login_pda;