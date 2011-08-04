A query based client/server publish subscribe protocol built on node.js.

# Connect

Connect to a sub hub

	// connect to localhost on port 9999 on the chat sub hub
	var pubsub = require('pubsub.io').connect('localhost:9999/chat');

	// or connect to the default sub hub
	var pubsub = require('pubsub.io').connect('localhost:9999');

	// connect to the default port
	var pubsub = require('pubsub.io').connect('localhost');
	
# Publish

Whenever you want to send documents to other pubsub.io clients you need to publish it.
The published document is then received by all subscribers whose query match the document.

	pubsub.publish({name: 'pubsub', authors: ['mathias', 'ian'], version: 0.1});

# Subscribe

Whenever you want to receive documents from other pubsub.io clients you need to create a subscription with a query.
The subscription is evaluated at the hub against all documents as they are published, if the query matches the published document your subscription handler will invoked with the document.

	pubsub.subscribe({name: 'pubsub', version: {$gt:0}}, function(doc) {
		console.log('i love', doc);
	});

You can choose to filter the document with a selection.

	pubsub.subscribe(query, {property1:1, property2:1}, function(doc){
		console.log(doc); // will only contain the selected properties
	});

# Unsubscribe

In order to unsubscribe a subscription, you call the function returned when subscribing

	var unsub = pubsub.subscribe({foo:'bar'},function(doc) {
		console.log(doc);
	}); // creates the subscription

	unsub(); // removes the subscription

# Token and authentication

As a subscriber you can use authentication to make sure that you can trust the data you subscribe to. In order to do this the publisher must provide signed 'authenticated' properties. The signed properties are provided by the token.

As a publisher you can use authentication to limit the subscribers by the data by demanding that they use signed properties in their subscription queries.

	var token = ... get authtoken from you authentication enpoint
	// in order for the hub to verifed the signed token it need to share key with the authentication enpoint

	// we subscribe as a signed user so publishers can trust us
	pubsub.subscribe({to: token.user, from: {$authenticated:'user',value:'transmitter'}}, function(doc) {
	 // the doc.from was authenticated as a user, the doc can therefore be trusted
	});

	// we want to limit the subscribers to authenticated users only
	pubsub.publish({to: {$authenticated:'user', value:'receiver'},from: token.user});

# The Query Language

The query language syntax is derived from the query language of <a href="http://mongodb.com">mongodb</a>. 
In general any property of a query that is not a language property represents a `===` relation,
except if it is a regex - it is then the same as a `$regex` relation.

The language consists of 2 parts. The outer language `{$outer:...}` and the inner language `{prop:{$inner:...}}`.

## The outer language

`$has: key(s)` checks if the document has the given keys. multiple has an `and` relation 
`$or: [paths]` define multiple query paths

	var query = {
	 $or: [{
	     name:'pubsub.io' // check where the name is pubsub.io
	 }, {
	     {$has:'alias'}   // or wether it has a property called alias
	 }]
	};

## The inner language

`$exists: bool`    checks if the given property exists 
`$nil: bool`       is `undefined` or `null`  

	var query = {
		name: {$nil:false},   // will reject if name is null or undefined
		coupling: {$exists:false} // document must not have a property called coupling
	};

`$any: value(s)`   is equal to any of the values 
`$regex: regex`    must match regex 
`$like: substring`    property must have a substring which is case-insensitive equal to substring  

	var query = {
		name: {$any:['mathias', 'ian']},  // name must be equal to either mathias or ian
		project: /pubsub\.io/i            // project should have a substring pubsub.io in any case
	};

`$gt: num`         must be strictly greater than the num 
`$gte: num`        must be greater or equal than the num 
`$lt: num`         must be strictly lower than the num 
`$lte: num`        must be lower or equal than the num 
`$mod: [base,val]` same as `property % base === val`  

	var query = {
		age: {$gt:20, $lte:40, $mod:[2,0]} // only match even ages between 20+ and 40        
	};

`$distance: circle`        check if point is within a circle  `{lat:0,lon:0}` with radius `800 km|m|mi|yd|ft`

	var query = {point: {$distance: {center: {lat:0,lon:0}, radius:'800 km'}}};

`$datetime: pattern`    query against dates. Pattern format: day? date? month? year? hour:minute:second e.g. `Monday 22 August 2011 10:30:01`

	var query = {
		time : {$datetime: 'monday 2011'} // matches dates on mondays in 2011
	};

	var query = {
	 time : {$datetime: '10:30:00'} // matches dates every day at 10:30:00 am 
	};

	var query = {
	 time : {$datetime : '10:--:--'} // matches dates every day at 10 for the entire hour 
	};

`$not: value`      must not be equal to value or match value if it is a regex  

All language properties can be negated by putting `$not` in front of it,
i.e. `$notnil` checks if a property is different from `undefined` and `null`

	var query = {
	 friend: {$notlike:'nemesis'} // our friend must not contain the substring nemesis
	};

# HTTP Publish interface

Messages can be published via an http post request. We did this so any client that can do http, can be a publisher.

This is how you publish to the default hub

	curl http://localhost:9999/publish -d '{"doc":{"hello":"world"}}'

This is how you publish to a sub hub

	curl http://localhost:9999/subhub/publish -d '{"doc":{"hello":"sub"}}'
		
# Transport protocol

Messages are sent via a simple json based protocol

## prerequisites

all low level transports to the server are using the [websocket protocol](http://en.wikipedia.org/wiki/WebSockets)  
all websocket messages in pubsub consists entirely of JSON.

## handshake

the first message after connecting is a handshake.  
as each connection is currently bound to a specific `subhub` it needs to be specified here. 

	{sub:name_of_subhub}

## subscribe / unsubscribe

if you want to subscribe to a query you send the following message:

	{name:'subscribe', query:your_query, challenge:your_auth_challenge, id:your_own_subscription_id}

where `challenge` is optional.  
the `id` is your own id for this subscription. The hub will notify you whenever your subscription is matched by sending the following message:

	{name:'publish', doc:the_matches_document, id:your_subscription_id}

to unsubscribe you send the following message:

	{name:'unsubscribe', id:_your_subscription_id}

## publish

to publish a document just send the following message:

	{name:'publish', doc:your_document}
