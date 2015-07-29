var restify = require('restify');
var React = require('react');
var state = {};
var app = React.createFactory(require('./app.js'));
var server = restify.createServer();
var Router = require('./router.js');
var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');

// Rest service
server.get('/test', function (req, res, next) {
	res.send(200, JSON.stringify(myservice.test()));
	next();
});
server.use(restify.bodyParser());
server.post('/auth', function(req, res) {
	var findUsers = function(db, callback, login, pass) {
		// Get the documents collection
		var collection = db.collection('users');
		// Find some documents
		collection.find({login: 'alex'}).toArray(function(err, usrs) {
			assert.equal(err, null);console.log(usrs);
			assert.equal(3, usrs.length);
			console.log("Found the following records"+usrs);
			console.dir(usrs);
			callback(usrs);
		});

	};
	var jsonBody = JSON.parse(req.body);
// Connection URL
	var url = 'mongodb://localhost:27017/catalog';
// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		var collection = db.collection('users');
		findUsers(db, function(users) {
console.log();
				db.close();
		}, jsonBody.login, jsonBody.pass);
	});


	res.send(jsonBody);

});
// Prepare landing page
server.get('/', function (req, res, next) {	
	var router = new Router();	
	
	// Initialize a state of the app
	var state = {
		currentView: router.serverRoute(req)
	};	
	
	
	
	// Prepare content
	var content = React.renderToString(new app(state));
	var body = '<!DOCTYPE html>\
				<html lang="">\
					<head>\
						<title>Test Router</title>\
						<link rel="stylesheet" href="app.css" />\
					</head>\
					<body>\
						<script>var APP_PROPS = ' + JSON.stringify(state) + ';</script>\
						<script src="bundle.js"></script>\
					</body>\
				</html>';
	
	// Send response
	res.writeHead({
		'Content-Type': 'text/html'
	});
	res.write(body);
	res.end();
});

// Serve static (js, css)
server.get('/.*', restify.serveStatic({
	directory: __dirname + ''
}));

// Run server
server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});
// var server = restify.createServer();