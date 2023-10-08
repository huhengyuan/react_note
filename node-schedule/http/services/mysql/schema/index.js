const fs = require('fs')

function getSchemaFiles() {
    const schama_files = [];
    const all_files = fs.readdirSync(__dirname);
    for (file of all_files) {
        if (/table.js$/.test(file) || /view.js$/.test(file)) {
            schama_files.push(file)
        }
    }
    return schama_files
}

function concatAllSchema() {
    return getSchemaFiles().reduce((all, cur) => {
        return { ...all, ...require('./' + cur) }
    }, {})
}
module.exports = concatAllSchema();