var join = function(one, two) {
	for(var i in two) {
		one[i] = two[i];
	}
	return one;
}
// use nconf
var pubsub = require('../index').connect('localhost/site');

var sign = pubsub.signer('yWr31fJn415pnfZv0CAu9KvFZVc=');

pubsub.subscribe({hi: {$signed:1}}, console.log);
pubsub.publish(sign({hi: 'lo'}));
/*
pubsub.subscribe(sign({user: 'ian'}), console.log);
pubsub.publish({user: 'ian'}, {user: 1});
*/
/*var ian = sign({user:'ian'}).user;
var mathias = sign({user:'mathias'}).user;

pubsub.subscribe({to: ian, from: {$trusted:'user', $any:'mathias'}},console.log);
pubsub.publish({to:'ian', from: mathias, message:'secret stuff'},{to:'user'});
*/
//pubsub.subscribe(sign({user:'ian'}, console.log);
//pubsub
/*
pubsub.subscribe({hello : {$trusted:'hello', value:'world'}}, function(doc) {
	console.log('signed hello ' + JSON.stringify(doc));
});

pubsub.publish(sign({hello:'world'})); // signed hello
pubsub.publish({hello:'world'}); // unsigned hello


pubsub.subscribe(sign({hello:'world'}), function(doc) {
	console.log('trusted hello' + JSON.stringify(doc));
});
pubsub.publish({hello:{$trusted:'hello', value:'world'}}); // only available to signed subscriptions
pubsub.publish({hello:'world'}); // available to everybody
*/
/*mutual trust*/
/*
pubsub.subscribe(join({greet:{$trusted:'greet', value:'hi'}},sign({hello:'world'})), function(doc) {
	console.log('mutual trust ' + JSON.stringify(doc));
});

pubsub.publish(join({hello:{$trusted:'hello', value:'world'},m:1},sign({greet:'hi'})));
pubsub.publish(join({hello:{$trusted:'hello', value:'world'},m:2},{greet:'hi'}));
pubsub.publish(join({hello:'world',m:3},sign({greet:'hi'})));
*/
/*
var query = sign({user:'ian'});
query.hello = {$trusted:1, value:'mundo'};
console.log(query);

pubsub.subscribe(query, console.log());

var doc = sign({hello: 'mundo'});
doc.user = {$trusted:1, $any:['ian']};

pubsub.publish(doc);
pubsub.publish({hello:'world', user:'ian'}); // unsigned hello
*/
/*
var pubsub = require('pubsub.io').connect('ian:secret_pass@hub.pubsub.io/mysubhub');

//token = pubsub.token(JSON.stringify(token));
//console.log(token);

// ------------------------------

var key = ...
var pubsubio = require('pubsub.io');
var sign = pubsubio.signer(key);
var pubsub = pubsubio.connect(..., key);


// -------------------------------

var pubsub = require('pubsub.io').connect(key, ...);

var server = require('router').create();

server.get('/authenticate/{user}/{password}',function(req,res) {
	...
});
...
// trusted client
pubsub.publish({origin:'dr'});
pubsub.subscribe();

// client
pubsub.subscribe({as:1,we:1,orgin: {$trusted:1, $any:'dr'}});


// auth - no pubsubbing

var sign = require('pubsub.io').signer(key);

// auth - with pubsubbing

var pubsub = require('pubsub.io').connect(url, key);
var sign = pubsub.sign;
*/