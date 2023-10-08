const { sequelize, DataTypes } = require('../connect')
const dayjs = require('dayjs')
const { defineTable } = require('./schema.common')

module.exports = {
    tenant: defineTable('tenant', {
        tenantName: { type: DataTypes.STRING(50), allowNull: true, comment: '租户名称，公司名' },
        linkPerson: DataTypes.STRING(50),
        telNo: DataTypes.STRING(50),
    },
        {
            indexes: [{
                unique: true,
                using: 'BTREE',
                name: 'idx_tenantId',
                fields: ['tenantId']
            }]
        }),
    tenant_org: defineTable('tenant_org', {
        orgId: { type: DataTypes.STRING(50), allowNull: false, },
        orgName: { type: DataTypes.STRING(50), allowNull: false, },
        parentId: { type: DataTypes.STRING(20), allowNull: false, },
        level: { type: DataTypes.STRING(20), allowNull: false, },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_orgId',
            fields: ['tenantId', 'orgId']
        }]
    }),
    tenant_role: defineTable('tenant_role', {
        roleId: { type: DataTypes.STRING(50), allowNull: false, },
        roleName: { type: DataTypes.STRING(50), allowNull: false, },
        type: { type: DataTypes.STRING(50), allowNull: false, },
        isOpenMsgBox: {
            type: DataTypes.STRING(20), allowNull: false, defaultValue: 'false'
        }
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_roleId',
            fields: ['tenantId', 'roleId']
        }]
    }),
    tenant_user: defineTable('tenant_user', {
        employeeId: { type: DataTypes.STRING(50), allowNull: false, },
        userId: { type: DataTypes.STRING(50), allowNull: false, },
        password: { type: DataTypes.STRING(50), allowNull: false, },
        roleId: { type: DataTypes.STRING(50), allowNull: false, },
        isAdmin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        status: { type: DataTypes.INTEGER, allowNull: false, },
        latestLoginTime: {
            type: DataTypes.DATE, allowNull: false, defaultValue: new Date(),
            get() {
                return this.getDataValue('latestLoginTime') ? dayjs(this.getDataValue('latestLoginTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
        loginCount: { type: DataTypes.INTEGER, allowNull: false, },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenant_user',
            fields: ['tenantId', 'userId']
        }]
    }
    ),
    tenant_employee: defineTable('tenant_employee', {
        orgId: { type: DataTypes.STRING(50), allowNull: false, },
        employeeId: { type: DataTypes.STRING(50), allowNull: false, },
        employeeName: { type: DataTypes.STRING(50), allowNull: false, },
        telNo: DataTypes.STRING(20),
        email: DataTypes.STRING(50),
        status: { type: DataTypes.STRING(10), allowNull: false, defaultValue: '1', },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_employeeId',
            fields: ['tenantId', 'employeeId']
        }]
    }),
    tenant_page: defineTable('tenant_page', {
        pageId: { type: DataTypes.STRING(50), allowNull: false, },
        pageName: { type: DataTypes.STRING(50), allowNull: false, },
        pageDesc: { type: DataTypes.STRING(50), allowNull: false, },
        parentId: { type: DataTypes.STRING(50), allowNull: false, },
        level: { type: DataTypes.STRING(50), allowNull: false, },
        order: { type: DataTypes.STRING(50), allowNull: false, },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_pageId',
            fields: ['tenantId', 'pageId']
        }]
    }),
    tenant_role_page: defineTable('tenant_role_page', {
        roleId: { type: DataTypes.STRING(50), allowNull: false, },
        pageId: { type: DataTypes.STRING(50), allowNull: false, },
        visible: { type: DataTypes.INTEGER, allowNull: false, },
        canAdd: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有新增权限" },
        canDelete: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有删除权限" },
        canUpdate: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有修改权限" },
        canImport: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有导入权限" },
        canExport: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有导出权限" },
        canUpload: { type: DataTypes.INTEGER, allowNull: false, comment: "是否有上传附件权限" },
        canDeleteAttachment: { type: DataTypes.INTEGER, allowNull: false, comment: "是否拥有删除附件权限" },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_roleId_pageId',
            fields: ['tenantId', 'roleId', 'pageId']
        }],
        tableDesc: "角色页面权限列表"
    }),
    tenant_table_fields: defineTable('tenant_table_fields', {
        tableId: { type: DataTypes.STRING(50), allowNull: false, },
        tableName: { type: DataTypes.STRING(50), allowNull: false, },
        fieldId: { type: DataTypes.STRING(50), allowNull: false, },
        fieldName: { type: DataTypes.STRING(50), allowNull: false, },
        isOnlyAdmin: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        width: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 200, comment: '字段长度' },
        required: { type: DataTypes.STRING(50), allowNull: false, default: 'true' },
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_tableId_fieldId',
            fields: ['tenantId', 'tableId', 'fieldId']
        }]
    }),
    tenant_role_table_fields: defineTable('tenant_role_table_fields', {
        roleId: { type: DataTypes.STRING(50), allowNull: false, },
        tableId: { type: DataTypes.STRING(50), allowNull: false, },
        tableName: { type: DataTypes.STRING(50), allowNull: false, },
        fieldId: { type: DataTypes.STRING(50), allowNull: false, },
        fieldName: { type: DataTypes.STRING(50), allowNull: false, },
        isOpen: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, },
        canVisible: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, },
        order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
        width: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 200, comment: '字段长度' }
    }, {
        indexes: [{
            unique: true,
            using: 'BTREE',
            name: 'idx_tenantId_roleId_tableId_fieldId',
            fields: ['tenantId', 'roleId', 'tableId', 'fieldId']
        }]
    }),
    tenant_asset: defineTable('tenant_asset', {
        "assetId": { type: DataTypes.STRING(50), allowNull: false, comment: '资产编号' },
        "assetName": { type: DataTypes.STRING(50), allowNull: false, comment: '资产名称' },
        "ownOrgName": { type: DataTypes.STRING(50), allowNull: false, comment: '资产部门' },
        "responsible": { type: DataTypes.STRING(50), allowNull: false, comment: '责任人' },
        "warranty": { type: DataTypes.STRING(50), allowNull: false, comment: '保修期' },
        "inFactoryDate": {
            type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), comment: '进厂时间',
            get() {
                return this.getDataValue('inFactoryDate') ? dayjs(this.getDataValue('inFactoryDate')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
        epc: { type: DataTypes.STRING(50), allowNull: true, comment: 'epc' },
        outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
        spec: { type: DataTypes.STRING(50), allowNull: true, comment: '规格型号' },
        status: { type: DataTypes.STRING(50), allowNull: true, comment: '资产状态' },
        maintainType: { type: DataTypes.STRING(50), allowNull: true, comment: '分为A类和B类，新增默认为A类' },
        measureType: { type: DataTypes.STRING(50), allowNull: true, comment: '分为非计量、计量A类、计量B类、计量C类，新增默认为非计量' },
        attachAssetName: { type: DataTypes.STRING(900), allowNull: true, comment: '附属资产' },
        attachAssetId: { type: DataTypes.STRING(900), allowNull: true, comment: '附属资产编号' },
        factoryName: { type: DataTypes.STRING(50), allowNull: true, comment: '所属厂区，即资产位置' },
        initialValue: { type: DataTypes.STRING(50), allowNull: true, comment: '资产原值' },
        durableYears: { type: DataTypes.STRING(50), allowNull: true, comment: '折旧期数' },
        oldNetValue: { type: DataTypes.STRING(50), allowNull: true, comment: '折旧净值' },
        agent: { type: DataTypes.STRING(50), allowNull: true, comment: '代理商' },
        manufacturers: { type: DataTypes.STRING(50), allowNull: true, comment: '制造厂家' },
        purchaseNo: { type: DataTypes.STRING(50), allowNull: true, comment: '采购编号' },
        materialNo: { type: DataTypes.STRING(50), allowNull: true, comment: '资料编号' },
        originZYNo: { type: DataTypes.STRING(50), allowNull: true, comment: '原zy编号' },
        className: { type: DataTypes.STRING(50), allowNull: true, comment: '资产类型' },
        fangchaiAlert: { type: DataTypes.STRING(50), allowNull: true, comment: '资产防拆提醒' },
        isBindMenjin: { type: DataTypes.INTEGER, allowNull: true, comment: '是否绑定门禁' },
        lowVoltage: { type: DataTypes.STRING(50), allowNull: true, comment: '欠压告警，值为：欠压、正常' },
        attachmentQty: { type: DataTypes.INTEGER, allowNull: true, comment: '附件数量', defaultValue: 0 },
    }, {
        indexes: [
            { unique: true, using: 'BTREE', name: 'idx_tenantId_assetId', fields: ['tenantId', 'assetId'] },
            { unique: false, using: 'BTREE', name: 'idx_tenantId_responsible', fields: ['tenantId', 'responsible'] },
            { unique: false, using: 'BTREE', name: 'idx_tenantId_ownOrgName', fields: ['tenantId', 'ownOrgName'] },
        ]
    }),
    tenant_asset_scrap: defineTable('tenant_asset_scrap', {
        "assetId": { type: DataTypes.STRING(50), allowNull: false, comment: '资产编号' },
        assetName: { type: DataTypes.STRING(50), allowNull: true, comment: '资产名称' },
        ownOrgName: { type: DataTypes.STRING(50), allowNull: true, comment: '资产部门' },
        responsible: { type: DataTypes.STRING(50), allowNull: true, comment: '责任人' },
        warranty: { type: DataTypes.STRING(50), allowNull: true, comment: '保修期' },
        inFactoryDate: {
            type: DataTypes.DATE, allowNull: true, defaultValue: new Date(), comment: '进厂时间',
            get() {
                return this.getDataValue('inFactoryDate') ? dayjs(this.getDataValue('inFactoryDate')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
        epc: { type: DataTypes.STRING(50), allowNull: true, comment: 'epc' },
        outFactoryNo: { type: DataTypes.STRING(50), allowNull: true, comment: '出厂编号' },
        spec: { type: DataTypes.STRING(50), allowNull: true, comment: '规格型号' },
        status: { type: DataTypes.STRING(50), allowNull: true, comment: '资产状态' },
        maintainType: { type: DataTypes.STRING(50), allowNull: true, comment: '分为A类和B类，新增默认为A类' },
        measureType: { type: DataTypes.STRING(50), allowNull: true, comment: '分为非计量、计量A类、计量B类、计量C类，新增默认为非计量' },
        attachAssetName: { type: DataTypes.STRING(900), allowNull: true, comment: '附属资产' },
        attachAssetId: { type: DataTypes.STRING(900), allowNull: true, comment: '附属资产编号' },
        factoryName: { type: DataTypes.STRING(50), allowNull: true, comment: '所属厂区，即资产位置' },
        initialValue: { type: DataTypes.STRING(50), allowNull: true, comment: '资产原值' },
        durableYears: { type: DataTypes.STRING(50), allowNull: true, comment: '折旧期数' },
        oldNetValue: { type: DataTypes.STRING(50), allowNull: true, comment: '折旧净值' },
        agent: { type: DataTypes.STRING(50), allowNull: true, comment: '代理商' },
        manufacturers: { type: DataTypes.STRING(50), allowNull: true, comment: '制造厂家' },
        purchaseNo: { type: DataTypes.STRING(50), allowNull: true, comment: '采购编号' },
        materialNo: { type: DataTypes.STRING(50), allowNull: true, comment: '资料编号' },
        originZYNo: { type: DataTypes.STRING(50), allowNull: true, comment: '原zy编号' },
        className: { type: DataTypes.STRING(50), allowNull: true, comment: '资产类型' },
        fangchaiAlert: { type: DataTypes.STRING(50), allowNull: true, comment: '资产防拆提醒' },
        isBindMenjin: { type: DataTypes.INTEGER, allowNull: true, comment: '是否绑定门禁' },
        lowVoltage: { type: DataTypes.STRING(50), allowNull: true, comment: '欠压告警，值为：欠压、正常' },
        attachmentQty: { type: DataTypes.INTEGER, allowNull: true, comment: '附件数量' },
        applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人,即处置责任人' },
        disposalMoney: { type: DataTypes.STRING(100), allowNull: true, comment: '处置金额' },
        suggestion: { type: DataTypes.STRING(1000), allowNull: true, comment: '闲置处理意见' },
    }, {
        tableDesc: "资产报废的暂存资产台账信息，用于报废明细查询时关联之用",
        indexes: [
            { unique: true, using: 'BTREE', name: 'idx_tenantId_assetId', fields: ['tenantId', 'assetId'] },
        ]
    }),
    tenant_asset_class: defineTable('tenant_asset_class', {
        classId: { type: DataTypes.STRING(50), allowNull: false, },
        className: { type: DataTypes.STRING(50), allowNull: false, },
        parentId: { type: DataTypes.STRING(50), allowNull: false, },
    }, {
        tableDesc: "资产分类表"
    }),
    tenant_asset_bind_menjin: defineTable('tenant_asset_bind_menjin', {
        assetId: { type: DataTypes.STRING(50), allowNull: false, },
        sensorId: { type: DataTypes.STRING(50), allowNull: false, },
        expiredTime: {
            type: DataTypes.DATE, allowNull: false, comment: '过期时间',
            get() {
                return this.getDataValue('expiredTime') ? dayjs(this.getDataValue('expiredTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            }
        },
    }, {
        tableDesc: "资产关联门禁设备列表"
    }),
    tenant_attachment_asset: defineTable('tenant_attachment_asset', {
        assetId: { type: DataTypes.STRING(50), allowNull: false, comment: '资产编号' },
        attachmentName: { type: DataTypes.STRING(200), allowNull: false, comment: "附件名称" },
        attachmentId: { type: DataTypes.STRING(200), allowNull: true, comment: "附件ID" },
        operateType: { type: DataTypes.STRING(50), allowNull: true, comment: "附件的业务来源" },
    }, {
        tableDesc: "资产所属附件表"
    }),
    tenant_attachment_material: defineTable('tenant_attachment_material', {
        materialId: { type: DataTypes.STRING(50), allowNull: false, comment: '资产编号' },
        attachmentName: { type: DataTypes.STRING(200), allowNull: false, comment: "附件名称" },
        attachmentId: { type: DataTypes.STRING(200), allowNull: true, comment: "附件ID" },
        operateType: { type: DataTypes.STRING(50), allowNull: true, comment: "附件的业务来源" },
    }, {
        tableDesc: "计量耗材所属附件"
    }),
    tenant_attachment_none: defineTable('tenant_attachment_none', {
        attachmentName: { type: DataTypes.STRING(200), allowNull: false, comment: "附件名称" },
    }, {
        tableDesc: "其他未知归属的附件表"
    }),
    tenant_factory: defineTable('tenant_factory', {
        factoryId: { type: DataTypes.STRING(50), allowNull: false, comment: '厂区编号' },
        factoryName: { type: DataTypes.STRING(50), allowNull: false, comment: '厂区名称' },
    }, { tableDesc: '厂区管理' }),
    tenant_sensor: defineTable('tenant_sensor', {
        sensorId: { type: DataTypes.STRING(50), allowNull: false, comment: '信息机编号' },
        sensorName: { type: DataTypes.STRING(50), allowNull: false, comment: '信息机名称' },
        sensorType: { type: DataTypes.STRING(50), allowNull: false, comment: '信息机类型，盘点或门禁' },
        status: { type: DataTypes.STRING(50), allowNull: false, comment: '信息机在线状态' },
        factoryId: { type: DataTypes.STRING(50), allowNull: false, comment: '所属厂区ID' },
    }, { tableDesc: '信息机-门禁设备管理' }),
    // 计量物料基础表：
    tenant_asset_material: defineTable('tenant_asset_material', {
        "materialId": { type: DataTypes.STRING(50), allowNull: false, comment: '物料编号' },
        "materialName": { type: DataTypes.STRING(50), allowNull: false, comment: '物料名称' },
        spec: { type: DataTypes.STRING(100), allowNull: true, comment: '规格型号' },
        assetAttr: { type: DataTypes.STRING(100), allowNull: true, comment: '资产属性' },
        "responsible": { type: DataTypes.STRING(50), allowNull: false, comment: '责任人' },
        "ownOrgName": { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
        applyPerson: { type: DataTypes.STRING(100), allowNull: true, comment: '申请人,计量责任人' },

        "measureType": { type: DataTypes.STRING(100), allowNull: false, comment: '计量类型' },
        "correctTime": { type: DataTypes.STRING(50), allowNull: false, comment: '本次校正日期', },
        correctResult: { type: DataTypes.STRING(1000), allowNull: true, comment: '校准结果' },
        nextCorrectTime: { type: DataTypes.STRING(50), allowNull: true, comment: '下次校正日期', },
        period: { type: DataTypes.STRING(100), allowNull: true, comment: '周期' },
        correctBie: { type: DataTypes.STRING(100), allowNull: true, comment: '校正别' },
        status: { type: DataTypes.STRING(50), allowNull: true, comment: '资产状态' },
    }, {
        tableDesc: '计量设备管理',
        indexes: [
            { unique: true, using: 'BTREE', name: 'idx_tenantId_materialId', fields: ['tenantId', 'materialId'] },
        ]
    }),
    tenant_pandian_main: defineTable('tenant_pandian_main', {
        billNo: { type: DataTypes.STRING(50), allowNull: false, comment: '盘点单号' },
        pdTime: {
            type: DataTypes.DATE, allowNull: false, comment: '盘点时间',
            get() {
                return this.getDataValue('pdTime') ? dayjs(this.getDataValue('pdTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
        shouldQty: { type: DataTypes.INTEGER, allowNull: false, comment: '应盘数量' },
        lessQty: { type: DataTypes.INTEGER, allowNull: false, comment: '盘亏数量' },
        moreQty: { type: DataTypes.INTEGER, allowNull: false, comment: '盘盈数量' },
        nobindQty: { type: DataTypes.INTEGER, allowNull: false, comment: '无epc数量' },
    }, { tableDesc: '盘点主表' }),
    tenant_pandian_detail: defineTable('tenant_pandian_detail', {
        billNo: { type: DataTypes.STRING(50), allowNull: false, comment: '盘点单号' },
        detailType: { type: DataTypes.STRING(50), allowNull: false, comment: '盘点明细类型' },
        assetId: { type: DataTypes.STRING(100), allowNull: true, comment: '资产编号' },
        sensorId: { type: DataTypes.STRING(100), allowNull: false, comment: '标签读取器' },
        epc: { type: DataTypes.STRING(100), allowNull: false, comment: '有源标签编号' },
        pdTime: {
            type: DataTypes.DATE, allowNull: false, comment: '盘点时间',
            get() {
                return this.getDataValue('pdTime') ? dayjs(this.getDataValue('pdTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
    }, { tableDesc: '盘点明细，一个盘点单据包括应盘数量、盘盈、盘亏、无epc数量等4种明细' }),
    tenant_alarm_log: defineTable('tenant_alarm_log', {
        alarmType: { type: DataTypes.STRING(50), allowNull: false, comment: '报警类型' },
        alarmTime: {
            type: DataTypes.DATE, allowNull: false, comment: '报警时间',
            get() {
                return this.getDataValue('alarmTime') ? dayjs(this.getDataValue('alarmTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
        epc: { type: DataTypes.STRING(2000), allowNull: true, comment: 'epc' },
        sensorId: { type: DataTypes.STRING(100), allowNull: false, comment: '标签读取器' },
    }, { tableDesc: '资产报警明细' }),
    tenant_email_control: defineTable('tenant_email_control', {
        alertType: { type: DataTypes.STRING(50), allowNull: false, comment: '邮件提醒类型，设备维护，计量设备、计量物料' },
        isOpen: { type: DataTypes.INTEGER, allowNull: false, comment: '邮件提醒是否开启，0=关闭，1=开启' },
    }, { tableDesc: '邮件提醒控制表' }),
    tenant_sys_warn: defineTable('tenant_sys_warn', {
        isRead: { type: DataTypes.NUMBER, allowNull: false, comment: '消息是否已读' },
        warnType: { type: DataTypes.STRING(50), allowNull: false, comment: '消息类型' },
        factoryId: { type: DataTypes.STRING(50), allowNull: true, comment: '厂区编号' },
        factoryName: { type: DataTypes.STRING(50), allowNull: true, comment: '厂区名称' },
        sensorId: { type: DataTypes.STRING(50), allowNull: true, comment: '信息机编号' },
        sensorName: { type: DataTypes.STRING(50), allowNull: true, comment: '信息机名称' },
        "assetId": { type: DataTypes.STRING(50), allowNull: true, comment: '资产编号' },
        "assetName": { type: DataTypes.STRING(50), allowNull: true, comment: '资产名称' },
        warnTime: {
            type: DataTypes.DATE, allowNull: false, comment: '报警时间',
            get() {
                return this.getDataValue('warnTime') ? dayjs(this.getDataValue('warnTime')).format('YYYY-MM-DD HH:mm:ss') : ''
            },
        },
    }, { tableDesc: '首页消息提醒列表' }),
    tenant_report_every_month_bill_data_cache: defineTable('tenant_report_every_month_bill_data_cache', {
        dimension: { type: DataTypes.STRING(100), allowNull: false, comment: '维度' },
        dValue: { type: DataTypes.STRING(100), allowNull: false, comment: '维度的值' },
        source: { type: DataTypes.STRING(100), allowNull: false, comment: '数据来源于哪些业务单据' },
        billType: { type: DataTypes.STRING(100), allowNull: false, comment: '主业务单据分类' },
        year: { type: DataTypes.STRING(100), allowNull: false, comment: '年' },
        month: { type: DataTypes.STRING(100), allowNull: false, comment: '月' },
        qty: { type: DataTypes.INTEGER, allowNull: false, comment: '数量' },
    }, { tableDesc: '每月存储的各项台账及业务单据的历史数据' }),
    tenant_report_month_year_statistics: defineTable('tenant_report_month_year_statistics', {
        ownOrgName: { type: DataTypes.STRING(100), allowNull: false, comment: '所属部门' },
        source: { type: DataTypes.STRING(100), allowNull: false, comment: '数据来源于哪些业务单据' },
        billType: { type: DataTypes.STRING(100), allowNull: false, comment: '主业务单据分类' },
        year: { type: DataTypes.STRING(100), allowNull: false, comment: '年' },
        month: { type: DataTypes.STRING(100), allowNull: false, comment: '月' },
        qty: { type: DataTypes.INTEGER, allowNull: false, comment: '数量' },
    }, { tableDesc: '每月存储的上个月的统计汇总数据' })
}

// sequelize.sync()