const xlsToJson = require('xls-to-json');
const path = require('path');
const fs = require('fs');
// 定义要读取的.xls文件的路径
const filePath = path.join(__dirname, '员工编号.xlsx');
// 属性名称的中文到英文映射对象
const attributeMapping = {
    "新资产类型": "classId",
    "资产名称": "assetName",
    "规格型号": "model",
    "存放位置": "placeId",
    "请购目的": "reqPurpose",
    "系统": "ownOrgId",
    "使用部门": "useOrgId",
    "责任人": "manager",
    "使用人": "useEmployeeId",
    "请购单号": "reqBillNo",
    "采购价格": "amount",
    "供应商名称": "supplierId",
    "入库日期": "purchaseDate",
    "单位": "unit",
    "验收日期": "acceptanceDate",
    "厂别": "factory",
    "机构编号": "orgId",
    "机构名称": "orgName",
    "上级机构": "parentId",
    "部门": "orgId",
    "部门编号": "delete",
    "员工编号": "employeeId",
    "员工姓名": "employeeName",
};
function countChineseCharacters(str) {
    const chineseCharacters = str.match(/[\u4e00-\u9fa5]/g);
    return chineseCharacters ? chineseCharacters.length : 0;
  }
// 使用xlsToJson来读取.xls文件
xlsToJson(
    {
        input: filePath,
        output: null, // 这里设置为null表示将数据返回为数组，也可以指定输出文件路径
        sheet: '员工数据未整理', // 指定要读取的工作表的名称
    },
    (err, result) => {
        if (err) {
            console.error('读取Excel文件时出错:', err);
        } else {
            // console.log(result); // 这里是包含Excel文件数据的数组
            // 截取前 100 条数据
            // 进行属性映射，将中文属性名称映射为英文
            const mappedResult = result.map(item => {
                const mappedItem = {};
                for (const [chineseAttr, englishAttr] of Object.entries(attributeMapping)) {
                    mappedItem[englishAttr] = item[chineseAttr];
                }
                return mappedItem;
            });

            // 去掉每个对象中的 delete 属性以及 orgName 长度大于三的对象
            const filteredResult = mappedResult.filter(item => {
                // console.log(item)
                delete item.delete;
                return countChineseCharacters(item.orgName) <= 3;
            });


            const jsonData = JSON.stringify(filteredResult, null, 2);
            // 将数据转换为 JSON 字符串
            // const jsonData = JSON.stringify(finalRandomizedData, null, 2);

            // console.log(slicedResult);
            // console.log(slicedResult.length)
            // 将数据写入 JSON 文件
            fs.writeFile('employee.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('写入 JSON 文件时出错:', err);
                } else {
                    console.log('数据已成功写入 JSON 文件。');
                }
            });
        }
    }
);
