// 1. 展开数组
const arr1 = [1, 2, 3, 4, 5, 6]
const arr2 = [7, 8, 9, 0]
console.log(...arr1);
// 链接数组
const arr = [...arr1, ...arr2]
console.log(arr);
// 在函数中使用
function sum(...nums) {
    console.log(nums);
    return nums.reduce((pre, cur) => {
        console.log(pre, cur);
        return pre + cur
    })
}
console.log(sum(1, 2, 3, 4, 5));
// 构造字面量对象时，使用展开语法
let person = { name: 'tom', age: 19 }
// console.log(...person); // 错误形式，对象不可以直接使用展开运算符
console.log({...person});  // 正确形式，代表复制对象
// 复制并修改合并属性
console.log({...person, name:'jack'});