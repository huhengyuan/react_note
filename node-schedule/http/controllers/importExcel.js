const Joi = require('Joi');
const dayjs = require('dayjs');
const dbOperate = require('../services/mysql/dbOperate.js');


// 各个表的唯一key：
const table_only_key = {
    'tenant': ['tenantId'],
    'tenant_asset': ['tenantId', 'assetId'],
    'tenant_asset_class': ['tenantId', 'classId'],
    'tenant_asset_measure': ['tenantId', 'materialId'],
    'tenant_bill_main': ['tenantId', 'billNo'],
    'tenant_bill_detail': ['tenantId', 'billNo', 'assetId'],
}

// 需要验证必须为时间格式的字段：
const mustTimeFormatFields = [
    'startTime','endTime',
    'planTime','inFactoryDate',
    'maintainTime','correctTime',
    'leaveTime','createTime',
]

/**
 * 一、批量导入数据验证：
 * method: POST
 * url: /v1.0/import/checkExcel
 * request.body {}：
 {
     tenantId: 'hgtech',
     userId: 'admin',
     tableName: 'tenant',
     operateType: "bulkCreate", // 固定为批量导入
     dataContent: [], // 固定为数组,
     isOpenValidInTenantAsset: true, // 指定是否开启，验证资产是否已经导入台账了。
 }
 * @param {*} ctx 
 * @param {*} next 
 */
const handleCheckExcel = async (ctx, next) => {
    let result = [];
    try {
        // console.log(ctx.request.body)
        const { tenantId, tableName, dataContent, isOpenValidInTenantAsset = true } = ctx.request.body;
        // 1. 验证请求体：
        validateRequestBody(ctx.request.body)
        // 2. 验证单据明细的资产是否已导入资产台账信息：
        isOpenValidInTenantAsset && await validateAssetIsInBaseAssetList(tenantId, dataContent);

        // 3. 验证上传数据内容：
        result = validateDataContent(tableName, dataContent)
        if (result.length) throw result;

        ctx.body = { code: 1, message: '数据校验完成', data: result }
    } catch (error) {
        // console.log('error:', error);

        ctx.body = { code: -1, message: '数据校验出错，error：', data: error }
    }
    await next()
}

// 验证请求体字段：
function validateRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        tableName: Joi.string().required(),
        operateType: Joi.string().valid('bulkCreate').required(),
        dataContent: Joi.array().items(
            Joi.object().keys({
                tenantId: Joi.string().required(),
            }).unknown().required()).min(1),
        isOpenValidInTenantAsset: Joi.boolean()
    }).required()

    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}

/**
 * 验证excel上传数据的合法性：
 * @param {*} tableName 
 * @param {*} dataContent 
 */
function validateDataContent(tableName, dataContent) {
    // 获取表的字段配置信息，用于导入数据验证：
    const importExcelRules = require('../services/mysql/schema/rules.json');

    let rules = importExcelRules[tableName]
    let result = [];
    for (let i = 0; i < dataContent.length; i++) {
        // 判断每个字段：
        for (let key of Object.keys(dataContent[i])) {
            // 1.拿到该列的值：
            let colValue = dataContent[i][key];

            // 2.获取验证规则：
            let rule = "";
            for (let j = 0; j < rules.length; j++) {
                if (rules[j].key === key) {
                    rule = rules[j].rule;
                    break;
                }
            }

            // 3.有规则就进行验证：
            if (rule) {
                let reason = "";
                if (rule.required && !colValue) { reason += "不能为空 "; }

                if (colValue && rule.dataType === "datetime" && !dayjs(colValue).isValid()) {
                    reason += "时间格式错误 ";
                }
                // 加入常用时间字段的格式验证：
                if (mustTimeFormatFields.includes(key) && colValue && !isDate(colValue)){
                    reason += "时间格式错误 ";
                }
                // 4.返回验证结果：
                if (reason) {
                    result.push({ rowNum: i + 1, columnName: key, reason: reason, });
                }
            }
        }
    }
    return result;
}

