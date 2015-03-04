var Server = require('..').Server
var server = new Server().start()
setTimeout(server.stop,3000)
