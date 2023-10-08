const Joi = require('Joi');
const dbOperate = require('../services/mysql/dbOperate.js')
/**
 * 创建角色的接口：
 * header: {"access_token": 'xxx'}
 * method: "POST"
 * data 输入参数：
  {
    "tenantId": '',
    "userId": '',
    "role_info": {
      "tenantId": "hgtech",
      "roleId": "",
      "roleName": "",
      "type": "", // 角色只有两种类型，admin, ordinary
      "createPerson": "test",
      "createTime": ""
    },
    "page_list": [{
        "tenantId": "hgtech",
        "roleId": "r001",
        "pageId": "",
        "canAdd": 1,
        "canDelete": 1,
        "canUpdate": 1,
        "canImport": 1,
        "canExport": 1,
        "canUpload": 1,
        "visible": 1,
    }]
  }
 * @param {*} ctx 
 * @param {*} next 
 */
const handleCreateRole = async (ctx, next) => {
    const { tenantId, userId, role_info, page_list } = ctx.request.body;
    try {
        validateCreateUserRequestBody(ctx.request.body)
        let result = await dbOperate.executeTransaction(async transaction => {
            // 1. 先创建角色
            let res1 = await dbOperate.create({
                tableName: 'tenant_role',
                dataContent: role_info
            }, transaction)

            // 2.1 复制一份表格权限字段，并插入至该角色：
            let res_base_tableFields = await dbOperate.findAll({ tableName: 'tenant_table_fields' }, transaction);
            let new_role_table_fields = createNewRoleTableFields(ctx.request.body, res_base_tableFields)
            // 2.2 生成表格权限字段：
            let res3 = await dbOperate.bulkCreate({
                tableName: 'tenant_role_table_fields',
                dataContent: new_role_table_fields
            }, transaction)

            // 3. 保存角色的页面权限表：
            let res_base_pages = await dbOperate.bulkCreate({
                tableName: "tenant_role_page",
                dataContent: page_list
            }, transaction)
        })

        ctx.body = { code: 1, message: '创建角色成功' }
    } catch (error) {
        let message = error.name === 'SequelizeUniqueConstraintError' ?
            `创建角色失败，该角色[${role_info.roleId}]已存在` : error.message;
        // console.log('error--: ', error)
        ctx.body = { code: -1, message }
    }
    await next()
}

// 验证输入参数
function validateCreateUserRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        role_info: Joi.object({
            "tenantId": Joi.ref("tenantId", { ancestor: 2 }),
            "roleId": Joi.string().required(),
            "roleName": Joi.string().required(),
            "type": Joi.string().required(),
            createPerson: Joi.string().required(),
            createTime: Joi.string(),
        }).unknown().required(),
        page_list: Joi.array().items(Joi.object({
            "tenantId": Joi.string().required(),
            "roleId": Joi.string().required(),
            "pageId": Joi.string().required(),
            "canAdd": Joi.number().valid(...[0, 1]).required(),
            "canDelete": Joi.number().valid(...[0, 1]).required(),
            "canUpdate": Joi.number().valid(...[0, 1]).required(),
            "canImport": Joi.number().valid(...[0, 1]).required(),
            "canExport": Joi.number().valid(...[0, 1]).required(),
            "canUpload": Joi.number().valid(...[0, 1]).required(),
            "visible": Joi.number().valid(...[0, 1]).required(),
            createPerson: Joi.string().required(),
            createTime: Joi.string(),
        }).unknown().required()).required().min(1)
    })
    const { error } = schema.validate(reqBody)
    // console.log(error)
    if (error) throw new Error('数据验证失败，error：' + error)
}

/**
 * 生成新角色的表的字段：
 * @param {*} reqBody 
 * @param {*} base_fields_list 基础表字段，分为管理员和非管理员两种：
 */
function createNewRoleTableFields(reqBody, base_fields_list) {
    return base_fields_list.map(fieldObj => {
        fieldObj.roleId = reqBody.role_info.roleId
        fieldObj.canVisible = 1;
        fieldObj.createPerson = reqBody.userId;
        fieldObj.createTime = new Date();

        delete fieldObj.id;
        delete fieldObj.isOnlyAdmin;
        delete fieldObj.updateTime;
        delete fieldObj.updatePerson;

        return fieldObj
    })
}

/**
 * 删除角色的接口：
 * header: {"access_token": 'xxx'}
 * method: "POST"
 * 输入参数：
 {
      "tenantId": "",
      "userId": "",
      "delete_roleId":"",
 }
 * @param {*} ctx 
 * @param {*} next 
 */
