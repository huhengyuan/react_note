const dayjs = require('dayjs');
const Joi = require('joi');
const path = require('path')
const dbOperate = require('../services/mysql/dbOperate.js')
const { deleteFolderRecursive } = require('../utility/util')
const { upload_file_path } = require('../config/config')

/**
 * 删除资产：
 * const assetList = [
       { 
         assetId: "xxxx", 
         applyPerson: "xxx",
         disposalMoney: "xxx",
         suggestion: "xxx",
       }
    ]
 * @param {*} ctx 
 * @param {*} next 
 */
const handleDeleteAsset = async (ctx, next) => {
    try {
        validateReqBody(ctx.request.body)
        const { tenantId, userId, assetList } = ctx.request.body;
        let result = await dbOperate.executeTransaction(async transaction => {
            for (each_asset of assetList) {
                let { assetId, applyPerson, disposalMoney, suggestion } = each_asset;
                let res_asset_info = await dbOperate.findOne({ tableName: "tenant_asset", query: { tenantId, assetId } }, transaction);
                if (!res_asset_info) throw new Error('该资产在台账信息中已删除.')
                // 1. 待删除操作的表：
                let delete_tableName_list = [
                    "tenant_asset", "tenant_bill_measure_detail", "tenant_attachment_asset", "tenant_bill_maintain_detail"
                ]
                for (tableName of delete_tableName_list) {
                    await dbOperate.destroy({ tableName, query: { tenantId, assetId }, }, transaction);
                }
                // 2. 报废单据相关的操作：
                // let billNo = 'Scrap' + dayjs().format('YYYYMMDDHHmmss');
                // // 插入报废主表：
                // let res1 = await dbOperate.create({ tableName: "tenant_bill_scrap_main", dataContent: { tenantId, billNo, } }, transaction)
                // // 插入报废明细表：
                // let res2 = await dbOperate.create({
                //     tableName: "tenant_bill_scrap_detail",
                //     dataContent: {
                //         tenantId, billNo, assetId, applyPerson, disposalMoney, suggestion,
                //         assetName: res_asset_info.assetName,
                //         ownOrgName: res_asset_info.ownOrgName
                //     }
                // }, transaction)
                // 插入报废原始表：
                res_asset_info.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                res_asset_info.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
                res_asset_info.applyPerson = applyPerson;
                res_asset_info.disposalMoney = disposalMoney;
                res_asset_info.suggestion = suggestion;
                let res3 = await dbOperate.create({ tableName: "tenant_asset_scrap", dataContent: res_asset_info }, transaction)

                // 3. 删除文件：
                let deleteDir = path.resolve(upload_file_path, `./${tenantId}`, './asset', `./${assetId}`);

                let res4 = await deleteFolderRecursive(deleteDir).catch(err => {
                    // 删除资产的报错
                    // console.log(err)
                });
            }
        })
        ctx.body = { code: 1, message: "删除资产成功." }
    } catch (error) {
        console.log(error.parent.message);
        if (error.parent && error.parent.message && error.parent.message.indexOf('idx_tenantId_assetId') !== -1) {
            ctx.body = { code: -1, message: `删除资产失败: 该资产编号已经在报废列表中存在了（即已经删过一次了），要想重新删除，需要先删掉报废表中的该资产！` }
        } else {
            ctx.body = { code: -1, message: `删除资产失败，error: ${error.message}` }
        }
        await next()
    }
}

function validateReqBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        assetList: Joi.array().items(
            Joi.object().keys({
                assetId: Joi.string().required(),
            }).unknown()
        ).min(1).required(),
    })
    const { error } = schema.validate(reqBody);
    if (error) throw new Error('数据验证失败，error: ', error)
}


module.exports = {
    "POST /v1.0/asset/delete": handleDeleteAsset,
}