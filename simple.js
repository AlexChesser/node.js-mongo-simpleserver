GLOBAL.DEBUG = true;

sys 	= require("sys");
test 	= require("assert");

var 	Db 		= require('../lib/mongodb').Db,
	Connection 	= require('../lib/mongodb').Connection,
  	Server 		= require('../lib/mongodb').Server,
	//BSON 		= require('../lib/mongodb').BSONPure;
 	BSON 		= require('../lib/mongodb').BSONNative;

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

sys.puts("Connecting to " + host + ":" + port);
var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});

db.open(
	function (err, db) {
    		db.collection('test', function(err, collection) {
			for(var i = 0; i < 3; i++) {
                        	collection.insert({'a' : i});
				sys.puts(i+"\n");
                	}
		});
	}
);

