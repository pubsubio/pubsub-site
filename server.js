var server = require('router').create();

server.file('/s/{file}','./s/{file}');

server.file('/','./s/index.html');
server.file('/docs','./s/docs.html');
server.file('/slides', './s/nodecamp.html');
server.file('/pubsub.io.js','./s/pubsub.io.js');

server.file('./s/404.html',{status:404});

server.listen(process.argv[2] || 9000);

process.on('uncaughtException', function(err) { console.log(err.stack) });