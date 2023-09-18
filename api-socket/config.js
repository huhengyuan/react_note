const settings = {
    self: {
        serviceName: "api-socket",
        heartInterval: 5,
        isDebug: true
    },
    socket: {
        options: {
            transports: ["websocket"],
            pingTimeout: 5000
        },
        port: 6306
    },
    db_iot: {
        connectionLimit: 10,
        host: "47.94.5.22",
        user: "supoin",
        password: "SupoinSz@2021",
        port: "3306",
        database: "iot.asset.grp",
        timezone: "system",
        multipleStatements: true,
    },
    log: {
        "appenders": {
            "everything": {
                "type": "dateFile",
                "filename": __dirname + "/Log/logs.log"
            }
        },
        "categories": {
            "default": {
                "appenders": [
                    "everything"
                ],
                "level": "debug"
            }
        }
    }
};

module.exports = settings;
