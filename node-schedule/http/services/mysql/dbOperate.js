const { Transaction, Op } = require('sequelize')
const { sequelize } = require('./connect')
const schema = require('./schema');

/**
 * 所有的普通方法，
 * 第一个参数为普通参数的对象集，
 * 第二个参数为事务操作的钩子：
 * 参数解析：
     {
         tableName: '', //表名
         query: {}, // 查询对象，要是key的值为数组，则默认启用 slq in 的 方式查询
         dataContent: {}/[]  // 指定更新或者新增的数据体，单个新增或更新用{}，多个则用[]
         fields: ['id','name'], //指定输出的字段
         pageNum: 1, 分页页码
         pageSize: 1, 分页尺寸
         updateOnDuplicate: [key,key1,] // 当批量插入的数据发生重复时，指定是否进行对应重复数据的更新，以及需要进行更新的字段：
     }
 */
module.exports = {
    /**
     * @param {*} params 封装所有的操作参数
     * @param {*} transaction 传入事务操作钩子
     * @returns 
     */
    findAll: async (params, transaction) => {
        const { tableName, query, fields, pageNum, pageSize } = params;
        let data, total;
        if (pageNum && pageSize) {
            let { count, rows } = await schema[tableName].findAndCountAll({
                attributes: fields,
                where: query,
                offset: (pageNum - 1) * pageSize,
                limit: pageSize,
                transaction: transaction
            })
            data = rows;
            total = count;
        } else {
            data = await schema[tableName].findAll({
                attributes: fields,
                where: query,
                order: [['createTime','desc']],
                transaction: transaction
            })
        }
        data = JSON.parse(JSON.stringify(data))
        return total ? { data, total } : data
    },
    findOne: async (params, transaction) => {
        const { tableName, query, fields } = params;
        let dataObj = await schema[tableName].findOne({
            attributes: fields,
            where: query,
            transaction: transaction
        })
        return dataObj && dataObj.dataValues ? dataObj.dataValues : dataObj
    },
    create: async (params, transaction) => {
        const { tableName, dataContent } = params;
        return await schema[tableName].create(dataContent, { transaction: transaction });
    },
    // 批量插入操作，重复的数据则更新
    bulkCreate: async (params, transaction) => {
        const { tableName, dataContent, updateOnDuplicate } = params;
        return await schema[tableName].bulkCreate(dataContent, { updateOnDuplicate, transaction });
    },
    destroy: async (params, transaction) => {
        const { tableName, query } = params;
        Object.keys(query).map(key => {
            if (Array.isArray(query[key])) {
                query[key] = { [Op.in]: query[key] }
            }
        })
        return await schema[tableName].destroy({
            where: query,
            transaction: transaction
        })
    },
    update: async (params, transaction) => {
        const { tableName, query, dataContent } = params;
        return await schema[tableName].update(dataContent, {
            where: query
        }, { transaction: transaction })
    },
    // 注意：sequalize对于带有值的方法（例如：create、update），传入transaction，应该传递给第二个参数，其余的第一个参数即可
    executeTransaction: async (callback) => {
        return await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED }, async t => {
            await callback(t)
        });
    }
}

// sequelize.sync()