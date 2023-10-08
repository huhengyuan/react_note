const fs = require('fs');
const fsAsync = require('fs').promises;
const path = require('path');
const Joi = require('joi');
const send = require('koa-send');
const _ = require('lodash');
const { upload_file_path } = require('../config/config')
const dbOperate = require('../services/mysql/dbOperate.js');
const dayjs = require('dayjs');

// 有效的存储类型：
const validSaveTypeEnum = ["asset", "material", "none"];
const validSaveIdTypeEnum = ["assetId", "materialId", "none"];
// 资产的单据操作类型：
const operateTypeObj = {
    "base": "资产台账",
    "acceptance": "设备验收",
    "in_factory": "设备入厂",
    "leave_factory": "设备出厂",
    "lend": "设备借出",
    "maintain": "设备维护",
    "measure": "设备计量",
    "repair": "设备维修",
    "return": "设备归还",
    "scrap": "设备报废",
    "transfer": "设备转移",
    "unuse": "设备闲置",
}
/**
 * 上传文件,附带参数：
  {
     tenantId: '', // 必填
     userId: '', // 必填
     saveType: "", // 存储类型：asset（资产以及资产流程相关的）、material（耗材）、none（公共的存储附件）
     saveIdType: "", //存储类型：assetId、materialId、none、
     saveIdValue: "", // 存储资产/计量设备的ID值；当saveType===asset/material时则是必填的；
     operateType: '设备转移',  // 非必填，但是如果saveType===asset，才是必填的。中文即可
     attachmentId: 'xxx', // 附件标识，默认是：单据号+assetId
     remarks: "备注信息"
  }
存储结果："[设备转移-时间xxx]"
 * @param {*} ctx 
 * @param {*} next 
 */
const handleUploadFile = async (ctx, next) => {
    try {
        const reqBody = JSON.parse(ctx.request.body.query);
        const { tenantId, saveType, saveIdType, saveIdValue, operateType, remarks } = reqBody;
        const { file } = ctx.request.files;
        // 1. 验证上传的参数：
        varifyUploadFileReqBody(reqBody);
        // 2. 验证路径、获取路径、
        const file_save_dir = verifyPathAndReturnFilePath(reqBody);
        // 3. 生成保存文件的名称：
        const { file_save_name, dataContent } = createFileSaveNameAndDBCreateDataContent(reqBody, file.name)
        const res = await dbOperate.executeTransaction(async transaction => {
            // 4. 写入文件：
            let res1 = writeFile(file, file_save_dir, file_save_name);
            // 5. 插入一条新的附件数据：
            let res2 = await dbOperate.create({ tableName: `tenant_attachment_${saveType}`, dataContent }, transaction);
            // 6. 更新台账的资产附件数量：
            if (saveType === 'asset') {
                // 先查出台账资产当前的附件数量,再更新：
                let db_operate_params = {
                    tableName: `tenant_asset`,
                    query: { tenantId: 'hgtech', assetId: saveIdValue }
                }
                let res_find = await dbOperate.findOne(db_operate_params, transaction);
                // 附上更新数据datacontent：
                db_operate_params.dataContent = { attachmentQty: !res_find.attachmentQty ? 1 : res_find.attachmentQty + 1 };
                let res_update = await dbOperate.update(db_operate_params, transaction)
            }
        })

        ctx.body = { code: 1, message: '文件上传成功' }

    } catch (error) {
        ctx.body = { code: -1, message: '文件上传失败，error: ' + error.message }
    }
    await next()
}

function varifyUploadFileReqBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        saveType: Joi.string().valid(...validSaveTypeEnum).required(),
        saveIdType: Joi.string().valid(...validSaveIdTypeEnum).required(),
        saveIdValue: Joi.when('saveIdType', {
            is: Joi.string().valid(...['assetId', 'materialId']),
            then: Joi.string().required()
        }),
        operateType: Joi.when('saveIdType', {
            is: Joi.string().valid(...['assetId']),
            then: Joi.string().valid(...Object.keys(operateTypeObj)).required()
        }),
        attachmentId: Joi.string(),
        // remarks: Joi.string(),
    }).unknown()
    const { error } = schema.validate(reqBody)
    if (error) throw new Error("数据验证失败，error：" + error.message)
}


// 生成文件路径：
function verifyPathAndReturnFilePath(reqBody) {
    const { tenantId, saveType, saveIdValue, operateType } = reqBody;
    const file_save_dir = path.resolve(
        upload_file_path,
        `./${tenantId}/${saveType !== "none" ? saveType + '/' + saveIdValue : saveType}/`
    )
    mkdirsSync(file_save_dir)

    return file_save_dir
}

// 递归创建目录 同步方法
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
// 创建新的文件名称, 以及生成保存至数据库的记录：
function createFileSaveNameAndDBCreateDataContent(reqBody, originFileName) {
    // 1. 生成文件名称：
    const { tenantId, userId, saveType, saveIdType, saveIdValue, operateType, attachmentId, remarks } = reqBody;
    const prefix = saveType === "none" ? "" : `[${operateTypeObj[operateType]}-${dayjs().format("YYYYMMDD")}]-`;
    const file_save_name = prefix + originFileName;

    // 2. 生成保存至数据库的文件记录：
    let dataContent = {
        tenantId,
        attachmentName: file_save_name,
        createPerson: userId,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        remarks,
    }
    if (saveType !== "none") {
        dataContent[saveIdType] = saveIdValue;
        if (operateType) {
            dataContent.operateType = operateType;
            dataContent.attachmentId = attachmentId;
        }
    }

    return { file_save_name, dataContent };
}

