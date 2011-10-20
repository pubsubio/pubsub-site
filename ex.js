// connect from node
var pubsub = require('pubsub.io').connect('hub.pubsub.io/3534462');

pubsub.subscribe({
    hello:{$any:['world','mundo','verden']}
}, function(doc) {
    console.log(doc);
});

pubsub.publish({hello:'world'});