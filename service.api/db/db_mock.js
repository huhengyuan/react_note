/**
 * 模拟数据，根据数据库结构模拟，生成本地演示数据集合
 */
var db_mock = {
    common: {
        comment: "所有表中的公用数据字段",
        fields: {
            id: { desc: "自增序列号", type: "int", notNull: true },
            tenantId: { desc: "租户编号", type: "string", length: 20, notNull: true, },
            createPerson: { desc: "创建人", type: "string", length: 20, notNull: true },
            createTime: { desc: "创建时间", type: "dateTime", notNull: true },
            updatePerson: { desc: "更新人", type: "string", length: 20, notNull: true },
            updateTime: { desc: "更新时间", type: "dateTime", notNull: true },
            remarks: { desc: "备注", type: "string", length: 200, notNull: false }
        },
    },
    tenant:
    {
        comment: "租户列表",
        fields: {
            tenantName: { desc: "租户名称", type: "string", length: 50, notNull: true },
            tenantAddress: { desc: "租户地址", type: "string", length: 50, notNull: true },
            linkPerson: { desc: "联系人", type: "string", length: 20, notNull: false },
            telNo: { desc: "联系电话", type: "string", length: 20, notNull: false },
            email: { desc: "邮箱", type: "string", length: 50, notNull: false }
        },
        unqiue: ["tenantId"],
        data: [
            {
                tenantId: "supoin", tenantName: "销邦科技",
                tenantAddress: "深圳市福田区英龙大厦26层", linkPerson: "及东兴", telNo: "18810172121"
            },
            {
                tenantId: "supdatas", tenantName: "销邦数据",
                tenantAddress: "深圳市福田区英龙大厦19层", linkPerson: "张治金", telNo: "13826598771"
            },
        ]
    },
    tenant_org:
    {
        comment: "租户组织机构",
        fields: {
            orgId: { desc: "组织编号", type: "string", length: 20, notNull: true },
            parentId: { desc: "上级组织编号", type: "string", length: 20, notNull: true },
            orgName: { desc: "组织名称", type: "string", length: 50, notNull: true },
            orgLevel: { desc: "组织级别", type: "int", notNull: true }
        },
        unqiue: ["tenantId", "orgId"],
        data:
            [
                { tenantId: "supoin", orgId: "supoin01", parentId: "0", orgName: "销邦科技", orgLevel: 0 },
                { tenantId: "supoin", orgId: "supoin0101", parentId: "supoin01", orgName: "研发中心", orgLevel: 0 },
                { tenantId: "supoin", orgId: "supoin0102", parentId: "supoin01", orgName: "产品中心", orgLevel: 0 },
                { tenantId: "supdatas", orgId: "supdatas01", parentId: "0", orgName: "销邦数据", orgLevel: 0 },
                { tenantId: "supdatas", orgId: "supdatas0101", parentId: "supdatas01", orgName: "项目部", orgLevel: 0 },
                { tenantId: "supdatas", orgId: "supdatas0102", parentId: "ssupdatas01", orgName: "方案中心", orgLevel: 0 },
            ]
    },
    tenant_user:
    {
        comment: "租户用户列表",
        fields: {
            orgId: { desc: "组织编号", type: "string", length: 20, notNull: true },
            userId: { desc: "用户编号", type: "string", length: 20, notNull: true },
            userName: { desc: "用户名称", type: "string", length: 50, notNull: true },
            password: { desc: "用户密码", type: "string", length: 50, notNull: true },
            status: { desc: "用户状态", type: "int", notNull: true, default: 0 },
            telNo: { desc: "电话号码", type: "string", length: 20, notNull: false },
            email: { desc: "邮箱", type: "string", length: 50, notNull: false }
        },
        unqiue: ["userId"],
        data:
            [
                { tenantId: "supoin", orgId: "supoin01", userId: "admin_supoin01", userName: "系统管理员", password: 123456 },
                { tenantId: "supoin", orgId: "supoin0101", userId: "admin_supoin0101", userName: "研发中心管理员", password: 123456 },
                { tenantId: "supdatas", orgId: "supdatas01", userId: "admin_supdatas01", userName: "系统管理员", password: 123456 },
                { tenantId: "supdatas", orgId: "supdatas0102", userId: "admin_supdatas0102", userName: "方案中心管理员", password: 123456 },
            ]
    },
    tenant_page:
    {
        comment: "页面集合",
        fields: {
            pageId: { desc: "页面编号", type: "string", length: 20, notNull: true },
            parentId: { desc: "父页面编号", type: "string", length: 20, notNull: true },
            pageName: { desc: "页面名称", type: "string", length: 20, notNull: true },
            pageDesc: { desc: "页面文字描述", type: "string", length: 50, notNull: true },
            showIndex: { desc: "显示顺序", type: "int", notNull: true, default: 0 },
            componentName: { desc: "组件名称", type: "string", length: 80, notNull: true },
            icon: { desc: "图标名称", type: "string", length: 50, notNull: false },
            status: { desc: "菜单状态", type: "int", notNull: true, default: 1 }
        },
        unqiue: ["tenantId", "pageId"],
        data: [
            {
                tenantId: "supoin", pageId: 1, parentId: 0,
                pageName: "AssetsList", pageDesc: "资产列表", showIndex: 1,
                componentName: "AssetsList", icon: "List", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 2, parentId: 0,
                pageName: "DestributeAndCancelStock", pageDesc: "派发退库", showIndex: 2,
                componentName: "DestributeAndCancelStock", icon: "ExitToApp", status: 1, createPerson: "admin"
            },

            {
                tenantId: "supoin", pageId: 3, parentId: 0,
                pageName: "LendAndReturn", pageDesc: "借出归还", showIndex: 3,
                componentName: "LendAndReturn", icon: "PanTool", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 4, parentId: 0,
                pageName: "InventoryManager", pageDesc: "盘点管理", showIndex: 5,
                componentName: "InventoryManager", icon: "FindInPage", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 5, parentId: 0,
                pageName: "MaintainManager", pageDesc: "维修管理", showIndex: 5,
                componentName: "MaintainManager", icon: "Settings", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 6, parentId: 0,
                pageName: "MaintainManager", pageDesc: "维修管理", showIndex: 6,
                componentName: "MaintainManager", icon: "Settings", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 7, parentId: 0,
                pageName: "ScrapManager", pageDesc: "处置管理", showIndex: 7,
                componentName: "ScrapManager", icon: "RestoreFromTrash", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 8, parentId: 0,
                pageName: "Statement", pageDesc: "报表", showIndex: 8,
                componentName: "", icon: "Assessment", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 9, parentId: 8,
                pageName: "AssetSummaryQuery", pageDesc: "资产汇总查询", showIndex: 9,
                componentName: "AssetSummaryQuery", icon: "Search", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 10, parentId: 8,
                pageName: "AssetRecord", pageDesc: "资产履历", showIndex: 10,
                componentName: "AssetRecord", icon: "FeaturedPlayList", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 11, parentId: 0,
                pageName: "AssetClass", pageDesc: "资产分类", showIndex: 11,
                componentName: "AssetClass", icon: "Class", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", pageId: 12, parentId: 0,
                pageName: "PlaceManager", pageDesc: "资产位置", showIndex: 7,
                componentName: "PlaceManager", icon: "Place", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 1, parentId: 0,
                pageName: "AssetsList", pageDesc: "资产列表", showIndex: 1,
                componentName: "AssetsList", icon: "List", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 2, parentId: 0,
                pageName: "DestributeAndCancelStock", pageDesc: "派发退库", showIndex: 2,
                componentName: "DestributeAndCancelStock", icon: "ExitToApp", status: 1, createPerson: "admin"
            },

            {
                tenantId: "supdatas", pageId: 3, parentId: 0,
                pageName: "LendAndReturn", pageDesc: "借出归还", showIndex: 3,
                componentName: "LendAndReturn", icon: "PanTool", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 4, parentId: 0,
                pageName: "InventoryManager", pageDesc: "盘点管理", showIndex: 5,
                componentName: "InventoryManager", icon: "FindInPage", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 5, parentId: 0,
                pageName: "MaintainManager", pageDesc: "维修管理", showIndex: 5,
                componentName: "MaintainManager", icon: "Settings", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 6, parentId: 0,
                pageName: "MaintainManager", pageDesc: "维修管理", showIndex: 6,
                componentName: "MaintainManager", icon: "Settings", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 7, parentId: 0,
                pageName: "ScrapManager", pageDesc: "处置管理", showIndex: 7,
                componentName: "ScrapManager", icon: "RestoreFromTrash", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 8, parentId: 0,
                pageName: "Statement", pageDesc: "报表", showIndex: 8,
                componentName: "", icon: "Assessment", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 9, parentId: 8,
                pageName: "AssetSummaryQuery", pageDesc: "资产汇总查询", showIndex: 9,
                componentName: "AssetSummaryQuery", icon: "Search", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 10, parentId: 8,
                pageName: "AssetRecord", pageDesc: "资产履历", showIndex: 10,
                componentName: "AssetRecord", icon: "FeaturedPlayList", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 11, parentId: 0,
                pageName: "AssetClass", pageDesc: "资产分类", showIndex: 11,
                componentName: "AssetClass", icon: "Class", status: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", pageId: 12, parentId: 0,
                pageName: "PlaceManager", pageDesc: "资产位置", showIndex: 7,
                componentName: "PlaceManager", icon: "Place", status: 1, createPerson: "admin"
            }

        ]
    },
    tenant_org_permission:
    {
        comment: "组织机构权限配置",
        fields: {
            orgId: { desc: "组织编号", type: "string", length: 20, notNull: true },
            pageId: { desc: "页面编号", type: "string", length: 20, notNull: true },
            canVisible: { desc: "页面可见", type: "bool", notNull: true, default: 1 },
            canAdd: { desc: "增加权限", type: "bool", notNull: true, default: 1 },
            canUpdate: { desc: "修改权限", type: "bool", notNull: true, default: 1 },
            canDelete: { desc: "删除权限", type: "bool", notNull: true, default: 1 },
        },
        unqiue: ["tenantId", "orgId", "pageId"],
        data: [
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 1, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 2, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 3, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 4, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 5, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 6, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 7, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 8, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 9, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 10, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 11, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supoin", orgId: "supoin01",
                pageId: 12, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 1, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 2, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 3, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 4, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 5, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 6, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 7, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 8, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 9, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 10, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 11, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            },
            {
                tenantId: "supdatas", orgId: "supdatas01",
                pageId: 12, canVisible: 1, canAdd: 1, canUpdate: 1, canDelete: 1, createPerson: "admin"
            }
        ]
    },
    tenant_asset:
    {
        comment: "资产列表",
        fields: {
            assetId: { desc: "资产编号", type: "string", length: 100, notNull: true },
            barcode: { desc: "资产条码", type: "string", length: 100, notNull: false },
            epc: { desc: "RFID标签ID", type: "string", length: 100, notNull: false },
            assetName: { desc: "资产名称", type: "string", length: 100, notNull: true },
            classId: { desc: "资产类别编号", type: "string", length: 20, notNull: true },
            manager: { desc: "资产管理员", type: "string", length: 20, notNull: false },
            brand: { desc: "品牌", type: "string", length: 20, notNull: false },
            model: { desc: "型号", type: "string", length: 20, notNull: false },
            ownOrgId: { desc: "所属组织Id", type: "string", length: 20, notNull: false },
            useOrgId: { desc: "使用组织Id", type: "string", length: 20, notNull: false },
            status: { desc: "资产状态", type: "int", notNull: true, default: 0 },
            useStatus: { desc: "使用状态", type: "int", notNull: true, default: 0 },
            placeId: { desc: "位置编号", type: "string", length: 20, notNull: false },
            serviceLife: { desc: "可使用期限(月)", type: "int", notNull: true, default: 0 },
            amount: { desc: "金额", type: "float", notNull: false },
            purchaseDate: { desc: "购置日期", type: "dateTime", notNull: false },
            purchaseType: { desc: "购置方式", type: "string", length: 20, notNull: false },
            orderNo: { desc: "采购订单号", type: "string", length: 50, notNull: false },
            unit: { desc: "计量单位", type: "string", length: 20, notNull: false },
            image: { desc: "资产图片", type: "string", length: 2000, notNull: false },
            supplier: { desc: "供应商", type: "string", length: 20, notNull: false },
            linkPerson: { desc: "联系人", type: "string", length: 20, notNull: false },
            telNo: { desc: "联系电话", type: "string", length: 20, notNull: false },
            expired: { desc: "过保时间", type: "dateTime", notNull: false },
            mContent: { desc: "维保内容", type: "string", length: 200, notNull: false }
        },
        unqiue: ["tenantId", "assetId"],
        data:
            [
                {
                    tenantId: "supoin", assetId: "ZC00100000001", barcode: "", epc: "", assetName: "笔记本电脑",
                    assetClassId: "C00101", assetManager: "张治金", brand: "apple", model: "X3", ownOrgId: "supoin01",
                    useOrgId: "supoin01", status: 1, useStatus: 1, placeId: "P001", serviceLife: 12,
                    amount: 7999, purchaseDate: "2020-06-01", purchaseType: '采购', orderNo: "", unit: "台",
                    image: null, supplier: "", linkPerson: "张治金", telNo: "13826598771", expired: "2021-10-01",
                    mContent: "", createPerson: "admin"
                },
                {
                    tenantId: "supoin", assetId: "ZC00200000001", barcode: "", epc: "", assetName: "台实电脑电脑",
                    assetClassId: "C00102", assetManager: "张治金", brand: "apple", model: "X3", ownOrgId: "supoin01",
                    useOrgId: "supoin01", status: 1, useStatus: 1, placeId: "P001", serviceLife: 12,
                    amount: 7999, purchaseDate: "2020-06-01", purchaseType: '采购', orderNo: "", unit: "台",
                    image: null, supplier: "", linkPerson: "张治金", telNo: "13826598771", expired: "2021-10-01",
                    mContent: "", createPerson: "admin"
                },
                {
                    tenantId: "supoin", assetId: "ZC00300000001", barcode: "", epc: "", assetName: "笔投影仪",
                    assetClassId: "C002", assetManager: "张治金", brand: "apple", model: "X3", ownOrgId: "supoin01",
                    useOrgId: "supoin01", status: 1, useStatus: 1, placeId: "P001", serviceLife: 12,
                    amount: 7999, purchaseDate: "2020-06-01", purchaseType: '采购', orderNo: "", unit: "台",
                    image: null, supplier: "", linkPerson: "张治金", telNo: "13826598771", expired: "2021-10-01",
                    mContent: "", createPerson: "admin"
                }
            ]
    },
    tenant_asset_place:
    {
        comment: "资产位置",
        fields: {
            placeId: { desc: "位置编号", type: "string", length: 50, notNull: true },
            placeName: { desc: "位置名称", type: "string", length: 50, notNull: true },
            parentPlaceId: { desc: "父级位置编号", type: "strirng", length: 50, notNull: true, default: "0" }
        },
        unqiue: ["tenantId", "placeId"],
        data:
            [
                { tenantId: "supoin", placeId: "P001", placeName: "英龙大厦", parentPlaceId: "0", createPerson: "admin" },
                { tenantId: "supoin", placeId: "P00101", placeName: "A会议室", parentPlaceId: "P001", createPerson: "admin" },
                { tenantId: "supoin", placeId: "P00102", placeName: "B会议室", parentPlaceId: "P001", createPerson: "admin" }
            ]
    },
    tenant_asset_class:
    {
        comment: "资产分类",
        fields: {
            classId: { desc: "分类编号", type: "string", length: 50, notNull: true },
            className: { desc: "分类名称", type: "string", length: 50, notNull: true },
            parentClassId: { desc: "父级分类编号", type: "strirng", length: 50, notNull: true, default: "0" }
        },
        unqiue: ["tenantId", "classId"],
        data:
            [
                { tenantId: "supoin", classId: "C001", className: "电脑", parentClassId: "0", createPerson: "admin" },
                { tenantId: "supoin", classId: "C00101", className: "笔记本电脑", parentClassId: "P001", createPerson: "admin" },
                { tenantId: "supoin", classId: "C00102", className: "台式电脑", parentClassId: "P001", createPerson: "admin" },
                { tenantId: "supoin", classId: "C002", className: "投影仪", parentClassId: "P001", createPerson: "admin" },
            ]
    },
    tenant_meta_billfields: {
        comment: "单据扩展字段定义",
        fields: {
            billType: { desc: "单据类型值", type: "int", notNull: true },
            billTypeDesc: { desc: "单据类型描述", type: "string", length: 20, notNull: true },
            fieldName: { desc: "字段名称", type: "string", length: 20, notNull: true },
            fieldDesc: { desc: "字段描述", type: "string", length: 20, notNull: true },
            dataType: { desc: "字段值类型", type: "string", length: 20, notNull: false }
        },
        unqiue: ["tenantId", "billType"],
        data: [
            { billType: 11, billTypeDesc: "派发", fieldName: "ext7", fieldDesc: "派发日期", dateType: "dateTime" },
            { billType: 11, billTypeDesc: "派发", fieldName: "ext10", fieldDesc: "派发位置", dateType: "string" },
            { billType: 11, billTypeDesc: "派发", fieldName: "ext11", fieldDesc: "派发人", dateType: "string" },
            { billType: 21, billTypeDesc: "退库", fieldName: "ext7", fieldDesc: "退库日期", dateType: "dateTime" },
            { billType: 21, billTypeDesc: "退库", fieldName: "ext10", fieldDesc: "退库后位置", dateType: "string" },
            { billType: 21, billTypeDesc: "退库", fieldName: "ext11", fieldDesc: "退库后公司", dateType: "string" },
            { billType: 21, billTypeDesc: "退库", fieldName: "ext11", fieldDesc: "退库后部门", dateType: "string" },
            { billType: 21, billTypeDesc: "退库", fieldName: "ext12", fieldDesc: "管理员", dateType: "string" },
            { billType: 12, billTypeDesc: "借出", fieldName: "ext7", fieldDesc: "借用时间", dateType: "dateTime" },
            { billType: 12, billTypeDesc: "借出", fieldName: "ext8", fieldDesc: "预计归还时间", dateType: "dateTime" },
            { billType: 12, billTypeDesc: "借出", fieldName: "ext10", fieldDesc: "借用处理人", dateType: "string" },
            { billType: 12, billTypeDesc: "借出", fieldName: "ext11", fieldDesc: "借用后位置", dateType: "string" },
            { billType: 22, billTypeDesc: "归还", fieldName: "ext7", fieldDesc: "归还日期", dateType: "dateTime" },
            { billType: 22, billTypeDesc: "归还", fieldName: "ext10", fieldDesc: "归还后位置", dateType: "string" },
            { billType: 22, billTypeDesc: "归还", fieldName: "ext11", fieldDesc: "归还后处理人", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext10", fieldDesc: "调出管理人员", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext11", fieldDesc: "调拨后所属公司", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext12", fieldDesc: "调入管理员", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext13", fieldDesc: "调入公司", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext14", fieldDesc: "调入部门", dateType: "string" },
            { billType: 30, billTypeDesc: "调拨", fieldName: "ext15", fieldDesc: "调入位置", dateType: "string" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext4", fieldDesc: "维修费用", dateType: "float" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext7", fieldDesc: "报修日期", dateType: "dateTime" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext8", fieldDesc: "完成日期", dateType: "dateTime" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext10", fieldDesc: "报修人员", dateType: "string" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext11", fieldDesc: "送修位置", dateType: "string" },
            { billType: 31, billTypeDesc: "维修", fieldName: "ext12", fieldDesc: "报修内容", dateType: "string" },
            { billType: 32, billTypeDesc: "处置", fieldName: "ext4", fieldDesc: "处置费用", dateType: "float" },
            { billType: 32, billTypeDesc: "处置", fieldName: "ext7", fieldDesc: "完成日期", dateType: "dateTime" },
            { billType: 32, billTypeDesc: "处置", fieldName: "ext10", fieldDesc: "处置类型", dateType: "string" },
        ]
    },
    tenant_meta_billtype: {
        comment: "单据类型定义",
        fields: {
            billType: { desc: "单据类型值", type: "int", notNull: true },
            billTypeDesc: { desc: "单据类型描述", type: "string", length: 20, notNull: true },
        },
        unqiue: ["tenantId", "billType"],
        data: [
            { billType: 11, billTypeDesc: "派发", createPerson: "admin" },
            { billType: 21, billTypeDesc: "退库", createPerson: "admin" },
            { billType: 12, billTypeDesc: "借出", createPerson: "admin" },
            { billType: 22, billTypeDesc: "归还", createPerson: "admin" },
            { billType: 30, billTypeDesc: "调拨", createPerson: "admin" },
            { billType: 31, billTypeDesc: "维修", createPerson: "admin" },
            { billType: 32, billTypeDesc: "处置", createPerson: "admin" },
        ]
    },
    tenant_bill: {
        comment: "单据主表",
        fields: {
            billNo: { desc: "单据编号", type: "string", length: 50, notNull: true },
            billType: { desc: "单据类型", type: "int", notNull: true },
            sourceBillNo: { desc: "上游单据号", type: "string", length: 50, notNull: false },
            status: { desc: "单据状态", type: "int", notNull: true },
            ext1: { desc: "扩展字段1", type: "int", notNull: false },
            ext2: { desc: "扩展字段2", type: "int", notNull: false },
            ext3: { desc: "扩展字段3", type: "int", notNull: false },
            ext4: { desc: "扩展字段4", type: "float", notNull: false },
            ext5: { desc: "扩展字段5", type: "float", notNull: false },
            ext6: { desc: "扩展字段6", type: "float", notNull: false },
            ext7: { desc: "扩展字段7", type: "dateTime", notNull: false },
            ext8: { desc: "扩展字段8", type: "dateTime", notNull: false },
            ext9: { desc: "扩展字段9", type: "dateTime", notNull: false },
            ext10: { desc: "扩展字段10", type: "string", length: 200, notNull: false },
            ext11: { desc: "扩展字段11", type: "string", length: 200, notNull: false },
            ext12: { desc: "扩展字段12", type: "string", length: 200, notNull: false },
            ext13: { desc: "扩展字段13", type: "string", length: 200, notNull: false },
            ext14: { desc: "扩展字段14", type: "string", length: 200, notNull: false },
            ext15: { desc: "扩展字段15", type: "string", length: 200, notNull: false },
            ext16: { desc: "扩展字段16", type: "string", length: 200, notNull: false },
            ext17: { desc: "扩展字段17", type: "string", length: 200, notNull: false },
            ext18: { desc: "扩展字段18", type: "string", length: 200, notNull: false },
            ext19: { desc: "扩展字段19", type: "string", length: 200, notNull: false },
            ext20: { desc: "扩展字段20", type: "string", length: 200, notNull: false },
        },
        unqiue: ["tenantId", "billNo", "billType"],
        data: []
    },
    tenant_bill_detail: {
        comment: "单据明细表",
        fields: {
            billNo: { desc: "单据编号", type: "string", length: 50, notNull: true },
            assetId: { desc: "资产编号", type: "string", length: 100, notNull: true },
            status: { desc: "单据状态", type: "int", notNull: true },
        },
        unqiue: ["tenantId", "billNo", "billType", "assetId"],
        data: []
    }
}
module.exports.db_mock = db_mock;