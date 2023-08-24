const obj = { value: 42 };

function sum(a, b) {
    console.log(this);
  return this.value + a + b;
}

const boundFunction = sum.bind(obj);  // 将 sum 函数绑定到 obj
console.log(boundFunction(2, 3)); // 输出: 47
const result = sum.call(obj, 2, 3);  // 在 obj 上调用 sum 函数，传递参数 2 和 3
console.log(result); // 输出: 47
const results = sum.apply(obj, [2, 3]);  // 在 obj 上调用 sum 函数，传递参数数组 [2, 3]
console.log(results); // 输出: 47
