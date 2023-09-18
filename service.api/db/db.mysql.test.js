const dbClient = require("./db.mysql");
const queryObj_param = ["base_archive", { tenantId: "CMBC_GZ" }, null, 9, 10]
// const insertObj_param = ["tenant_user", {tenantId:"cmbc",userId:"admin1",orgId:"01", userName: "admin", password: "123456", createPerson: "jdx" }];
const updateObj_param = ["tenant_user", { userId: "admin1" }, { remarks: "update.test.2" }];
const deleteObj_param = ["tenant_user", { userId: "admin1" }];

const insertManyObj_param = ["sys_user", [{ userName: "001" }, { userName: "002" }]];

const querySql_param = ["select archiveNo,epc from base_archive where accountOrgName = ?", ["福民支行"]];
const insertSql_param = ["insert into ?? set ?", ["sys_user", { userName: "jdx", createTime: new Date() }]];
const updateSql_param = ["update ?? set userName=? where userId=?", ["sys_user", "admin", 1]];
const deleteSql_param = ["delete from ?? where userId=?", ["sys_user", 12]];

const batchObj_param = [
    [
        { operate: "update", tableName: "sys_user", query: { userId: 1 }, dataContent: { userName: "adminx" } },
        { operate: "update", tableName: "sys_user", query: { userId: 1 }, dataContent: { remarks: "batch.update" } },

    ], false
];
async function testExecute(func, params) {
    try {
        let res = await func.apply(this, params);
        if (res.results) {
            console.log(res.results);
        }
        else {
            console.log(res);
        }
    }
    catch (err) {
        console.log(err);
    }
}
async function dbMultiExecute() {
    let con_trans = null;
    let res = await dbClient.beginTrans()
        .then((con) => {
            con_trans = con;
            return dbClient.UpdateWithCon(con_trans, "tenant_user", { userId: 9 }, { remarks: "user.update.8.3" });
        })
        .then((res) => {
            return dbClient.UpdateWithCon(con_trans, "tenant_userx", { userId: 10 }, { remarks: "user.update.9.2" });
        })
        .then((res) => {
            return dbClient.commitTrans(con_trans);
        })
        .then(() => {
            con_trans.release();
            return "con release success.";
        })
        .catch((err) => {
            return dbClient.rollbackTrans(con_trans)
                .then(() => {
                    con_trans.release();
                    console.log("err and relese.");
                    return "error";
                });
        });
    console.log(res);
}
async function waitSecond(timeSpan) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log("time is already.");
            resolve()
        }, timeSpan)
    })
}
async function test(taskName, wait, num) {
    let sql = "call p_org_getChilds(?,?)";
    sql = "update tenant_code set codeStart=codeStart+10"
    let res = "";
    let con = await dbClient.getConnection();
    // console.log(con);
    // await dbClient.beginTrans(con);
    console.log(taskName + "-开启事务");
    let res_code = await dbClient.executeSqlWithCon(con, "select codeStart from tenant_code where 1=0 limit 1", null);
    console.log(taskName + "-查询完成", res_code);
    return;
    await waitSecond(wait * 1000);
    console.log(taskName + "-时间延迟完成");
    let codeMax = res_code.results[0].codeStart + num;
    res_code = await dbClient.executeSqlWithCon(con, "update tenant_code set codeStart=?", [codeMax]);
    console.log(taskName + "-更新完成", res_code);
    // dbClient.rollbackTrans(con);
    // console.log(taskName + "-事务回滚完成");
    res_code = await dbClient.executeSqlWithCon(con, "select codeStart from tenant_code limit 1", null);

    console.log(taskName + "-查询返回完成", res_code.results);
    await dbClient.commitTrans(con);
    console.log(taskName + "-提交事务完成");
    await dbClient.release(con);
    console.log(taskName + "-任务完成");
    // // let params = ["uniontech", "UTW005"];
    // //  res = await dbClient.executeProc("p_asset_get",
    // //     {
    // //         tenantId: "uniontech",
    // //         userId: "admin",
    // //         query: { status: 1 },
    // //         fields: { assetId: 1, assetName: 1 }
    // //     });
    // // console.log(res.results[0].length);

    // res = await dbClient.Query("tenant_asset_class",null, null, 1, 5, null);
    // console.log(res);
    // res = await dbClient.executeSql(sql, null);
    // console.log(res);

}


// testExecute(dbClient.Query, queryObj_param);

// testExecute(dbClient.Update, updateObj_param);
// testExecute(dbClient.Insert, insertObj_param);
// testExecute(dbClient.Delete, deleteObj_param);

// testExecute(dbClient.executeSql, querySql_param);
// testExecute(dbClient.executeSql, updateSql_param);
// testExecute(dbClient.executeSql, deleteSql_param);
// testExecute(dbClient.executeSql, insertSql_param);

// testExecute(dbClient.BatchExecute, batchObj_param);
// testExecute(dbClient.InsertMany, insertManyObj_param);
// dbMultiExecute();
test("task1", 2, 100);
// test("task2", 1, 90);