// 验证是否为时间格式：
// 目前导入系统的时间格式限定为两种：【YYYY-MM-DD】= 10位、【YYYY-MM-DD HH:mm:ss】= 19位
function isDate(dateValue){
    if ([10, 19].includes(dateValue.length) && Date.parse(dateValue)){
        return true
    }
    return false
}

// 插入之前进行数据是否在资产台账信息的验证：
async function validateAssetIsInBaseAssetList(tenantId, detail_asset_list) {
    const res_base_asset_list = await dbOperate.findAll({ tableName: 'tenant_asset', query: { tenantId }, fields: ["assetId"] });
    const base_asset_list = res_base_asset_list.map(e => e.assetId);
    let result = [];
    for (let i = 0; i < detail_asset_list.length; i++) {
        let c_assetId = detail_asset_list[i].assetId;
        if (!base_asset_list.includes(c_assetId)) {
            result.push({ rowNum: i + 1, columnName: 'assetId', reason: '资产尚未导入到台账信息中', })
        }
    }
    if (result.length) {
        throw result;
    }
}



/**
 * 二、确认导入数据，包括插入主表、明细表、更新资产台账的资产状态信息：
 * method: 'POST',
 * url   : '/v1.0/import/insertExcel'
 * body  : 
 {
     tenantId: 'hgtech',
     userId: 'admin',
     mainTableOperate:{
        tenantId: 'hgtech',
        userId: 'admin',
        tableName: 'tenant',
        operateType: "create", // 固定为单个导入
        dataContent: {}, // 固定为对象 
     },
     detailTableOperate:{
        tenantId: 'hgtech',
        userId: 'admin',
        tableName: 'tenant',
        operateType: "bulkCreate", // 固定为批量导入
        dataContent: [], // 固定为数组
     }
  
 }
 */
const handleInsertExcel = async (ctx, next) => {
    try {
        const { tenantId, mainTableOperate, detailTableOperate } = ctx.request.body;
        // 1. 验证请求体：
        validateInsertRequestBody(ctx.request.body)

        // 2. 执行事务操作，导入excel数据
        const result = await dbOperate.executeTransaction(async transaction => {
            // 主表导入
            let res1 = await dbOperate[mainTableOperate.operateType](
                { tableName: mainTableOperate.tableName, dataContent: mainTableOperate.dataContent },
                transaction
            );
            // 明细表导入
            let res2 = await dbOperate[mainTableOperate.operateType](
                { tableName: detailTableOperate.tableName, dataContent: detailTableOperate.dataContent },
                transaction
            );
            // 资产台账信息更新，资产状态：
            for (item of detailTableOperate.dataContent) {
                let res3 = await dbOperate.update(
                    {
                        tableName: "tenant_asset",
                        query: { tenantId, assetId: item.assetId, },
                        dataContent: { status: mainTableOperate.dataContent.find(e => e.billNo === item.billNo)['status'] }
                    },
                    transaction
                );
            }
        })

        ctx.body = { code: 1, message: '数据导入成功', }

    } catch (error) {
        console.log(error)
        ctx.body = { code: -1, message: '数据导入失败，error：' + error.message }
    }
    await next()
}

// 导入请求体字段验证：
function validateInsertRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        mainTableOperate: Joi.object({
            tenantId: Joi.string().required(),
            userId: Joi.string().required(),
            tableName: Joi.string().required(),
            operateType: Joi.string().valid('bulkCreate').required(),
            dataContent: Joi.array().items(
                Joi.object().keys({
                    tenantId: Joi.string().required(),
                    billNo: Joi.string().required(),
                }).unknown().required()).min(1)
        }).required(),
        detailTableOperate: Joi.object({
            tenantId: Joi.string().required(),
            userId: Joi.string().required(),
            tableName: Joi.string().required(),
            operateType: Joi.string().valid('bulkCreate').required(),
            dataContent: Joi.array().items(
                Joi.object().keys({
                    tenantId: Joi.string().required(),
                    billNo: Joi.string().required(),
                    assetId: Joi.string().required(),
                }).unknown().required()).min(1)
        }).required()
    })

    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}



module.exports = {
    "POST /v1.0/import/checkExcel": handleCheckExcel,
    "POST /v1.0/import/insertExcel": handleInsertExcel,
}
