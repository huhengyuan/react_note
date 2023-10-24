function getType(value) {
    // return Object.prototype.toString.call(value);
    return Object.prototype.toString.call(value).slice(8, -1);
}

let res1 = getType(42); // 返回 "Number"
let res2 = getType("hello"); // 返回 "String"
console.log('res1', res1)
console.log('res2', res2)