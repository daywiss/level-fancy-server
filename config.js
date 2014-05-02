//options for connecting to a leveldb database
//Uses multilevel for handling multiple client connections over tcp:
//https://github.com/juliangruber/multilevel
module.exports = {
  port:97892
  ,name:'level fancy server'
  ,manifest:'/tmp/fancy-manifest.json'
  ,database:'./database'    //location of database folder
  ,timeout:0 //will disconnect a client in X milliseconds of inactivity, 0 disables
  //passes configuration options when starting leveldb
  ,options:{
    valueEncoding:'json'
    ,db:require('memdown') //uncomment to use in memory storage. Will ignore database option.
  }
  //enable authentication for client connections, by default a user has full access unless denied
  //operations: get,put,del,batch,write
  ,auth:{
    enabled:true
    ,users:[
      {
        name:'read'
        ,pass:'daer'
        ,deny:['put','del','batch','write']
      }
      ,{
        name:'write'
        ,pass:'etirw'
        ,deny:['del','batch']
      }
      ,{
        name:'root'
        ,pass:'toor'
      }
      
    ]
  }
  //Define sublevels and secondary indexes here. Follow example conventions.
  //Uses sublevel and level-sec: 
  //https://github.com/dominictarr/level-sublevel
  //https://github.com/juliangruber/level-sec
  ,sublevels:[
    {
      //sublevel db.posts with 3 secondary indices
      name:'posts' 
      ,indices:[
        { name:'Title' ,keys:['title'] } //db.posts.byTitle
        ,{ name:'Length' ,keys:['body.length'] } //db.posts.byLength
        ,{ name:'Author' ,keys:['author','title'] } //db.posts.byAuthor
      ]
    }
  ]
}
