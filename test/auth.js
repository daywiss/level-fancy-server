var Server = require('..').Server
var config = require('../config')
var multilevel = require('multilevel')

var fancy = new Server()
var server = fancy.start(config)
var client = multilevel.client(require(config.manifest))

server.pipe(client.createRpcStream()).pipe(server)
server.on('error',console.log)

client.put('test','test',function(err){
  console.log(err)
  client.get('test',function(err,data){
    console.log(err,data)
  })
})


client.auth({name:'write',pass:'etirw'},function(err,data){
  console.log(err,data)
  client.put('test','test',function(err){
    console.log(err)
    client.get('test',function(err,data){
      console.log(err,data)
    })
  })
})

