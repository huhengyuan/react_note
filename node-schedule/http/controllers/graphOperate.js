const Joi = require('Joi');
const dbOperate = require('../services/mysql/dbOperate')
const util = require('../utility/util')
const operateTypeEnum = {
    total: ["findOne", "findAll", "create", "bulkCreate", "destroy", "update"],
    needQuery: ["findOne", "findAll", "destroy", "update"],
    needDataContent: ["create", "bulkCreate", "update"]
}
/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * ctx.request.body 的参数示例：
 * {
 *    // 每次请求必带的两个字段
 *    tenantId: "",
 *    userId: "",
 * 
 *    tableName: "",  // 指定表名
 *    operateType: "", // 指定操作类型
 *    query: {}, // 查询字段，方法为["findOne", "findAll", "destroy", "update"]时，必填
 *    dataContent: {}/[], 
 *    pageNum: "",   // 指定第几页
 *    pageSize: "",  // 指定一页有多少条数据
 *    dataType: "", // 指定数据类型，默认不用这个字段，需要输出tree结构的数据时就指定为tree
 *    fieldId: "",  // 与dataType是共同存在的，指定tree的结构ID
 * }
 * 
 * bulkCreate方法的updateOnDunplicate配置：
 * updateOnDunplicate：['isAdmin','updatePerson','updateTime']
 * 
 */

const graphOperate = async (ctx, next) => {
    try {
        // console.log("ctx.request.body", ctx.request.body)
        // 1.验证请求参数：
        validatePostRequestBody(ctx.request.body);
        const {
            tableName, operateType, query, dataContent, fields,
            pageNum, pageSize,
            dataType, fieldId,
            updateOnDuplicate
        } = ctx.request.body;
        // if (operateType === 'destroy') {
        //     return ctx.body = { code: 1, message: '暂停删除操作' }
        // }
        // 2.数据库操作：
        const params = { tableName, query, dataContent, fields, pageNum, pageSize, updateOnDuplicate }
        let result = await dbOperate[operateType](params);
        // 3.数据格式化操作：
        if (dataType && dataType === "tree") {
            // 先转化为树结构：
            result = util.arrToTree(result, fieldId, '0')
            // 再进行排序：
            sortByOrder(result, 'order')
        }
        // console.log(result)
        ctx.body = { code: 1, message: "success", data: result }
    } catch (error) {
        console.log('error---:', error)
        ctx.response.body = error.name === "SequelizeUniqueConstraintError"
            ? { code: -111, message: "重复的编号" } :
            { code: -100, message: error.message }
    }
    await next()

}
// 验证请求参数
function validatePostRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        tableName: Joi.string().required(),
        operateType: Joi.string().valid(...operateTypeEnum["total"]).required(),
        query: Joi.when('operateType', {
            is: Joi.string().valid(...operateTypeEnum["needQuery"]), then: Joi.object().required(),
        }),
        dataContent: Joi.when('operateType', {
            switch: [
                { is: Joi.string().valid(...['create', 'update']), then: Joi.object().required() },
                { is: Joi.string().valid(...['bulkCreate']), then: Joi.array().required() },
            ],
            otherwise: Joi.any()
        }),
        fields: Joi.array().items(Joi.string()),
        pageNum: Joi.number(),
        pageSize: Joi.number(),
        dataType: Joi.string(),
        fieldId: Joi.string()
    }).with('pageNum', 'pageSize').with('dataType', 'fieldId').unknown();

    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}

module.exports = {
    "POST /v1.0/graphOperate": graphOperate,
}
