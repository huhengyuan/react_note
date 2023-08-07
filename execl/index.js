const xlsToJson = require('xls-to-json');
const path = require('path');
const fs = require('fs');
// 定义要读取的.xls文件的路径
const filePath = path.join(__dirname, '副本.xls');
// 属性名称的中文到英文映射对象
const attributeMapping = {
    "固资编码":"assetId",
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
    "机构编号":"orgId",
    "机构名称":"orgName",
    "上级机构":"parentId",
};

// 使用xlsToJson来读取.xls文件
xlsToJson(
    {
        input: filePath,
        output: null, // 这里设置为null表示将数据返回为数组，也可以指定输出文件路径
        sheet: '无类别--固定资产台账信息', // 指定要读取的工作表的名称
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
            // console.log(mappedResult)
            // 替换属性名
            // const modifiedData = result.map(item => {
            //     const modifiedItem = {};
            //     for (const [chineseProperty, englishProperty] of Object.entries(propertyMap)) {
            //         modifiedItem[englishProperty] = item[chineseProperty];
            //     }
            //     return modifiedItem;
            // });
            // 指定随机截取数据的区间范围 [start, end]
            const start = 1;
            const end = 4100;
            const sampleSize = 150;
            const randomizedData = [];

            while (randomizedData.length < sampleSize) {
                const randomIndex = Math.floor(Math.random() * (end - start + 1)) + start;
                if (randomizedData.indexOf(randomIndex) === -1) {
                    randomizedData.push(randomIndex);
                }
            }

            // 从 mappedResult 中截取随机数据
            const finalRandomizedData = randomizedData.map(index => mappedResult[index]);

            const jsonData = JSON.stringify(mappedResult, null, 2);
            // 将数据转换为 JSON 字符串
            // const jsonData = JSON.stringify(finalRandomizedData, null, 2);

            // console.log(slicedResult);
            // console.log(slicedResult.length)
            // 将数据写入 JSON 文件
            fs.writeFile('wlbzc.json', jsonData, 'utf8', (err) => {
                if (err) {
                    console.error('写入 JSON 文件时出错:', err);
                } else {
                    console.log('数据已成功写入 JSON 文件。');
                }
            });
        }
    }
);
