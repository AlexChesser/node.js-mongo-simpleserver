GLOBAL.DEBUG = true;

var sys  = require("sys");
var test = require("assert");
var http = require('http');

var 	Db 		= require('../lib/mongodb').Db,
	Connection 	= require('../lib/mongodb').Connection,
  	Server 		= require('../lib/mongodb').Server,
	//BSON 		= require('../lib/mongodb').BSONPure;
 	BSON 		= require('../lib/mongodb').BSONNative;

var 	host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var 	port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

sys.puts("Connecting to " + host + ":" + port);

function PutItem(err, item){
	var result = "";
	if(item != null) {
		for (key in item) {
			result += key + '=' + item[key];
		}
	}
	return result;
}

function ReadTest(){
	var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});
	var result = "";
	db.open(function (err, db) {
		db.collection('test', function(err, collection) {
			collection.find(function (err, cursor){
				cursor.each( function (err, item) {
					result += PutItem(err, item);
				});
			});
		});
	});
	return result;
}

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write("foo");






	var out = ReadTest();
	res.write(out);
  	res.end("foo");
}).listen(8124);
console.log('Server running on 8124');

