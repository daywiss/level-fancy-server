var argv = require('minimist')(process.argv.slice(2))
var path = require('path')

var defaults = require('../config')
var Client = require('level-fancy').Client

var db = null
console.log(argv)


if(argv.config){
  config = require(path.join(path.normalize(__dirname+'/..'),argv.config))
  client = new Client(config)
  var db = client.connect().db
  //console.log(db[argv.sublevel])
  if(argv.sublevel){
    db[argv.sublevel].createKeyStream()
    .on('data',function(key){
      db[argv.sublevel].del(key,function(err){
        if(err)console.log(err)
      })
      console.log('rm',key)
    })
    .on('close',function(){
      db.close()
    })
  }else{
    console.log('specify name of sublevel with --sublevel')
  }
}else{
  console.log('Requires config file with --config')
}


