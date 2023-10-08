const { sequelize, DataTypes } = require('../connect')
const dayjs = require('dayjs')
const { defineTable, common_fields } = require('./schema.common')

/**
 * 单据相关的表的定义：
 */
module.exports = {
    // 设备进厂
    tenant_bill_in_factory_main: defineTable('tenant_bill_in_factory_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备进厂单据主表' }
    ),
    tenant_bill_in_factory_detail: defineTable('tenant_bill_in_factory_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetId": { type: DataTypes.STRING(50), allowNull: false, comment: '资产编号' },
            "assetName": { type: DataTypes.STRING(50), allowNull: false, comment: '资产名称' },
            "ownOrgName": { type: DataTypes.STRING(50), allowNull: false, comment: '资产部门' },
            "responsible": { type: DataTypes.STRING(50), allowNull: false, comment: '责任人' },
            "warranty": { type: DataTypes.STRING(50), allowNull: false, comment: '保修期' },
            "outFactoryNo": { type: DataTypes.STRING(50), allowNull: false, comment: '出厂编号' },
            "inFactoryDate": {
                type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), comment: '进厂时间',
                get() {
                    return this.getDataValue('inFactoryDate') ? dayjs(this.getDataValue('inFactoryDate')).format('YYYY-MM-DD HH:mm:ss') : ''
                },
            },
            "factoryName": { type: DataTypes.STRING(50), allowNull: false, comment: '所属厂区，即资产位置' },
            acceptPeriod: { type: DataTypes.INTEGER, allowNull: true, comment: '验收周期', },
            assetAttr: { type: DataTypes.STRING(100), allowNull: true, comment: '资产属性' },
            contractNo: { type: DataTypes.STRING(100), allowNull: true, comment: '合同号' },
            spec: { type: DataTypes.STRING(50), allowNull: true, comment: '规格型号' },
            initialValue: { type: DataTypes.STRING(50), allowNull: true, comment: '资产原值' },
            purchaseNo: { type: DataTypes.STRING(50), allowNull: true, comment: '采购编号' },
            agent: { type: DataTypes.STRING(50), allowNull: true, comment: '代理商' },
            manufacturers: { type: DataTypes.STRING(50), allowNull: true, comment: '制造厂家' },
            temporaryEquipmentReturnDate: { type: DataTypes.STRING(50), allowNull: true, comment: '临时设备计划退还日期', },
            epc: { type: DataTypes.STRING(100), allowNull: true, comment: 'epc', },
        },
        {
            tableDesc: '设备进厂单据明细表',
            indexes: [
                { unique: true, using: 'BTREE', name: 'idx_tenantId_billNo_assetId', fields: ['tenantId', 'billNo', 'assetId'] },
            ]
        }
    ),
    // 设备验收
    tenant_bill_acceptance_main: defineTable('tenant_bill_acceptance_main',
        {
            ...common_fields.bill_main
        },
        { tableDesc: '设备验收单据主表' }
    ),
    tenant_bill_acceptance_detail: defineTable('tenant_bill_acceptance_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            "ownOrgName": { type: DataTypes.STRING(100), allowNull: true, comment: '所属部门' },
            "responsible": { type: DataTypes.STRING(50), allowNull: false, comment: '责任人' },
            "applyPerson": { type: DataTypes.STRING(100), allowNull: false, comment: '验收责任人' },
            assetAttr: { type: DataTypes.STRING(100), allowNull: true, comment: '资产属性' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            targetPurchaseNo: { type: DataTypes.STRING(100), allowNull: true, comment: '采购编号' },
            "factoryName": { type: DataTypes.STRING(50), allowNull: false, comment: '所属厂区，即资产位置' },
            startTime: { type: DataTypes.STRING(50), allowNull: true, comment: '验收开始时间', },
            endTime: { type: DataTypes.STRING(50), allowNull: true, comment: '验收完成时间', },
            planTime: { type: DataTypes.STRING(50), allowNull: true, comment: '验收计划时间', },
            acceptStatus: { type: DataTypes.STRING(50), allowNull: true, comment: '验收状态' }
        },
        { tableDesc: '设备验收单据明细表' }
    ),
    // 设备维修:
    tenant_bill_repair_main: defineTable('tenant_bill_repair_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备维修单据主表' }
    ),
    tenant_bill_repair_detail: defineTable('tenant_bill_repair_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(50), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            manufacturers: { type: DataTypes.STRING(50), allowNull: true, comment: '制造厂家' },
            "ownOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
            assetAttr: { type: DataTypes.STRING(100), allowNull: true, comment: '资产属性即资产类型' },
            "applyPerson": { type: DataTypes.STRING(100), allowNull: false, comment: '维修责任人' },

            faultType: { type: DataTypes.STRING(100), allowNull: true, comment: '故障类别' },
            "startTime": {
                type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), comment: '维修发起时间',
                get() {
                    return this.getDataValue('startTime') ? dayjs(this.getDataValue('startTime')).format('YYYY-MM-DD HH:mm:ss') : ''
                },
            },
            endTime: { type: DataTypes.STRING(50), allowNull: true, comment: '维修完成时间', },
            "faultPhenomenon": { type: DataTypes.STRING(100), allowNull: false, comment: '故障现象', },
            "repairPosition": { type: DataTypes.STRING(100), allowNull: false, comment: '内修/外修', },
            faultReason: { type: DataTypes.STRING(100), allowNull: true, comment: '故障原因', },
            outRepairUnit: { type: DataTypes.STRING(100), allowNull: true, comment: '外修单位', },
            expectReturnDate: {
                type: DataTypes.DATE, allowNull: true, defaultValue: new Date(), comment: '预计返厂时间',
                get() {
                    return this.getDataValue('expectReturnDate') ? dayjs(this.getDataValue('expectReturnDate')).format('YYYY-MM-DD HH:mm:ss') : ''
                },
            },
        },
        { tableDesc: '设备维修单据明细表' }
    ),
    // 设备维护:
    tenant_bill_maintain_main: defineTable('tenant_bill_maintain_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备维护单据主表' }
    ),
    tenant_bill_maintain_detail: defineTable('tenant_bill_maintain_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            "ownOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
            applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '维护责任人' },
            maintainTime: { type: DataTypes.STRING(50), allowNull: true, comment: '维护时间', },
            nextMaintainTime: { type: DataTypes.STRING(50), allowNull: true, comment: '下次维护时间', },
            period: { type: DataTypes.STRING(100), allowNull: true, },
            maintainContent: { type: DataTypes.STRING(1000), allowNull: true, },
        },
        {
            tableDesc: '设备维护单据明细表',
            indexes: [
                { unique: true, using: 'BTREE', name: 'idx_tenantId_billNo_assetId', fields: ['tenantId', 'billNo', 'assetId'] },
            ]
        }
    ),
    // 设备转移：
    tenant_bill_transfer_main: defineTable('tenant_bill_transfer_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备转移单据主表' }
    ),
    tenant_bill_transfer_detail: defineTable('tenant_bill_transfer_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            ownOrgName: { type: DataTypes.STRING(100), allowNull: true, comment: '所属部门即资产原部门' },
            applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人' },
            "receiveOrg": { type: DataTypes.STRING(100), allowNull: false, comment: '接收部门' },
            "receiveResponsible": { type: DataTypes.STRING(100), allowNull: false, comment: '接收责任人' },
            "receiveFactoryName": { type: DataTypes.STRING(100), allowNull: false, comment: '接收厂区' },
        },
        { tableDesc: '设备转移单据明细表' }
    ),
    // 设备借出：
    tenant_bill_lend_main: defineTable('tenant_bill_lend_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备借出单据主表' }
    ),
    tenant_bill_lend_detail: defineTable('tenant_bill_lend_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            "lendResponsible": { type: DataTypes.STRING(50), allowNull: false, comment: '资产借用责任人' },
            "lendFactory": { type: DataTypes.STRING(100), allowNull: false, comment: '资产借用厂区' },
            "applyPerson": { type: DataTypes.STRING(100), allowNull: false, comment: '申请人' },
            "applyOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '申请部门' },
            "startTime": { type: DataTypes.STRING(50), allowNull: false, comment: '转借发起时间', },
            "endTime": { type: DataTypes.STRING(50), allowNull: false, comment: '转借到期时间', },
        },
        { tableDesc: '设备借出单据明细表' }
    ),
    tenant_bill_return_detail: defineTable('tenant_bill_return_detail',
        {
            ...common_fields.bill_detail,
            returnTime: { type: DataTypes.STRING(50), allowNull: false, comment: '归还时间', },
            returnOrg: { type: DataTypes.STRING(1000), allowNull: false, comment: '设备归还部门' }
        },
        { tableDesc: '设备归还单据明细表' }
    ),
    // 设备计量：
    tenant_bill_measure_main: defineTable('tenant_bill_measure_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备计量单据主表' }
    ),
    tenant_bill_measure_detail: defineTable('tenant_bill_measure_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            assetAttr: { type: DataTypes.STRING(100), allowNull: true, comment: '资产属性' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            "responsible": { type: DataTypes.STRING(50), allowNull: false, comment: '责任人' },
            "ownOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
            applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人' },

            "measureType": { type: DataTypes.STRING(100), allowNull: false, comment: '计量类型' },
            "correctTime": { type: DataTypes.STRING(50), allowNull: false, comment: '本次校正日期', },
            correctResult: { type: DataTypes.STRING(1000), allowNull: true, comment: '校准结果' },
            nextCorrectTime: { type: DataTypes.STRING(50), allowNull: true, comment: '下次校正日期', },
            period: { type: DataTypes.STRING(100), allowNull: true, comment: '周期' },
            correctBie: { type: DataTypes.STRING(100), allowNull: true, comment: '校正别' },
        },
        {
            tableDesc: '设备计量单据明细表',
            indexes: [
                { unique: true, using: 'BTREE', name: 'idx_tenantId_billNo_assetId', fields: ['tenantId', 'billNo', 'assetId'] },
            ]
        }
    ),
    // 设备闲置处理：
    tenant_bill_unuse_main: defineTable('tenant_bill_unuse_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备闲置单据主表' }
    ),
    tenant_bill_unuse_detail: defineTable('tenant_bill_unuse_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            status: { type: DataTypes.STRING(50), allowNull: true, comment: '资产状态' },
            "applyPerson": { type: DataTypes.STRING(100), allowNull: false, comment: '申请人' },
            "applyOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '申请部门' },

            inFactoryYear: { type: DataTypes.STRING(100), allowNull: true, comment: '到厂年限' },
            suggestion: { type: DataTypes.STRING(1000), allowNull: true, comment: '闲置处理意见' }
        },
        { tableDesc: '设备闲置单据明细表' }
    ),
    // 设备报废处理：
    tenant_bill_scrap_main: defineTable('tenant_bill_scrap_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备报废单据主表' }
    ),
    tenant_bill_scrap_detail: defineTable('tenant_bill_scrap_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            "ownOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
            applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人,即处置责任人' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            status: { type: DataTypes.STRING(50), allowNull: true, comment: '资产状态' },

            initialValue: { type: DataTypes.STRING(100), allowNull: true, comment: '资产原值' },
            oldNetValue: { type: DataTypes.STRING(100), allowNull: true, comment: '资产净值' },
            disposalMoney: { type: DataTypes.STRING(100), allowNull: true, comment: '处置金额' },
            suggestion: { type: DataTypes.STRING(1000), allowNull: true, comment: '闲置处理意见' }
        },
        { tableDesc: '设备报废单据明细表' }
    ),
    // 设备出厂：
    tenant_bill_leave_factory_main: defineTable('tenant_bill_leave_factory_main',
        {
            ...common_fields.bill_main,
        },
        { tableDesc: '设备出厂单据主表' }
    ),
    tenant_bill_leave_factory_detail: defineTable('tenant_bill_leave_factory_detail',
        {
            "billNo": { type: DataTypes.STRING(100), allowNull: false, comment: '单据编号' },
            "assetName": { type: DataTypes.STRING(100), allowNull: false, comment: '资产名称' },
            "assetId": { type: DataTypes.STRING(100), allowNull: false, comment: '资产编号' },
            spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
            outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
            "applyPerson": { type: DataTypes.STRING(100), allowNull: false, comment: '申请人' },
            "applyOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '申请部门' },
            "leaveTime": { type: DataTypes.STRING(50), allowNull: false, comment: '出厂时间', },
            expectReturnTime: { type: DataTypes.STRING(100), allowNull: true, comment: '预计返厂时间', },
        },
        { tableDesc: '设备出厂单据明细表' }
    ),
}

// sequelize.sync()