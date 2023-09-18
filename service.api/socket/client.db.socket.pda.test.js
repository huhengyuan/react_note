const dbClient = require("./client.db.socket.pda").dbClient;
async function query() {
    try {
        let res = await dbClient.Query("tenant_user");
        console.log(res);
    }
    catch (err) {
        console.log(err);

    }
}
async function MuliExuecteWithTrans() {
    let con = null;
    let isTrans = false;
    try {
        await dbClient.login("374sU6XXFM8210XEIDC480J3720300");
        con = await dbClient.getConnection();
        console.log("connect success.");
        await dbClient.beginTrans(con);
        console.log("begin trans success.");
        isTrans = true;
        await dbClient.UpdateWithCon(con, "tenant_user", { userId: "9" }, { remarks: "trans.update.9.8" });
        console.log("update 1 success");
        await dbClient.UpdateWithCon(con, "tenant_user", { userId: "10" }, { remarks: "trans.update.10.8" });
        console.log("update 2 success.");
        await dbClient.commitTrans(con);
        dbClient.Close(con);

    }
    catch (err) {
        if (isTrans) {
            await dbClient.rollbackTrans(con);
        }
        dbClient.Close(con);
        console.log("error");
        console.log(err);
    }
}
async function login(sn) {
    try {
        let res = await dbClient.login(sn);
        console.log(res);
    }
    catch (err) {
        console.log(err.message);
    }
}
async function ping() {
    await dbClient.ping();
}
// query();
// MuliExuecteWithTrans();
// login("7");
login("364WLsGXFK2101XXIXX890H3616837");

/**
 * 登录 input sn output:{code:1,message:"success",data:{access_token:""}}
 */
/**
 * 其他操作 input:{signature:"",access_token:"",sn:"",data:{}}
 */
// const login = { sn: sn }
// ping();