function writeFile(file, file_save_dir, file_save_name) {
    const reader = fs.createReadStream(file.path);
    const upStream = fs.createWriteStream(file_save_dir + '/' + file_save_name)
    reader.pipe(upStream)
}


/***********************************************************************************************
 * 下载文件接口：
 * header: {"access_token": 'xxx'}
 * method: "GET"
 * query 输入参数：
 {
     tenantId: '', // 必填
     userId: '',  // 必填
     saveType: "", // 存储类型：asset、material、none
     saveIdType: "", //存储类型：assetId、materialId、none、
     saveIdValue: "", // 存储资产/计量设备的ID值；
     fileName: "", // fileName, 下载的文件名称
  }
 * @param {*} ctx 
 * @param {*} next 
 */
const handleDownloadFile = async (ctx, next) => {
    const { tenantId, saveType, saveIdType, saveIdValue, fileName, } = ctx.request.query;
    try {
        // console.log(ctx.request.query)
        // 1. 验证参数：
        varifyDownFileReqBody(ctx.request.query);
        // 2. 生成文件路径
        const file_path = path.resolve(
            upload_file_path,
            `./${tenantId}/${saveType !== "none" ? saveType + '/' + saveIdValue : saveType}`
        )
        // 3. 判断文件是否存在：
        const res_exists = await fsAsync.stat(file_path + '/' + fileName)
        // 4. 挂载文件：
        ctx.attachment(fileName)

        await send(ctx, fileName, { root: file_path });
    } catch (error) {
        let message = error.message;
        if (message.indexOf('no such file or directory') !== -1) {
            message = "文件不存在"
        }
        ctx.body = { code: -1, message: `下载文件失败，error: [${fileName}] ${message}` }
        await next()
    }
}

function varifyDownFileReqBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        saveType: Joi.string().valid(...validSaveTypeEnum).required(),
        saveIdType: Joi.string().valid(...validSaveIdTypeEnum).required(),
        saveIdValue: Joi.when('saveIdType', {
            is: Joi.string().valid(...['assetId', 'materialId']),
            then: Joi.string().required()
        }),
        fileName: Joi.string().required(),
    }).unknown();
    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}


/************************************************************************************************
 * 删除文件：
 * method："POST"，
 * body：
{
     tenantId: '', // 必填
     userId: '',  // 必填
     saveType: "", // 存储类型：asset、material、none
     saveIdType: "", //存储类型：assetId、materialId、none、
     saveIdValue: "", // 存储资产/计量设备的ID值；
     fileName: "", //文件名称
}
 * @param {*} ctx 
 * @param {*} next 
 */
const handleDeleteFile = async (ctx, next) => {
    try {
        // console.log(ctx.request.query)
        // 1. 验证参数：
        verifyDeleteFileReqBody(ctx.request.body);
        const { tenantId, saveType, saveIdType, saveIdValue, fileName } = ctx.request.body;
        // 2. 生成文件路径
        const file_path = path.resolve(
            upload_file_path,
            `./${tenantId}/${saveType !== "none" ? saveType + '/' + saveIdValue : saveType}/${fileName}`
        )
        // 3. 验证文件是否存在：
        const res_exists = await isFileExist(file_path);
        if (res_exists) {
            // 4. 删除文件：
            const res_delete = await fsAsync.unlink(file_path);
        }
        // 如果文件不存在，但是数据库中有这条文件的记录，需删除这条文件记录：
        let result = await dbOperate.executeTransaction(async transaction => {
            // 5. 删除资产/耗材附件表的一条附件记录:
            let res3 = await dbOperate.destroy({
                tableName: `tenant_attachment_${saveType}`,
                query: saveType !== "none" ? { tenantId, [saveIdType]: saveIdValue, attachmentName: fileName } :
                    { tenantId, attachmentName: fileName }
            }, transaction)
            // 6. 更新台账/耗材的资产附件数量：
            if (saveType !== 'none' && res3 === 1) {
                // 先查出资产/耗材当前的附件数量,再更新：
                let db_operate_params = {
                    tableName: `tenant_${saveType === 'asset' ? 'asset' : 'asset_material'}`,
                    query: { tenantId: 'hgtech', [saveIdType]: saveIdValue }
                }
                let res_find = await dbOperate.findOne(db_operate_params, transaction);
                // 附上更新数据dataContent：
                db_operate_params.dataContent = { attachmentQty: !res_find.attachmentQty ? 0 : res_find.attachmentQty - 1 };
                let res_update = await dbOperate.update(db_operate_params, transaction)
            }
        })

        ctx.body = { code: 1, message: '删除文件成功' }

        await next();
    } catch (error) {
        let message = error.message;
        if (message.indexOf('no such file or directory')) {
            message = '所删文件不存在！'
        }
        ctx.body = { code: -1, message: '删除文件失败，error: ' + message }
        await next()
    }
}

function verifyDeleteFileReqBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        saveType: Joi.string().valid(...validSaveTypeEnum).required(),
        saveIdType: Joi.string().valid(...validSaveIdTypeEnum).required(),
        saveIdValue: Joi.when('saveIdType', {
            is: Joi.string().valid(...['assetId', 'materialId']),
            then: Joi.string().required()
        }),
        fileName: Joi.string().required(),
    }).unknown();
    const { error } = schema.validate(reqBody);
    if (error) throw new Error(error.message)
}

// 验证文件是否存在：
async function isFileExist(file_path){
    try {
        let res = await fsAsync.stat(file_path)
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = {
    "POST /v1.0/file/upload": handleUploadFile,
    "GET /v1.0/file/download": handleDownloadFile,
    "POST /v1.0/file/delete": handleDeleteFile,
}