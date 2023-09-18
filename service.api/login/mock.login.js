const demo_access_token = "0123456789ABCDEFGHIJKLMNOPQRST";
async function demo_getToken(data, queryObj) {
    if (queryObj.grant_type && queryObj.code && queryObj.client_secret && queryObj.client_id && queryObj.redirect_uri) {
        if (queryObj.code == client_code) {
            return {
                access_token: demo_access_token,
                token_type: "1",
                refresh_token: "0123",
                expires_in: 7200,
                scope: "1,2"
            };
        }
        else {
            return { code: -1, message: "code参数错误" };
        }
    }
    return { code: -1, message: "参数不完整" };
}
async function demo_getUser(data, queryObj) {
    console.log("getUserInfo");
    console.log(queryObj);
    let result = {
        "ERRORCODE": "0000",
        "ERRORMSG": "成功",
        "USERSN": "9123456789",
        "CMBCOANAME": "ceshitest",
        "SN": "陈某某",
        "USERTYPE": "1000000000",
        "TELEPHONENUMBER": "010xxxxxxxx",
        "STATUS": "A",
        "SEX": "M",
        "MOBILE": "152xxxxxxxx",
        "MAIL": "xxxxxx@cmbc.com.cn",
        "JOBLIS": [
            {
                "POSITIONNAME": "泉州田安路支行零售银行部理财经理岗",
                "JOBID": "000188",
                "JOBNAME": "职员",
                "DEPTNAME": "泉州田安路支行零售银行部",
                "JOBORDER": "0",
                "DEPTID": "QUZ0000026",
                "POSITIONID": "QUZ00655"
            },
            {
                "POSITIONNAME": "泉州分行团委委员岗",
                "JOBID": "000188",
                "JOBNAME": "职员",
                "DEPTNAME": "北京管理部公司业务一处",
                "JOBORDER": "1",
                "DEPTID": "BEJ0000027",
                "POSITIONID": "QUZ00273"
            }
        ],
        "BIRTHDAY": "19840502",
        "ACCOUNTID": "9123456789"
    }
    if (queryObj.access_token == access_token) {
        return result;
    }
    else {
        return { code: -1, message: "token error" };
    }
}