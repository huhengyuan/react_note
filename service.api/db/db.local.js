var db_local = require("./db_mock").db_mock;
var db_local_client = {
  getConnection: async function getConnection() {
    return { id: 1 };
  },
  InsertWithCon: async function InsertWithCon(con, tableName, dataContent) {
    if (!dataContent) {
      throw new Error("保存对象不能为空");
    }
    db_local[tableName].data.push(dataContent);
    return { affectedRows: 1 };
  },
  Insert: async function Insert(tableName, dataContent) {
    return await this.InsertWithCon(null, tableName, dataContent);
  },
  UpdateWithCon: async function UpdateWithCon(con, tableName, query, dataContent) {
    let arr = db_local[tableName].data;
    let affectedRows = 0;
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;
      Object.keys(query).forEach((key) => {
        if (query[key] != obj[key]) {
          ismatch = false;
        }
      });
      if (ismatch) {
        Object.keys(dataContent).forEach((key) => {
          arr[i][key] = dataContent[key];
        });
        affectedRows++;
      }
    }
    return { affectedRows };
  },
  Update: async function Update(tableName, query, dataContent) {
    return await this.UpdateWithCon(null, tableName, dataContent);
  },
  DeleteWithCon: async function DeleteWithCon(con, tableName, query) {
    let arr = db_local[tableName].data;
    let affectedRows = 0;
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;

      Object.keys(query).forEach((key) => {
        if (query[key] != obj[key]) {
          ismatch = false;
        }
      });
      if (ismatch) {
        arr.splice(i, 1);
        affectedRows++;
      }
    }
    return { affectedRows };
  },
  Delete: async function Delete(tableName, query) {
    return await DeleteWithCon(null, tableName, query);
  },
  QueryWithCon: async function QueryWithCon(con, tableName, query, fields) {
    let arr = db_local[tableName].data;
    let arrRes = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let ismatch = true;
      if (query) {
        Object.keys(query).forEach((key) => {
          if (query[key] != obj[key]) {
            ismatch = false;
          }
        });
      }

      if (ismatch) {
        arrRes.push(JSON.parse(JSON.stringify(obj)));
      }
    }

    if (fields) {
      for (let j = 0; j < arrRes.length; j++) {
        let objTemp = arrRes[j];
        Object.keys(objTemp).forEach((key) => {
          if (!fields[key]) {
            delete objTemp[key];
          }
        });
      }
    }
    return arrRes;
  },
  Query: async function Query(tableName, query, fields) {
    return await this.QueryWithCon(null, tableName, query, fields);
  },
  InsertManyWithCon: async function InsertManyWithCon(con, tableName, dataList) {
    if (!dataContent || dataContent.length < 1) {
      throw new Error("保存数组内容不能为空");
    }
    db_local[tableName].data = db_local[tableName].data.contact(dataContent);
    return { affectedRows: dataContent.length };
  },
  InsertMany: async function InsertMany(tableName, dataList) {
    return await this.InsertManyWithCon;
  },
  ExecuteTrans: async function ExecuteTrans(callback) {
    try {
      let con = { id: 1 };
      let res_temp = await callback(con);
      return res_temp;
    } catch (err) {
      throw err;
    }
  },
};
module.exports.db_local_client = db_local_client;
