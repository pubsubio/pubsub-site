var pubsub = require('pubsub.io').connect();

pubsub.subscribe({hi:3},{id:1}, console.log);

pubsub.publish({hi:3,s:32341234,r:2341234,dw:['dsfa','asdf'],id:12});