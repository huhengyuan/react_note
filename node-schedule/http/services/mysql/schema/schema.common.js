const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const { sequelize, DataTypes } = require('../connect')

// 缓存表的配置信息：
let rules = {};

// 公共字段：
const common_fields = {
    start: {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        tenantId: { type: DataTypes.STRING(20), allowNull: false },
    },
    end: {
        createTime: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('createTime') ? dayjs(this.getDataValue('createTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            allowNull: false,
            defaultValue: new Date(), comment: '创建时间'
        },
        createPerson: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'admin', comment: '创建人' },
        updateTime: {
            type: DataTypes.DATE,
            get() {
                return this.getDataValue('updateTime') ? dayjs(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            }, comment: '更新时间'
        },
        updatePerson: { type: DataTypes.STRING(50), allowNull: true },
        remarks: { type: DataTypes.STRING(200), allowNull: true },
        isDelete: { type: DataTypes.INTEGER, allowNull: true },
    },
    // 单据主表明细公共字段：
    bill_main: {
        billNo: { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
        status: { type: DataTypes.STRING(100), allowNull: true, comment: '单据状态' },
        responsible: { type: DataTypes.STRING(100), allowNull: true, comment: '责任人' },
        qty: { type: DataTypes.STRING(100), allowNull: true, comment: '处理数量' },
        applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人' },
        applyOrgName: { type: DataTypes.STRING(100), allowNull: true, comment: '申请部门' },
    },
    // 单据明细表公共字段
    bill_detail: {
        billNo: { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
        responsible: { type: DataTypes.STRING(100), allowNull: false, comment: '责任人' },
        applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人' },
        applyOrgName: { type: DataTypes.STRING(100), allowNull: true, comment: '申请部门' },
        assetName: { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
        assetId: { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
        spec: { type: DataTypes.STRING(100), allowNull: false, comment: '规格型号' },
        assetAttr: { type: DataTypes.STRING(100), allowNull: false, comment: '资产属性' },
        ownOrg: { type: DataTypes.STRING(100), allowNull: true, comment: '所属部门' },
        outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
    }
}
/**
 * 定义表格的方法
 * @param {*} tableName 指定生成的表名
 * @param {*} _fields 指定配置的私有字段
 * @param {*} config 配置信息：
 * config.indexes 指定索引，类型:[]
 * [{
        unique: true,
        using: 'BTREE',
        name: 'idx_tenantId_tableId_fieldId',
        fields: ['tenantId', 'tableId', 'fieldId']
    }]
 * config.tableDesc 表的描述信息
 * @returns 
 * 
 */
function defineTable(tableName, _fields, config = {}) {
    // 启动服务的时候，缓存表的结构信息：
    saveTableConfigToCache(tableName, {
        ...common_fields.start,
        ..._fields,
        ...common_fields.end
    })
    return sequelize.define(tableName, {
        ...common_fields.start,
        ..._fields,
        ...common_fields.end
    }, {
        initialAutoIncrement: 1,
        timestamps: false,
        tableName,
        indexes: config.indexes,
        comment: config.tableDesc
    })
}

/**
 * 定义视图的方法
 * @param {*} viewName 视图名称
 * @param {*} _fields 视图字段
 * @returns 
 */
function defineView(viewName, _fields) {
    return sequelize.define(viewName, {
        ...common_fields.start,
        ..._fields,
        ...common_fields.end
    })
}

// 缓存表的结构信息：
function saveTableConfigToCache(tableName, tableConfig) {
    rules[tableName] = [];

    Object.keys(tableConfig).forEach(key => {
        let keyConfig = { key, rule: {} };
        Object.keys(tableConfig[key]).forEach(key_config_key => {
            if (key_config_key === 'type') {
                let type_str = tableConfig[key]['type'].toString();
                keyConfig.rule['dataType'] = type_str.indexOf('VARCHAR') !== -1 ? 'string' :
                    (type_str.indexOf('INTEGER') !== -1 ? 'number' :
                        (type_str.indexOf('DATE') !== -1 ? 'datetime' : 'other'))
            }
            if (key_config_key === 'allowNull') {
                keyConfig.rule['required'] = !tableConfig[key]['allowNull']
            }
        })
        rules[tableName].push(keyConfig)
    })
}

// 定时器生成表格的字段配置信息，用于表单导入的验证：
setTimeout(() => {
    fs.writeFile(path.resolve(__dirname, './rules.json'), JSON.stringify(rules), (err) => {
        if (err) {
            return console.log('err: ', err)
        }
        // console.log('生成表格的字段配置信息成功')
        // console.log( require('./rules.json')['tenant_asset'])
        // 成功之后清除缓存：
        rules = {};
    })
}, 5 * 1000)


module.exports = {
    common_fields,
    defineTable,
    defineView
}
