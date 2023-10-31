// function getType(value) {
//     // return Object.prototype.toString.call(value);
//     return Object.prototype.toString.call(value).slice(8, -1);
// }

// let res1 = getType(42); // 返回 "Number"
// let res2 = getType("hello"); // 返回 "String"
// console.log('res1', res1)
// console.log('res2', res2)


// let originalString = "2023年年度资产盘点-各部门-农业部";
// let modifiedString = originalString.substring(0, originalString.lastIndexOf("-"));
// console.log(modifiedString);

// 获取当前时间
let currentDate = new Date();

// 格式化为 MySQL datetime 格式 (YYYY-MM-DD HH:mm:ss)
let formattedDatetime = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

console.log(formattedDatetime);

