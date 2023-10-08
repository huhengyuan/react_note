const dayjs = require('dayjs');
const Joi = require('joi');
const path = require('path')
const dbOperate = require('../services/mysql/dbOperate.js')
const { deleteFolderRecursive } = require('../utility/util')
const { upload_file_path } = require('../config/config')

/**
 * 删除物料：
 * const materialList= [
       { 
         materialId: "xxxx", 
       }
    ]
 * @param {*} ctx 
 * @param {*} next 
 */
const handleDeleteMaterial = async (ctx, next) => {
    try {
        validateReqBody(ctx.request.body)
        const { tenantId, userId, materialList } = ctx.request.body;
        let result = await dbOperate.executeTransaction(async transaction => {
            for (each_material of materialList) {
                let { materialId } = each_material;
                let res_asset_info = await dbOperate.findOne({ tableName: "tenant_asset_material", query: { tenantId, materialId } }, transaction);
                if (!res_asset_info) throw new Error('该物料在物料信息中已删除.')
                // 1. 删除的表：
                await dbOperate.destroy({ tableName: "tenant_asset_material", query: { tenantId, materialId }, }, transaction);
                // 3. 删除文件：
                let deleteDir = path.resolve(upload_file_path, `./${tenantId}`, './material', `./${materialId}`);

                let res4 = await deleteFolderRecursive(deleteDir).catch(err => {
                    // 删除物料的报错
                    // console.log(err)
                });
            }
        })
        ctx.body = { code: 1, message: "删除物料成功." }
    } catch (error) {
        console.log(error);

        ctx.body = { code: -1, message: `删除物料失败，error: ${error.message}` }
        await next()
    }
}

function validateReqBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        materialList: Joi.array().items(
            Joi.object().keys({
                materialId: Joi.string().required(),
            }).unknown()
        ).min(1).required(),
    })
    const { error } = schema.validate(reqBody);
    if (error) throw new Error('数据验证失败，error: ', error)
}


module.exports = {
    "POST /v1.0/material/delete": handleDeleteMaterial,
}