function connect() {
    let socket = require('socket.io-client')('http://localhost:3000');
    socket.on('connect', () => {
        console.log("client conncted.")
        console.log(socket.id);
    });
    socket.on('server_message', (data) => {
        console.log(data);
    });
    socket.on('disconnect', () => {
        console.log("client disconnected." + socket.id);
    });
    let i = 0;
    setInterval(() => {
        socket.emit("client_message", "hi,the time is: " + Date.now().toLocaleString());
        i++;
    }, 5000)
    return socket;
}
function initial(maxNum) {
    let i = 0;
    setInterval(() => {
        if (i < maxNum) {
            connect();
            i++;
        }
    }, 100);


}
initial(3500);