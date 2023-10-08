const fs = require('fs').promises;

(async ()=>{
    try {
        let res_exists = await fs.stat('./hhf/1101/t.txt', 'utf8')
        console.log(res_exists)
        let res_delete = await fs.unlink('./hhf/1101/t.txt')
        console.log('res_delete', res_delete)
    } catch (error) {
        console.log(error.message)
    }
})()