# Introduction

SimpleShard is a routing/sharding mechanism backed by any database, including transactional ones! The first storage implementation will use PostgreSQL. 

SimpleShard is perfect for workloads where activity can be divided based on a single key. All workloads for that key are sent to the same shard. Replication and fault tolerance is ***NOT*** handled by SimpleShard. The underlying storage system's native mechanisms are used for this purpose. In PostgresSQL's case this is WAL streaming or synchronous replication.

# Install

    npm install simpleShard

# Run

    node index.js

# Connect to the repl

    nc localhost 5001

# Responsibilities

 * Route all requests to the appropriate node based on shard key 
 * Measure usage of each data set by shard key
 * Allow manual movement of data sets by shard key if data is **unbalanced**

# Principles
 * ACID transactions are sometimes needed
 * Horizontal Scaling of ACID transactions is sometimes needed 
 * It is always simpler to avoid distributed transactions and locks
 * Distributed transactions are slow
 * Routing based on a single key is easy 
 * Moving data is slow
 * Moving a lot of data is really slow
 * Autobalancing is not simple 
 * Manual data movement can be easy 
 * Humans understand when data movement is necessary
 * Good monitoring helps humans do their jobs
 * RAM is expensive
 * Disks are cheap
 * [SSDs](http://buyafuckingssd.com/) vastly improve random disk access, and hence joins
 * Time based data and range queries work very well in disk based SQL systems

# Components

 * ***Statistics Manager***
   * Monitor disk and memory usage for the given shard key
   * Report High usage to the administrator so he can decide what to do - increase size of node, move data etc...
 * ***Prefix Router***
   * Route requests to a given node
 * ***Relocator***
   * Allow movement of all data associated with a given shard key from one node to another
   * minimize downtime
