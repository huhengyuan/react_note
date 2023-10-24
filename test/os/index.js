const os = require('os')

function getIpAddress() {
    var ifaces = os.networkInterfaces()
    // console.log(typeof (ifaces))
    console.log('ifaces', ifaces)
    for (var key in ifaces) {
        // console.log(key)
        if (key.indexOf('VMware') < 0) {
            let iface = ifaces[key]
            for (let i = 0; i < iface.length; i++) {
                let { family, address, internal } = iface[i]

                if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                    return address
                }
            }
        }
    }
}

getIpAddress()