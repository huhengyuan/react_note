const { executeSqlWithCon } = require("../db/db.mysql");

const dbClient = require("./client.db.socket.pc").dbClient;
async function query() {
    try {
        await dbClient.login('supoin', "admin1", "123456");
        let res = await dbClient.Query("tenant_asset"
            , { tenantId: "supoin" }
            , { assetId: 1, useEmployeeId: 1 }, null, null, { useEmployeeId: 1, placeId: 1 });
        console.log(res)
    }
    catch (err) {
        console.log(err);
    }
}
async function login(sn) {
    try {
        let res = await dbClient.login('CMBC_GZ', "admin", "123456");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
async function update() {
    try {
        await dbClient.login("cmbc", "cmbc_admin", "123456");
        let res = await dbClient.Update("stock_out_detail", { roomId: undefined }, { status: 2 });
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
async function ExecuteTrans() {
    try {
        await dbClient.login('CMBC_GZ', "admin", "123456");
        const transActions = async (con) => {
            await dbClient.UpdateWithCon(con, "tenant_user", { userId: "9" }, { remarks: "trans.update.722" });
            console.log("update 1 success");
            await dbClient.UpdateWithCon(con, "tenant_user2", { userId: "10" }, { remarks: "trans.update.723" });
            console.log("update 2 success.");
            return { code: 1, message: "success" };
        }
        return dbClient.ExecuteTrans(transActions)
    }
    catch (err) {
        console.log(err);
    }

}


const body = {
    tenantId: "cmbc",
    billNo: "xzrk20201023123421",
    roomId: "120",
    userId: "cmbc_admin",
    userName: "CMBC管理员",
    archiveList: [
        {
            tenantId: "cmbc",
            billNo: "xzrk20201023123421",
            archiveNo: "A00001",
            epc: "EEEE000011112220",
            archiveDepartment: 2,
            archiveType: 1,
            archiveStatus: 1,
            roomId: 1002,
            accountBank: 1,
            accountOrgName: "东北支行",
            accountStatus: 1,
            openDate: "2020-07-15 00:00:00",
            destructDate: "2020-07-15 00:00:00",
            customerNo: "",
            customerName: "",
            stockInDate: "2020-07-15 00:00:00",
        },
    ],
};
// 提交入库单据
async function submitBill(body) {
    try {
        await dbClient.login('cmbc', "cmbc_admin", "123456");
        const {
            tenantId,
            department,
            billNo,
            roomId,
            userId,
            userName,
            archiveList,
        } = body;

        const transActions = async (con) => {
            const now = new Date(Date.now());
            const STATUS = 0;
            const stock_add_in_data = {
                tenantId,
                billNo,
                roomId,
                userNo: userId,
                status: STATUS,
                billType: 0, // 新增入库
                department,
                inDate: now,
                userName,
            };
            await dbClient.InsertManyWithCon(con, "stock_add_in_detail", archiveList);
            await dbClient.InsertWithCon(con, "stock_add_ins", stock_add_in_data);
            return {
                code: 1,
                message: "提交成功",
            };
        };

        return await dbClient.ExecuteTrans(transActions);
    }
    catch (err) {
        console.log(err);
    }
};

async function login_sso() {
    try {
        let res = await dbClient.login_sso("123456");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}

async function queryWithCon() {
    await dbClient.login('cmbc', "cmbc_admin", "123456");
    const transAction = async (con) => {
        let res = await dbClient.QueryWithCon(con, "stock_in", { tenantId: "CMBC_GZ" })
        console.log(res)
    }
    let res = await dbClient.ExecuteTrans(transAction);
}

async function test_executeSqlWithCon() {
    let res = await executeSqlWithCon(null, "select * from tenant_user where tenantId=?", ["CMBC_GZ"]);
    console.log(res)
}

async function test_queryPageLimit() {
    await dbClient.login("cmbc", "cmbc_admin", "123456");
    try {
        let res = await dbClient.Query("base_archive", { tenantId: "CMBC_GZ" }, null, 9, 10)
        console.log(res.data)
    } catch (error) {
        console.log(error)
    }

}
async function sendSms() {
    try {
        await dbClient.login("cmbc", "cmbc_admin", "123456");
        let res = await dbClient.SendSms("1000", "hi");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
async function sendEmail() {
    try {
        await dbClient.login("cmbc", "cmbc_admin", "123456");
        let res = await dbClient.SendEmail("a@supoin.com", "", "test", "this is a test email.");
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
async function test() {
    try {
        let res = "";
        // res = await dbClient.executeProc("p_org_getChilds", { tenantId: "uniontech", orgId: "TC001" });
        res = await dbClient.Query("tenant_asset", null, {assetId:1,assetName:1}, 1, 1, null);
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}

// login_sso();
// query();
// ExecuteTrans();
// update();
// executeTrans();
// submitBill(body)
// login();
// queryWithCon()
// test_executeSqlWithCon()
// test_queryPageLimit()
// sendSms();
// sendEmail();
// console.log(dbClient.uuid());
// console.log(dbClient.uuid());
// console.log(dbClient.uuid());
test();
