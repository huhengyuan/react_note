const dbClient = require("../../db/db.mysql");
function connect() {
    let socket = require('socket.io-client')('http://localhost:3000');
    socket.on('connect', () => {
        console.log("client conncted.")
        console.log(socket.id);
    });
    socket.on('server_message', (data) => {
        console.log(data);
    });
    socket.on('disconnect', () => {
        console.log("client disconnected." + socket.id);
    });
    return socket;
}
async function getConnection() {
    let socket = require('socket.io-client')('http://localhost:3000');
    return await new Promise((resolve, reject) => {
        socket.on('connect', () => {
            console.log("socket connected." + socket.id);
            resolve(socket);
        });
        socket.on("disconnect", () => {
            console.log("socket disconnected." + socket.id);
        })
    });
}
async function query(tableName, query, fields) {
    let con = await getConnection();
    con.emit("db/query", { tableName, query, fields });
    return new Promise((resolve, reject) => {
        con.on("db/query/res", (res) => {
            con.close();;
            if (res.err) {
                reject(res.err);
            }
            else {
                resolve(res.results);
            }
        })
    })
}
async function update(tableName, query, dataContent) {
    let con = await getConnection();
    con.emit("db/update", { tableName, query, dataContent });
    return new Promise((resolve, reject) => {
        con.on("db/update/res", (res) => {
            con.close();
            console.log(Object.keys(res));
            if (res.err) {
                reject(res.err);
            }
            else {
                resolve(res.results);
            }
        })
    })
}
async function testConnect() {
    let con = await getConnection();
    console.log(con);
    release(con);
}
async function testQuery() {
    try {
        let res = await query("tenant_user", { userId: 9 });
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
async function testUpdate() {
    try {
        let res = await update("tenant_user", { userId: 9 }, { remarks: "socket.update" });
        console.log(res);
    }
    catch (err) {
        console.log(err);
    }
}
/**
 * 对象方式保持连接操作数据库
 * @param {*} con 
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} fields 
 * @param {*} dataContent 
 */
async function executeObjWithCon(con, operate, tableName, query, fields, dataContent) {
    if (!con) {
        con = await getConnection();
    }
    switch (operate) {
        case "query":
            con.emit("db/query", { tableName, query, fields });
            break;
        case "update":
            con.emit("db/update", { tableName, query, dataContent });
            break;
        case "delete":
            con.emit("db/delete", { tableName, query });
            break;
        case "insert":
            con.emit("db/insert", { tableName, dataContent });
            break;
        case "insertMany":
            con.emit("db/insertMany", { tableName, dataContent });
        default:
            break;
    }
    return new Promise((resolve, reject) => {
        let eventName = "db/" + operate + "/res";
        console.log(eventName);
        con.on(eventName, (res) => {
            if (res.err) {
                reject(res.err);
            }
            else {
                resolve(res.results);
            }
        })
    });

}
async function testMultiexecute() {
    try {
        let con = await getConnection();
        let res = await executeObjWithCon(con, "query", "tenant_user", { userId: 9 }, null, null);
        console.log(res);
        res = await executeObjWithCon(con, "update", "tenant_user", { userId: 9 }, null, { remarks: "socket.update.2" });
        console.log(res);
        con.close();
    }
    catch (err) {
        console.log(err);
    }
}
// testConnect();
// testQuery();
// testUpdate();
testMultiexecute();


