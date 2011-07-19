var aejs = require('async-ejs');
var common = require('common');

var server = require('router').create();

var port = process.argv[2] || 9000;

server.file('/s/{file}','./s/{file}');

var ontemplate = function(template) {
	return function(request, response) {
		common.step([
			function(next) {
				aejs.renderFile(template, next);
			},
			function(src) {
				response.writeHead(200, {
					'content-type': 'text/html',
					'content-length': Buffer.byteLength(src)
				});
				response.end(src);
			}
		], function() {
			response.writeHead(500);
			response.end();
		});
	}
};

server.get('/test', ontemplate('./s/index.html'));
server.file('/','./s/index.html');
server.file('/about','./s/about.html');
server.file('/docs','./s/docs.html');
server.file('/slides', './s/nodecamp.html');
server.file('/pubsub.io.js','./s/pubsub.io.js');

server.file('./s/404.html',{status:404});

server.listen(port);
console.log('server running on port',port);

process.on('uncaughtException', function(err) { console.log(err.stack) });

/*var ghm = require("github-flavored-markdown")
console.log(ghm.parse("I **love** GHM.\n\n#2", "isaacs/npm"))*/