# Introduction

SimpleShard is a routing/sharding mechanism backed by any database, including transactional ones! The first storage implementation will use PostgreSQL. 

SimpleShard is perfect for workloads where activity can be divided based on a single key. All workloads for that key are sent to the same shard. Replication and fault tolerance is ***NOT*** handled by SimpleShard. The underlying storage system's native mechanisms are used for this purpose. In PostgresSQL's case this is WAL streaming or synchronous replication.

# Responsibilities

 * Route all requests to the appropriate node based on shard key 
 * Measure usage of each data set by shard key
 * Allow manual movement of data sets by shard key if data is **unbalanced**

# Components

 * ***Statistics Manager***
   * Monitor disk and memory usage for the given shard key
   * Report High usage to the administrator so he can decide what to do - increase size of node, move data etc...
 * ***Prefix Router***
   * Route requests to a given node
 * ***Relocator***
   * Allow movement of all data associated with a given shard key from one node to another
   * minimize downtime
