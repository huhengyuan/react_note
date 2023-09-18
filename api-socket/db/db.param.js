/**
 * where条件和sql参数组装
 * @param {*} tableName 
 * @param {*} query 
 */
function whereAndParamsPack(query) {
    // console.log("where param", query);
    let params = [];
    let sqlWhere = " where 1=1 "
    if (query) {

        let conditionKeys = Object.keys(query);
        for (let j = 0; j < conditionKeys.length; j++) {
            let key = conditionKeys[j];
            let value = null;
            if (typeof (query[key]) == "object" && query[key]) {
                //处理大于小于关系
                let v = query[key];
                if (Object.keys(v).indexOf("$gt") >= 0) {
                    sqlWhere += " and " + key + " >?";
                    value = query[key]["$gt"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$lt") >= 0) {
                    sqlWhere += " and " + key + " <?";
                    value = query[key]["$lt"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$gte") >= 0) {
                    sqlWhere += " and " + key + " >=?";
                    value = query[key]["$gte"];
                    params.push(value);
                }
                if (Object.keys(v).indexOf("$lte") >= 0) {
                    sqlWhere += " and " + key + " <=?";
                    value = query[key]["$lte"];
                    params.push(value);
                }

            }
            else {//等于关系
                sqlWhere += " and " + key + " =?";
                value = query[key];
                params.push(value);
            }
        }
    }
    return { where: sqlWhere, params: params };
}
/**
 * where条件和sql参数组装
 * @param {*} tableName 
 * @param {*} query 
 */
function whereAndParamsPack2(query) {
    let sqlWhere = " where 1=1 "
    if (query) {
        let conditionKeys = Object.keys(query);
        for (let j = 0; j < conditionKeys.length; j++) {
            let key = conditionKeys[j];
            let value = null;
            if (typeof (query[key]) == "object") {
                //处理大于小于关系
                let v = query[key];
                if (Object.keys(v).indexOf("$gt") >= 0) {
                    value = query[key]["$gt"];
                    sqlWhere += " and " + key + " >'" + value + "'";


                }
                if (Object.keys(v).indexOf("$lt") >= 0) {
                    value = query[key]["$lt"];
                    sqlWhere += " and " + key + " <'" + value + "'";
                }
                if (Object.keys(v).indexOf("$gte") >= 0) {
                    value = query[key]["$gte"];
                    sqlWhere += " and " + key + " >='" + value + "'";

                }
                if (Object.keys(v).indexOf("$lte") >= 0) {
                    value = query[key]["$lte"];
                    sqlWhere += " and " + key + " <='" + value + "'";
                }

            }
            else {//等于关系
                value = query[key];
                sqlWhere += " and " + key + " ='" + value + "'";

            }
        }
    }
    return sqlWhere;
}
/**
 * 排序sql构造
 * @param {object} sortFields {assetId:0,assetName:1}
 */
function sortParamPack(sortFields) {
    console.log("排序对象", sortFields);
    let sqlSort = " ";
    if (sortFields) {
        sqlSort += " order by";

        Object.keys(sortFields).forEach((key) => {
            console.log("key", key);
            if (sortFields[key] == 0) {
                sqlSort += (" " + key + " desc,");
            }
            else {
                sqlSort += (" " + key + ",");
            }
        });

        sqlSort = sqlSort.substr(0, sqlSort.length - 1);
    }
    return sqlSort;
}
/**
 * 字段对象转换为字符串
 * @param {object} fields {assetId:1,assetName:1}
 */
function fields2String(fields) {
    let str = "";
    if (fields && Object.keys(fields).length > 0) {
        let hasField = false;
        Object.keys(fields).forEach((key) => {
            if (fields[key] == 1) {
                str += key + ",";
                hasField = true;
            }
        })
        if (hasField) {
            str = str.substr(0, str.length - 1);
        }

    }
    else {
        str += " * "
    }
    return str;
}
/**
 * 组装单表查询sql
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} fields
 * @param {*} pageNum
 * @param {*} pageSize
 * @param {object} 排序字段{field1:0,field2:1} 0降序 1 升序
 */
function queryParamPack(tableName, query, fields, pageNum, pageSize, sortFields) {
    let sql = "select ";
    let isPage = (pageNum && pageSize);
    if (isPage) {
        sql += "  SQL_CALC_FOUND_ROWS ";
    }
    let sqlFields = fields2String(fields);

    sql += sqlFields;
    sql += " from " + tableName;
    let paramObject = whereAndParamsPack(query);
    // console.log(paramObject);
    sql += paramObject.where;

    if (sortFields) {
        sql += sortParamPack(sortFields);
    }
    // 分页：
    if (pageNum && pageSize) {
        sql += " limit " + (pageNum - 1) * pageSize + "," + pageSize;
    } else {
        // 默认只给前100条：
        sql += " limit " + 1000000;
    }
    if (isPage) {
        sql += " ; select FOUND_ROWS() as total;"
    }
    return { sql: sql, params: paramObject.params };


}
/**
 * 组装单表更新sql
 * @param {*} tableName 
 * @param {*} query 
 * @param {*} dataContent 
 */
function updatParamPack(tableName, query, dataContent) {
    console.log("update origin:", dataContent);
    let sql = "update " + tableName + " set ";
    let params = [];
    if (dataContent && Object.keys(dataContent.length > 0)) {
        Object.keys(dataContent).forEach((key) => {
            sql += key + "=?,";
            params.push(dataContent[key]);
        })
        sql = sql.substr(0, sql.length - 1);
    }
    if (!query || Object.keys(query).length < 1) {
        throw new Error("delete param can't by null");
    }
    let paramObject = whereAndParamsPack(query);
    sql += paramObject.where;
    params = params.concat(paramObject.params);
    console.log("update:", sql);
    return { sql: sql, params: params };
}
/**
 * 组装单表删除sql
 * @param {*} tableName 
 * @param {*} query 
 */
function deleteParamPack(tableName, query) {
    let sql = "delete from " + tableName;
    if (!query || Object.keys(query).length < 1) {
        throw new Error("delete param can't by null");
    }
    let paramObject = whereAndParamsPack(query);
    sql = sql + paramObject.where;
    return { sql: sql, params: paramObject.params };
}
/**
 * 组装单表插入sql
 * @param {*} tableName 
 * @param {*} dataContent 
 */
function insertParamPack(tableName, dataContent) {
    let sql = "insert into " + tableName + " set?";
    return { sql: sql, params: [dataContent] };
}
/**
 * 批量插入参数生成
 * @param {*} tableName 
 */
function bulkParmPack(tableName, dataContent) {
    let sql = "insert into " + tableName + "(";
    let params = [];
    if (dataContent && dataContent.length > 0) {
        let row = dataContent[0];
        if (row && Object.keys(row).length > 0) {
            sql += Object.keys(row).join(",");
        }

        for (let i = 0; i < dataContent.length; i++) {
            params.push(Object.values(dataContent[i]));
        }
    }
    sql += ") values ?";
    return { sql: sql, params: [params] };
}
/**
 * 存储过程参数组装
 * @param {string} procName 
 * @param {object} paramObj {temantId:"uniontech",orgId:"TC001"，query:{status:0}}
 */
function procParamPack(procName, paramObj) {
    let query = paramObj.query;
    let fields = paramObj.fields;
    delete paramObj.query;
    delete paramObj.fields;
    let sql = "call " + procName + "(";
    let params = [];
    if (paramObj) {
        Object.keys(paramObj).forEach((key) => {
            sql += "?,";
            params.push(paramObj[key]);
        });
        if (query) {
            //组装查询条件
            let sqlWhere = whereAndParamsPack2(query);
            sql += "?,";
            params.push(sqlWhere);
        }
        if (fields) {
            let sqlFields = fields2String(fields);
            sql += "?,";
            params.push(sqlFields);
        }
        sql = sql.substr(0, sql.length - 1);
        sql += ")";
    }
    return { sql: sql, params: params }
}
module.exports.sortParamPack = sortParamPack;
module.exports.queryParamPack = queryParamPack;
module.exports.insertParamPack = insertParamPack;
module.exports.updatParamPack = updatParamPack;
module.exports.deleteParamPack = deleteParamPack;
module.exports.bulkParmPack = bulkParmPack;
module.exports.procParamPack = procParamPack;
module.exports.whereAndParamsPack2 = whereAndParamsPack2;