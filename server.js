var defaults = require('./config')
var argv = require('minimist')(process.argv.slice(2))
var multilevel = require('multilevel');
var net = require('net');
var level = require('level');
var sub = require('level-sublevel')
var sec = require('level-sec')
var LiveStream = require('level-live-stream')
var createManifest = require('level-manifest')
var path = require('path')


function Server(config){
  this.config = config || defaults
  this.db = null
}

function stop(server){
  server.db.close()
  server.netServer.close()
  server.db = null
}
Server.prototype.stop = function(){
  stop(this)
}
Server.prototype.close = function(){
  stop(this)
}

function authentication(config){
  var users = config.auth.users
  var result = { }
  if(config.auth.enabled === true){
    result.auth=function(user,cb){
      for(var i in users){
        if(user.name === users[i].name && user.pass === users[i].pass){
          return cb(null,users[i])
        }
      }
      cb(new Error('Not Authorized'))
    }
    result.access = function(user,db,method,args){
      //console.log(user,method,args)  
      if(user == null){
        throw Error('Access Denied. Client must use client.auth()')
      }
      else if(user.deny){
        if(new RegExp(user.deny.join('|'),'i').test(method)){
          throw Error('Access Denied to', user.name,method)
        }
      }
    }
  }
  return result
}
Server.prototype.start = function(){
  if(this.db != null) return
  var config = this.config
  var self = this
  
  db = sub(level(config.database,config.options));
  db.methods = db.methods || {}
  LiveStream.install(db)

  //create sublevels from config file
  for(var i in config.sublevels){
    var sl = config.sublevels[i]
    sublevel = db.sublevel(sl.name)
    //add livestream for each sublevel
    LiveStream.install(sublevel)
    //adding level-sec secondary indexes
    var tmpsec
    for(var i in sl.indices){
      var index = sl.indices[i]
      tmpsec=sec(sublevel).by(index.name,index.keys)
      sublevel = tmpsec.db
    }
    db[sl.name]=sublevel
    db.methods[sl.name]= {
      type:'object'
      ,methods:createManifest(db[sl.name]).methods
    }
  }

  multilevel.writeManifest(db,config.manifest)

  console.log(config.name, 'listening on', config.port,'with manifest',config.manifest)
  var server = net.createServer(function (con) {
    console.log('Client connected from', con.remoteAddress)
    con.setTimeout(config.timeout)
    con.on('error',function(err){
      console.log('connection error',err)
    }.bind(con))
    .on('timeout',function(){
      console.log('timed out')
      this.destroy()
    }.bind(con))
    .on('close',function(){
      console.log('ended connection')
      this.destroy()
    })
    var ml = multilevel.server(db,authentication(this.config))
      .on('error',function(err){
        console.log('multilevel error',err)
      })
    con.pipe(ml).pipe(con);
  })

  //server.setMaxListeners(0)
  server.listen(config.port)
  server.on('error',function(err){
    console.log('server error',err)
  })
  self.db = db
  self.netServer = server 
  return multilevel.server(db,authentication(this.config))
}


module.exports = Server

if(argv.start){
  var config = defaults
  if(typeof argv.start === 'string'){
    config = require(path.join(__dirname,argv.start))
  }
  new Server(config).start()
}
