function isValidDate(dateString) {
    // 使用正则表达式检查日期格式
    const regex = /^\d{4}[-/](0?[1-9]|1[0-2])[-/](0?[1-9]|[12][0-9]|3[01])$/;
    return regex.test(dateString);
}

const dateToCheck1 = '2022-01-01';
const dateToCheck2 = '2022/1/1';
const dateToCheck3 = '2022-1-01';
const dateToCheck4 = '2022/01/1';

if (isValidDate(dateToCheck1)) {
    console.log(`日期格式正确: ${dateToCheck1}`);
} else {
    console.log(`日期格式错误: ${dateToCheck1}`);
}

if (isValidDate(dateToCheck2)) {
    console.log(`日期格式正确: ${dateToCheck2}`);
} else {
    console.log(`日期格式错误: ${dateToCheck2}`);
}
if (isValidDate(dateToCheck3)) {
    console.log(`日期格式正确: ${dateToCheck3}`);
} else {
    console.log(`日期格式错误: ${dateToCheck3}`);
}
if (isValidDate(dateToCheck4)) {
    console.log(`日期格式正确: ${dateToCheck4}`);
} else {
    console.log(`日期格式错误: ${dateToCheck4}`);
}

