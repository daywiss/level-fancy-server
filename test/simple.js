var Server = require('..').Server
var server = new Server().start()
setTimeout(server.stop.bind(server),3000)
