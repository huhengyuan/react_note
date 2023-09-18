const dbClient = require("../db/db.mysql");
const login = require("../login/login");
const sign = require("../sign/sign");
const token = require("../token/token");
const sms = require("../sms/sms.service");
const email = require("../email/email.service");
const logger = require("../log").logger;
const server = require("http").createServer({});
const options = {};
// const options = {};
options.transports = ["polling"];
options.transports = ["websocket"];
options.pingTimeout = 5000;
const io = require("socket.io")(server, options);
const port = 6306;
var connectionPool = {};
const isDebug = true;
const channel = {
  login_pda: {
    needsign: true,
    needtoken: false,
    request: "api/pda/login/request",
    response: "api/pda/login/response",
    execute: async (body) => {
      return await login.login_pda(body.userId);
    },
  },
  login_pc: {
    needsign: true,
    needtoken: false,
    request: "api/pc/login/request",
    response: "api/pc/login/response",
    execute: async (body) => {
      return await login.login_pc(body.tenantId, body.userId, body.pwd);
    },
  },
  getConnection: {
    needsign: true,
    needtoken: true,
    request: "db/getConnection/request",
    response: "db/getConnection/response",
    execute: async (req) => {
      if (connectionPool[req.id]) {
        dbClient.release(connectionPool[req.id]);
      }
      let con = await dbClient.getConnection();
      connectionPool[req.id] = con;
      return { code: 1, message: "success" };
    },
  },
  beginTrans: {
    needsign: true,
    needtoken: true,
    request: "db/beginTrans/request",
    response: "db/beginTrans/response",
    execute: async (req) => {
      await dbClient.beginTrans(connectionPool[req.id]);
      return { code: 1, message: "success" };
    },
  },
  commitTrans: {
    needsign: true,
    needtoken: true,
    request: "db/commitTrans/request",
    response: "db/commitTrans/response",
    execute: async (req) => {
      await dbClient.commitTrans(connectionPool[req.id]);
      return { code: 1, message: "success" };
    },
  },
  rollbackTrans: {
    needsign: true,
    needtoken: true,
    request: "db/rollbackTrans/request",
    response: "db/rollbackTrans/response",
    execute: async (req) => {
      await dbClient.rollbackTrans(connectionPool[req.id]);
      return { code: 1, message: "success" };
    },
  },
  executeObjWithCon: {
    needsign: true,
    needtoken: true,
    request: "db/executeObjWithCon/request",
    response: "db/executeObjWithCon/response",
    execute: async (req) => {
      let res = await dbClient.executeObjWithCon(
        connectionPool[req.id],
        req.operate, //操作类型
        req.tableName, //表名
        req.query, //查询条件
        req.fields, //返回字段
        req.dataContent, //数据内容 更新 /insert用
        req.pageNum, //页码
        req.pageSize, //每页记录数
        req.sortFields
      ); //排序字段{assetId:1,assetName:0} 0-降序 1-升序
      let _data = res.results;
      let _total = _data.length;
      let _pageCount = 1;
      if (req.operate == "query" && req.pageNum && req.pageSize) {
        //处理分页数据
        _data = res.results[0];
        _total = res.results[1][0].total;
        _pageCount = Math.round(_total / req.pageSize + 1);
      }
      return { code: 1, message: "success.", data: _data, total: _total, pageCount: _pageCount };
    },
  },
  executeProc: {
    request: "db/executeProc/request",
    response: "db/executeProc/response",
    execute: async (req) => {
      let res = await dbClient.executeProc(req.procName, req.paramContent);
      return { code: 1, message: "success", data: res.results[0] };
    },
  },
  sms_send: {
    needsign: true,
    needtoken: true,
    request: "sms/send/request",
    response: "sms/send/response",
    execute: async (req) => {
      return await sms.sms_send_cmbc(req.mobile, req.content);
    },
  },
  email_send: {
    needsign: true,
    needtoken: true,
    request: "email/send/request",
    response: "email/send/response",
    execute: async (req) => {
      return await email.email_send_cmbc(req.toAddr, req.ccAddress, req.title, req.content);
    },
  },
  batchExecute: {
    needsign: true,
    needtoken: true,
    request: "db/batchExecute/request",
    response: "db/batchExecute/response",
    execute: async (req) => {
      let res = await dbClient.BatchExecute(req);
      return { code: 1, message: "success.", data: res.data };
    },
  },
};
async function waitSecond(timeSpan) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeSpan);
  });
}
io.on("connect", (socket) => {
  console.log("socket connect success." + socket.id);
  Object.keys(channel).forEach((key) => {
    let channelObj = channel[key];
    socket.on(channelObj.request, async (req) => {
      logger.debug(channelObj.request);
      // console.log("client request reveive",channelObj.request,req);
      req = JSON.parse(req);
      // console.log(req);
      logger.debug(req);
      try {
        if (!req || !req.signature) {
          throw { code: -1, message: "请求参数不能为空" };
        }
        let res = null;
        if (channelObj.needsign) {
          res = await sign.verifySignature(req.body, req.signature);
          if (res.code != 1) {
            throw res;
          }
        }
        if (channelObj.needtoken && !isDebug) {
          res = await token.verifyToken(req.sn ? req.sn : req.userId, req.access_token);
          if (res.code != 1) {
            throw res;
          }
        }
        req.body.socket = socket;
        res = await channelObj.execute(req.body);
        socket.emit(channelObj.response, JSON.stringify(res));
      } catch (err) {
        console.log(err);
        socket.emit(channelObj.response, JSON.stringify({ code: -1, message: err.message }));
        logger.error(err);
      }
    });
  });
  socket.on("disconnect", () => {
    console.log("release con " + socket.id);

    dbClient.release(connectionPool[socket.id]);
  });
});
server.listen(port, () => {
  console.log("socket server is listening " + port);
});

process.on("uncaughtException", (err) => {
  console.log(err);
});
