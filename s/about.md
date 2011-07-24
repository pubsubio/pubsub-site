Pubsub.io is an attempt to change the way we publish and consume live data. It does so by **focusing on the data**

## not channels

When you think of a publish subscribe system you immediately think of channels, meaning that clients publish and subscribe to data on a channel. Maybe this is modeled after sockets or maybe its an analog to the radio spectrum and its frequencies, it really doesn't matter, the only thing that matters here is that its limiting.
Channels get the data across to the other side, they achieve this by strongly coupling the sender and the receiver. They need to have a agreement about the data, its size, format, contents, frequency, etc. A data stream thats appropriate to a desktop client is useless to a slim mobile client that might need a fraction of the data at more forgivable intervals. In short, data transmitted over a channel is **difficult to repurpose**. Another issue is that **data lives across channels**. To address this issue, patterns emerge on top of the channels, and you start to use channels as namespaces. Systems try to remedy this by allowing wildcard or pattern matching on channel names, this patches the immediate problem. But encoding state into the channel name, and doing string matching to collect the data you need from across channel is a hack. Another issue is authentication, all data transmitted over a channel shares the same level of permission. You cant granulate your permissions without creating new channels.

## queries

Channels are by definition coupled. The idea for pubsub.io was inspired by how databases decrease coupling. A database provides a clean interface to your data, the interface to the data is the data itself. You might put data in buckets, i.e. tables or collection, but you always (albeit key-value stores) access the data by defining the data you want, meaning you access the data though a query language. You can argue that since we started using databases we've hardly looked back. We separate our data from our code and access it though some sort of query language.

## pubsub.io 

Pubsub.io adds the interface of a database to a publish subscribe system. Meaning that you subscribe to queries, you can preform select statements, you can even control the datas frequency. In order to do this we needed to create a [query language](/docs) and a reverse query matcher. The reverse query matcher basically stores a collection of queries and matches incoming data against these. The [query language](/docs) is inspired by monogdb's query language. Data needs to be protected, as a provider (publisher) you want to know that you data is safe, but as a consumer (subscriber) you care about the datas integrity. Authentication and verification are supported by the language. Unlike most, pubsub.io authenticates the data, by authenticating the data item's properties, not the connection, transport, or channel. We have even added experimental support for data specific queries. We currently support advanced date time and very simple geo queries.
If you need a pipe, don't use pubsub.io, granted you could use it and it would work just as well as any other pipe, but its more than that, and you should use it as more. Pubsub.io is not for everybody. Some problems are better solved by key-value stores than by RDBMS databases, the same principle applies to pubsub.io.

## future

Pubsub.io is written 100% in nodejs, but its meant to be used by any platform. Live clients currently exist for the browser and nodejs. The system is not meant to be one transport only, we currently support live connection through web sockets, with fallbacks and non live transports, thorough web hooks. We've even added a http publish interface, so anybody can publish to pubsub.io. In the near future we will be working on adding more fallback mechanisms to the transport layer, adding support for clustering, dynamically indexing the queries as they come in, creating sample applications, improving the documentation, documenting the protocol, building more client libraries, ...

## help

Its still early days and as you can see there is lots left to do. So if you'd like to help, any of the above you be a great [place to start](https://github.com/pubsubio/)
