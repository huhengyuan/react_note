const fs = require('fs')
const path = require('path');
/**
 * 一维数组转化为树结构：
 * @param {*} arr 一维数组
 * @param {*} targetField 有层级结构的ID字段名称
 * @param {*} topId 顶级层级的值
 * @returns 
 */
function arrToTree(arr, targetField, topId) {
    let result = [];
    let map = arr.reduce((res, cur) => (res[cur[targetField]] = cur, res), {})
    for (let item of arr) {
        if (item.parentId === topId) {
            result.push(item)
            continue;
        }
        if (item.parentId in map) {
            let parent = map[item.parentId];
            parent.children = parent.children || [];
            parent.children.push(item)
        }
    }
    return result;
}

/**
 * 根据指定字段进行排序
 * @param {*} tree 
 * @param {*} sort_field 
 * @returns 
 */
function sortByOrder(tree, sort_field) {
    if (!tree || !tree.length) {
        return null
    }
    tree.sort((a, b) => a[sort_field] - b[sort_field])
    for (let i = 0; i < tree.length; i++) {
        if (tree.children && tree.children.length) {
            sortByOrder(tree.children, sort_field)
        }
    }
}

// 删除数组中的某个指定值的元素：
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


/**
 *
 * @param {*} url
 */
function deleteFolderRecursive(url) {
    return new Promise((resolve, reject) => {
        let files = [];
        /**
         * 判断给定的路径是否存在
         */
        if (fs.existsSync(url)) {
            /**
             * 返回文件和子目录的数组
             */
            files = fs.readdirSync(url);
            files.forEach(function (file, index) {

                const curPath = path.join(url, file);
                // console.log(curPath);
                /**
                 * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
                 */
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);

                } else {
                    fs.unlinkSync(curPath);
                }
            });
            /**
             * 清除文件夹
             */
            fs.rmdirSync(url);

            resolve('删除文件夹成功')
        } else {
            // console.log("给定的路径不存在，请给出正确的路径");
            reject("给定的路径不存在，请给出正确的路径")
        }
    })

}

// 判断是否为邮箱：
function isEmail(str) {
    let reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return str ? str.split(';').every(e => reg.test(e)) : false;
}

module.exports = {
    arrToTree,
    sortByOrder,
    deleteFolderRecursive,
    isEmail
}