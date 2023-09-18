const dbClient = require("./db.mysql");
async function test() {
    let res = null;
    res = await dbClient.Query("tenant");
    console.log(res);
}
test();