const handleDeleteRole = async (ctx, next) => {
    try {
        // 验证请求参数：
        validateDeleteUserRequestBody(ctx.request.body);
        // 获取请求体：
        const { tenantId, userId, delete_roleId } = ctx.request.body;
        // 验证该角色是否存在：
        let res0 = await dbOperate.findOne({
            tableName: "tenant_role",
            query: { tenantId, roleId: delete_roleId }
        })
        if (!res0) throw new Error("该角色不存在，请输入已存在的角色进行删除。")

        // 开始执行请求事务：
        let result = await dbOperate.executeTransaction(async transaction => {
            let res1 = await dbOperate.destroy({
                tableName: 'tenant_role',
                query: { tenantId, roleId: delete_roleId }
            }, transaction);

            let res2 = await dbOperate.destroy({
                tableName: 'tenant_role_table_fields',
                query: { tenantId, roleId: delete_roleId },
            }, transaction)

            let res3 = await dbOperate.destroy({
                tableName: 'tenant_role_page',
                query: { tenantId, roleId: delete_roleId },
            }, transaction)
        })

        ctx.body = { code: 1, message: '删除角色成功' }
    } catch (error) {
        // console.log("error---: ", error)
        ctx.body = { code: -1, message: '删除角色失败，错误：' + error.message }
    }
    await next()
}
/**
 * 验证删除角色的传入参数
 * @param {*} reqBody 
 */
function validateDeleteUserRequestBody(reqBody) {
    const schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        delete_roleId: Joi.string().required(),
    }) // .unknown()
    const { error } = schema.validate(reqBody)
    if (error) throw new Error("数据验证失败，error：" + error.message)

    if (reqBody.userId !== 'admin') throw new Error(`账户：${reqBody.userId} 没有删除角色权限。`)
    if (reqBody.delete_roleId === 'admin') throw new Error(`管理员角色禁止删除。`)
}

/**
 * 更新角色接口：
 * url: /v1.0/role/update
 * header: {"access_token": 'xxx'}
 * method: "post"
  data 输入参数(以下列举的为必填字段)：
{
       "tenantId": '',
       "userId": '',
       "role_info": {
          "tenantId":"",
          "roleId":"",
          "roleName":"",
          "type": "",
          "updatePerson": "",
          "updateTime": "",
          ...
       },
       "page_list": [{
        "tenantId": "hgtech",
        "roleId": "",
        "pageId": "",
        "canAdd": 1,
        "canDelete": 1,
        "canUpdate": 1,
        "canImport": 1,
        "canExport": 1,
        "canUpload": 1,
        "visible": 1,
        "updatePerson":"",
        "updateTime": ""
    }]
}
 */
const handleUpdateRole = async (ctx, next) => {
    try {
        // console.log('reqBody:', ctx.request.body)
        validateUpdateUserRequestBody(ctx.request.body)
        const { tenantId, userId, role_info, page_list } = ctx.request.body;
        let result = await dbOperate.executeTransaction(async transaction => {
            let res1 = await dbOperate.update({
                tableName: 'tenant_role',
                query: { tenantId, roleId: role_info.roleId },
                dataContent: role_info
            }, transaction);

            for (let item of page_list) {
                const { tenantId, roleId, pageId, ...updateContent } = item;
                let res_ = await dbOperate.update({
                    tableName: 'tenant_role_page',
                    query: { tenantId, roleId, pageId },
                    dataContent: updateContent
                }, transaction)
            }
        })
        ctx.body = { code: 1, message: '更新角色成功' }
    } catch (error) {
        ctx.body = { code: -1, message: '更新角色失败，error：' + error.message }
    }
    await next()
}
function validateUpdateUserRequestBody(reqBody) {
    const update_schema = Joi.object({
        tenantId: Joi.string().required(),
        userId: Joi.string().required(),
        role_info: Joi.object({
            "tenantId": Joi.ref("tenantId", { ancestor: 2 }),
            "roleId": Joi.string().required(),
            "roleName": Joi.string().required(),
            "type": Joi.string().required(),
            updatePerson: Joi.string().required(),
            updateTime: Joi.string(),
        }).unknown().required(),
        page_list: Joi.array().items(Joi.object({
            "tenantId": Joi.string().required(),
            "roleId": Joi.string().required(),
            "pageId": Joi.string().required(),
            "canAdd": Joi.number().valid(...[0, 1]).required(),
            "canDelete": Joi.number().valid(...[0, 1]).required(),
            "canUpdate": Joi.number().valid(...[0, 1]).required(),
            "canImport": Joi.number().valid(...[0, 1]).required(),
            "canExport": Joi.number().valid(...[0, 1]).required(),
            "canUpload": Joi.number().valid(...[0, 1]).required(),
            "visible": Joi.number().valid(...[0, 1]).required(),
            updatePerson: Joi.string().required(),
            updateTime: Joi.string(),
        }).unknown().required()).min(1)
    })
    const { error } = update_schema.validate(reqBody);
    if (error) throw new Error(error.message)
}

module.exports = {
    "POST /v1.0/role/create": handleCreateRole,
    "POST /v1.0/role/delete": handleDeleteRole,
    "POST /v1.0/role/update": handleUpdateRole,
}