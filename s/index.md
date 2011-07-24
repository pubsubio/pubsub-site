This is how we say "hello world"

	// connect from node
	var pubsub = require('pubsub.io').connect('hub.pubsub.io/$sub');
	// or the browser
	var pubsub = pubsubio.connect('hub.pubsub.io/$sub');

	pubsub.subscribe({
		hello:{$any:['world','mundo','verden']}
	}, function(doc) {
		console.log(doc);
	});

	pubsub.publish({hello:'world'});
	
clients are currently available for node.js

	npm install pubsub.io

and browser side js

	<script src='http://pubsub.io/pubsub.io.js'></script>

try running the hub locally

	git clone git@github.com:pubsubio/pubsub-hub.git
	./pubsub-hub/lib/server.js