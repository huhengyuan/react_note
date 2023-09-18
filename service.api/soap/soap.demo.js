const soap = require('soap');
const url = 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?WSDL';
const url_cmbc="";

var args = {byProvinceName: '广东'};
soap.createClient(url, function(err, client) {
    console.log(JSON.stringify(client.describe()));
    // client.getSupportCity(args, function(err, result) {
    //     console.log(result);
    // });
});