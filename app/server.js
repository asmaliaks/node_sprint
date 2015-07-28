var restify = require('restify');
var React = require('react');
var state = {};
var app = React.createFactory(require('./app.js'));
var server = restify.createServer();
var Router = require('./router.js');

// Rest service
server.get('/test', function (req, res, next) {
	res.send(200, JSON.stringify(myservice.test()));
	next();
});
server.post('/auth', function(req, res) {
	server.use(restify.bodyParser({ mapParams: false }));
	console.log(req.pass);
	//if(req.body.email === 'xxx' && req.body.password === 'xxx'){
	//	var data = true;
	//} else {
	//	data = false;
	//}
	//res.send(JSON.stringify(data));
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