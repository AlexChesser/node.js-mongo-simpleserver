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
	var result = "{ ";
	var first = 1;
	if(item != null) {
		for (key in item) {
			if (first == 1) {
				first = 0;
			} else {
				result += ", ";
			}
			result += key + ': "' + item[key] + '"';
			
		}
	}
	result += " }";
	return result;
}

function ReadTest(res){
	var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});
	var result = "";
	db.open(function (err, db) {
		db.collection('test', function(err, collection) {
			collection.find(function (err, cursor){
				cursor.each( function (err, item) {
					if (item == null) {
						res.end();
					} else {
						var x = PutItem(err, item);
						// sys.puts(x);
						res.write(x+"\n");
					}
				});
			});
		});
	});
}

function SaveToDB(query){
	var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});
	db.open(function(err, db) {
		db.collection('test', function(err, collection) {
			collection.insert(query);
		});
	});

}

function CleanDB(){
	var db = new Db('mydb', new Server(host, port, {}), {native_parser:true});
        db.open(function(err, db) {
                db.collection('test', function(err, collection) {
                        collection.drop();
                });
        });
}


// THIS AREA IS THE "DISPATCHER" 
// HTTP request comes in and depending on the URL 
// 
// 
http.createServer(function (req, res) {
	var URL = require('url').parse(req.url, true);

	if (URL.pathname == '/') {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		ReadTest(res);
	} 
	if (URL.pathname == '/save') {
		SaveToDB(URL.query);
		res.end('{ result : \'saved\' }');
	}
	if (URL.pathname == '/clean') {
		CleanDB();
		res.end('{ result : \'cleaned\'}');
	}

}).listen(8124);
console.log('Server running on 8124');

