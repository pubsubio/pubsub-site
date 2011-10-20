var ghm = require('github-flavored-markdown');
var common = require('common');
var fs = require('fs');

var markdown = function(filename, callback) {
	common.step([
		function(next) {
			fs.readFile(filename, 'utf-8', next);
		},
		function(result) {
			callback(null, ghm.parse(result));
		}
	], callback);
};

var aejs = require('async-ejs').add('markdown',markdown);
var server = require('router').create();

var port = process.argv[2] || 9000;

server.file('/s/{file}','./s/{file}');

var ontemplate = function(template, locals) {
	return function(request, response) {
		common.step([
			function(next) {
				aejs.renderFile(template, {locals: locals}, next);
			},
			function(src) {
				response.writeHead(200, {
					'content-type': 'text/html',
					'content-length': Buffer.byteLength(src)
				});
				response.end(src);
			}
		], function(err) {
			console.log(err);
			response.writeHead(200);
			response.end(err.stack);
		});
	}
};

server.get('/', ontemplate('./s/base.html',{page:'index'}));
server.get('/about', ontemplate('./s/base.html',{page:'about'}));
server.get('/docs', ontemplate('./s/base.html', {page:'docs'}));
server.file('/console1', './s/console.html');
server.file('/console', './s/console2.html');
server.file('/map', './s/maps.html');
server.file('/examples', './s/examples.html');
server.file('/slides', './s/nodecamp.html');
server.file('/pubsub.io.js', './s/pubsub.io.js');
server.file('/s/{file}','./s');
server.file('/t/sockets', './s/sockets-test.html');

server.file('./s/404.html',{status:404});

server.listen(port);
console.log('server running on port',port);

process.on('uncaughtException', function(err) { console.log(err.stack) });