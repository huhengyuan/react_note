const Joi = require('Joi');
const dbOperate = require('../services/mysql/dbOperate.js')

/**
 * 多表操作,
 * method: POST
 * url: /v1.0/multiTable
 * request.body {}：
 {
     tenantId: 'hgtech',
     userId: 'admin',
     multiTableOperate:[
         { 
             tableName: '', 
             operateType: "", // 指定操作类型
             query: {}, // 查询字段，方法为["findOne", "findAll", "destroy", "update"]时，必填
             dataContent: {}/[],
             pageNum: "",   // 指定第几页
             pageSize: "",  // 指定一页有多少条数据
             dataType: "", // 指定数据类型，默认不用这个字段，需要输出tree结构的数据时就指定为tree
             fieldId: "",  // 与dataType是共同存在的，指定tree的结构ID
        }
     ]
 }
 * @param {*} ctx 
 * @param {*} next 
 */
const handleMultiTableOperate = async (ctx, next) => {
    try {
        // console.log('reqBody:', JSON.stringify(ctx.request.body))
        validateRequestBody(ctx.request.body)
        
        const { multiTableOperate } = ctx.request.body;
        let result = await dbOperate.executeTransaction(async transaction => {
            for (item of multiTableOperate) {
                const { tableName, operateType, query, dataContent,updateOnDuplicate } = item;
                const params = { tableName, query, dataContent, updateOnDuplicate }
                let res = await dbOperate[operateType](params, transaction)
            }
        })
        ctx.body = { code: 1, message: '多表操作成功' }
    } catch (error) {
        // console.log('error---: ', error.parent)
        ctx.body = { code: -1, message: '多表操作失败，error：' + error.parent }
    }
    await next()
}

function validateRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        multiTableOperate: Joi.array().items(Joi.object().keys({
            tableName: Joi.string().required(),
            operateType: Joi.string().valid(...['bulkCreate', 'create', 'update', 'destroy']).required(),
            query: Joi.when('operateType', {
                is: Joi.string().valid(...['update', 'destroy']),
                then: Joi.object({
                    tenantId: Joi.string().required(),
                }).unknown().required()
            }),
            dataContent: Joi.when('operateType', {
                switch: [
                    { is: Joi.string().valid(...['create', 'update']), then: Joi.object().required() },
                    { is: Joi.string().valid(...['bulkCreate']), then: Joi.array().required() },
                ],
                otherwise: Joi.any()
            }),
            // 指定批量新增时，发生key重复之后，是否采用更新，以及更新的字段有哪些
            updateOnDuplicate: Joi.array().items(Joi.string())
        }).unknown().required())
    })

    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}

module.exports = {
    "POST /v1.0/multiTable": handleMultiTableOperate,
}