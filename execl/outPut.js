const XlsxPopulate = require('xlsx-populate');

const jsonData = [
  {
    "classId": "委外模具",
    "assetName": "塑胶模具",
    "model": "塑胶模具TOP14071",
    "placeId": "供应商处",
    "reqPurpose": "",
    "ownOrgId": "采购系统",
    "useOrgId": "生产一部",
    "manager": "吉诗丽",
    "useEmployeeId": "曾凡平",
    "reqBillNo": "",
    "amount": "854.70",
    "supplierId": "深圳市尚美特科技有限公司",
    "purchaseDate": "2012-4-20",
    "unit": "套",
    "acceptanceDate": "",
    "factory": "龙华二厂"
  },
  {
    "classId": "委外模具",
    "assetName": "塑胶模具",
    "model": "塑胶模具TOP14071",
    "placeId": "供应商处",
    "reqPurpose": "",
    "ownOrgId": "采购系统",
    "useOrgId": "生产一部",
    "manager": "吉诗丽",
    "useEmployeeId": "曾凡平",
    "reqBillNo": "",
    "amount": "854.70",
    "supplierId": "深圳市尚美特科技有限公司",
    "purchaseDate": "2012-4-20",
    "unit": "套",
    "acceptanceDate": "",
    "factory": "龙华二厂"
  }
];

const headers = [
  '资产编号', '资产名称', 'EPC', '资产分类', '资产位置',
  '管理员', '所属系统', '使用部门', '使用人', '金额',
  '使用期限', '入库日期', '供应商名称', '计量单位', '品牌',
  '规格', '请购单号', '请购目的', '厂别', '申请部门',
  '请购申请人', '物料代码', '用途', '规划寿命', '实际寿命',
  '验收单号', '验收日期', '报废单号', '报废日期', '标签类型'];
// Create a new blank workbook
XlsxPopulate.fromBlankAsync()
  .then(workbook => {
    // Get the first sheet in the workbook
    const sheet = workbook.sheet(0);
    // 资产编号	资产名称	EPC	资产分类	资产位置	管理员	所属系统	使用部门	使用人	金额	使用期限	入库日期	供应商名称	计量单位	品牌	规格	请购单号	请购目的	厂别	申请部门	请购申请人	物料代码	用途	规划寿命	实际寿命	验收单号	验收日期	报废单号	报废日期	标签类型

    // Write the headers
    const headers = [
      '资产编号', '资产名称', 'EPC', '资产分类', '资产位置',
      '管理员', '所属系统', '使用部门', '使用人', '金额',
      '使用期限', '入库日期', '供应商名称', '计量单位', '品牌',
      '规格', '请购单号', '请购目的', '厂别', '申请部门',
      '请购申请人', '物料代码', '用途', '规划寿命', '实际寿命',
      '验收单号', '验收日期', '报废单号', '报废日期', '标签类型'];
    // sheet.cell('A1').value(headers);
    for (let i = 0; i < headers.length; i++) {
      sheet.cell(1, i + 1).value(headers[i]);
    }

    // Write the data rows
    for (let i = 0; i < jsonData.length; i++) {
      const data = [
        '', // 资产编号
        jsonData[i].assetName, // 资产名称
        '', // EPC
        jsonData[i].classId, // 资产分类
        jsonData[i].placeId, // 资产位置
        jsonData[i].manager, // 管理员
        jsonData[i].ownOrgId, // 所属系统
        jsonData[i].useOrgId, // 使用部门
        jsonData[i].useEmployeeId, // 使用人
        jsonData[i].amount, // 金额
        12, // 使用期限
        jsonData[i].purchaseDate, // 入库日期
        jsonData[i].supplierId, // 供应商名称
        jsonData[i].unit, // 计量单位
        '', // 品牌
        jsonData[i].model, // 规格
        jsonData[i].reqBillNo, // 请购单号
        jsonData[i].reqPurpose, // 请购目的
        jsonData[i].factory, // 厂别
        '', // 申请部门
        '', // 请购申请人
        '', // 物料代码
        '', // 用途
        '', // 规划寿命
        '', // 实际寿命
        '', // 验收单号
        jsonData[i].acceptanceDate, // 验收日期
        '', // 报废单号
        '', // 报废日期
        '普通电子标签'  // 标签类型
      ];
      for (let j = 0; j < data.length; j++) {
        sheet.cell(i + 2, j + 1).value(data[j]);
      }

      // sheet.row(i + 2).value(data);
    }

    // Save the workbook to a file
    return workbook.toFileAsync("资产导入模板 .xlsx");
  })
  .then(() => {
    console.log("JSON 数据已成功写入 Excel 文件。");
  })
  .catch(error => {
    console.error("写入 Excel 文件时出错:", error);
  });

