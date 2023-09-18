const io = require("socket.io-client");
const crypto = require("crypto");
const end_point = "http://localhost:6104";
const options={};
// options.transports = ['polling'];
options.transports = ["websocket"];
const channel = {
    login: {
        request: "api/pda/login/request",
        response: "api/pda/login/response",
    },
    getConnection: {
        request: "db/getConnection/request",
        response: "db/getConnection/response",
    },
    beginTrans: {
        request: "db/beginTrans/request",
        response: "db/beginTrans/response",
    },
    commitTrans: {
        request: "db/commitTrans/request",
        response: "db/commitTrans/response",
    },
    rollbackTrans: {
        request: "db/rollbackTrans/request",
        response: "db/rollbackTrans/response",
    },
    executeObjkWithCon: {
        request: "db/executeObjWithCon/request",
        response: "db/executeObjWithCon/response",
    },
    executeSqlWithCon: {
        request: "db/executeSqlWithCon/request",
        response: "db/executeSqlWithCon",
    },
};
Date.prototype.Format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds(),
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? date[k]
                    : ("00" + date[k]).substr(("" + date[k]).length)
            );
        }
    }
    return format;
};
const sign = {
    key: "supoin.iot@sz209",
    iv: "iot.supoin#Sz802",
    salt: "supoin@ms.bank",
    aes_encrypt: function aes_encrypt(key, iv, rawData) {
        key = Buffer.alloc(16, key, "utf-8");
        iv = Buffer.alloc(16, iv, "utf-8");
        let cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
        cipher.setAutoPadding(true);
        let encoded = cipher.update(rawData, "utf-8", "base64");
        encoded += cipher.final("base64");
        return encoded;
    },
    md5: (str) => {
        let cryptor = crypto.createHash("md5");
        return cryptor.update(str).digest("hex");
    },
    encrypt: function encrypt(rawData) {
        let encryptData = this.aes_encrypt(
            sign.key,
            sign.iv,
            JSON.stringify(rawData)
        );
        return this.md5(encryptData + sign.salt + new Date().Format("YYYY-MM-dd"));
    },
};
var cache = { access_token: "", sn: "" };
const operateEnum = {
    query: "query",
    insert: "insert",
    update: "update",
    delete: "delete",
    insertMany: "insertMany",
};
var dbClient = {
    getSocket: async function getSocket() {
        return new Promise((resolve, reject) => {
            // console.log("begin socket connect.");
            let socket = io(end_point,options);
            
            socket.on("connect", (res) => {
                console.log("connect success." + socket.id);
                // console.log("server response:" + res);
                resolve(socket);
            });
            socket.on("disconnect", (res) => {
                console.log("socket disconnected." + socket.id);
                console.log("server response:" + res);
            });
            socket.on("connect_error", (err) => {
                reject(err);
            });
        });
    },
    login: async function login(sn) {
        return new Promise(async (resolve, reject) => {
            let socket = null;
            try {
                socket = await this.getSocket();
                let rawData = { userId: sn };
                let signature = sign.encrypt(rawData);
                let data = {
                    userId: sn,
                    signature: signature,
                    body: rawData,
                };
                socket.emit(channel.login.request, JSON.stringify(data));
                socket.on(channel.login.response, (res) => {
                    res = JSON.parse(res);
                    socket.close();
                    if (res.code == 1) {
                        cache.access_token = res.data.access_token;
                        cache.sn = sn;
                        resolve(res);
                    } else {
                        reject(res);
                    }
                });
            } catch (err) {
                if (socket) {
                    socket.close();
                }
                reject(err);
            }
        });
    },
    getConnection: async function getConnection() {
        let socket = await this.getSocket();
        return new Promise((resolve, reject) => {
            let rawData = { id: socket.id };
            try {
                let signature = sign.encrypt(rawData);
                let data = {
                    signature: signature,
                    access_token: cache.access_token,
                    sn: cache.sn,
                    body: rawData,
                };
                socket.emit(channel.getConnection.request, JSON.stringify(data));
                socket.on(channel.getConnection.response, (res) => {
                    res = JSON.parse(res);
                    if (res.code == 1) {
                        resolve(socket);
                    } else {
                        this.Close(socket);
                        reject(res);
                    }
                });
            } catch (err) {
                this.Close(socket);
                reject(err);
            }
        });
    },
    ping: async function () {
        let socket = await this.getSocket();
        socket.emit("client", "");
        socket.on("message", (data) => {
            console.log("message1." + data);
        })
        socket.on("message", (data) => {
            console.log("message2." + data);

        })
    },
    executeChannel: async function executeChannel(con, channelObj, param) {
        return new Promise(async (resolve, reject) => {
            try {
                let needRelease = false;
                if (!con) {
                    con = await this.getConnection();
                    needRelease = true;
                }
                if (!param) {
                    param = {};
                }
                param.id = con.id;
                let signature = sign.encrypt(param);
                let data = {
                    signature: signature,
                    access_token: cache.access_token,
                    sn: cache.sn,
                    body: param,
                };
                con.emit(channelObj.request, JSON.stringify(data));
                con.on("message", (data) => {
                    console.log("message1." + data);
                })
                con.on("message", (data) => {
                    console.log("message2." + data);

                })

                con.on(channelObj.response, (res) => {
                    res = JSON.parse(res);
                    if (needRelease) {
                        con.close();
                    }
                    if (res.code == 1) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    },
    beginTrans: async function beginTrans(con) {
        return this.executeChannel(con, channel.beginTrans);
    },
    commitTrans: async function commitTrans(con) {
        return this.executeChannel(con, channel.commitTrans);
    },
    rollbackTrans: async function rollbackTrans(con) {
        return this.executeChannel(con, channel.rollbackTrans);
    },
    executeObjWithCon: async function executeObjWithCon(
        con,
        operate,
        tableName,
        query,
        fields,
        dataContent
    ) {
        return this.executeChannel(con, channel.executeObjkWithCon, {
            operate: operate,
            tableName: tableName,
            query: query,
            fields: fields,
            dataContent: dataContent,
        });
    },
    QueryWithCon: async function QueryWithCon(con, tableName, query, fields) {
        return this.executeObjWithCon(
            con,
            operateEnum.query,
            tableName,
            query,
            fields,
            null
        );
    },
    Query: async function Query(tableName, query, fields) {
        return this.QueryWithCon(null, tableName, query, fields);
    },
    UpdateWithCon: async function UpdateWithCon(
        con,
        tableName,
        query,
        dataContent
    ) {
        return this.executeObjWithCon(
            con,
            operateEnum.update,
            tableName,
            query,
            null,
            dataContent
        );
    },
    Update: async function Update(tableName, query, dataContent) {
        return this.UpdateWithCon(null, tableName, query, dataContent);
    },
    InsertWithCon: async function InsertWithCon(con, tableName, dataContent) {
        return this.executeObjWithCon(
            con,
            operateEnum.insert,
            tableName,
            null,
            null,
            dataContent
        );
    },
    Insert: async function Insert(tableName, dataContent) {
        return this.InsertWithCon(null, tableName, dataContent);
    },
    InsertManyWithCon: async function InsertManyWithCon(
        con,
        tableName,
        dataContent
    ) {
        return this.executeObjWithCon(
            con.operateEnum.insertMany,
            tableName,
            null,
            null,
            dataContent
        );
    },
    InsertMany: async function InsertMany(tableName, dataContent) {
        return this.InsertManyWithCon(null, tableName, dataContent);
    },
    Close: function Close(con) {
        try {
            if (con) {
                con.close();
            }
        } catch (err) {
            console.log(err);
        }
    },
};
module.exports.dbClient = dbClient;
