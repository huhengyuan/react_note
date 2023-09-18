const dbClient = require("./db.local");
const dbMock = require("./db_mock").db_mock;
function query() {
    let res = dbClient.Query("tenant", { tenantId: "supoin" }, { tenantName: 1 });
    console.log(res);
}
function update() {
    let res = dbClient.Update("tenant", { tenantId: "supoin" }, { remarks: "hello" });
    console.log(res);
    res = dbClient.Query("tenant", { tenantId: "supoin" });
    console.log(res);
}
function deleteR() {
    let res = dbClient.Delete("tenant", { tenantId: "supoin" });
    console.log(res);
    res = dbClient.Query("tenant");
    console.log(res);
}
function insert() {
    let res = dbClient.Insert("tenant", { tenantId: "supdata2" });
    console.log(res);
    res = dbClient.Query("tenant");
    console.log(res);

}
function insertMany() {
    let res = dbClient.Insert("tenant", [{ tenantId: "supdatas1" }, { tenantId: "supdatas2" }]);
    console.log(res);
    res = dbClient.Query("tenant");
    console.log(res);
}
// query();
// update();
// deleteR();
// insert();
insertMany();
