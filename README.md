level-fancy-server
==================

Custom [leveldb](https://github.com/rvagg/node-levelup) database server meant to be used with one or more [level-fancy](https://github.com/daywiss/level-fancy) clients. Uses [multi-level](https://github.com/juliangruber/multilevel) 
for multiple tcp client connections, [sublevel](https://github.com/dominictarr/level-sublevel) for key organization, 
[level-live-stream](https://github.com/dominictarr/level-live-stream) for pub/sub functionality,
[level-sec](https://github.com/juliangruber/level-sec) for secondary indexes,
and [memdown](https://github.com/rvagg/memdown) for optional in memory data storage. 


Can run as a standalone server or run within a node application.

##Status
Work in progress. 

## Usage 
```
cd level-fancy-server
npm install
```

Start a standalone server with default settings

```
node server --start
```

Can also be started and stopped programatically

```
var Server = require('level-fancy-server').Server
var server = new Server().start()
server.stop()
```

## Configuration
View default configuration file: `config.js`
By default the database uses in memory storage with memdown. Comment out
`db:require('memdown')` to enable storage to disk.

See [level-fancy](https://github.com/dadams/level-fancy) for connecting with clients.

