const dbOperate = require('./dbOperate');
const { sequelize } = require('./connect');
const { QueryTypes } = sequelize;
const dayjs = require('dayjs');

(async function () {
    try {
        let res = await dbOperate.findAll({ tableName: 'v_count_manufacturers_fault_rate'})
        console.log(res)
    } catch (error) {
        console.log(error)
    }
})()