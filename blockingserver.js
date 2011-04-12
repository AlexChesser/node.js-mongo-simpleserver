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

function ReadTest(res){
	var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});
	var result = "";
	res.write("in readtest\n");
	db.open(function (err, db) {
		res.write("now open\n");
		db.collection('test', function(err, collection) {
			res.write("in collection\n");
			collection.find(function (err, cursor){
				res.write("found\n");
				cursor.each( function (err, item) {
					var x = PutItem(err, item);
					sys.puts(x);
					res.write(x+"\n");
					if (item == null) {
						res.end('foo');
					}
				});
			});
		});
	});
}

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.write("start\n");
	ReadTest(res);
}).listen(8124);
console.log('Server running on 8124');

