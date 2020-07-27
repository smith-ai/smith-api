import { MongoClient } from 'mongodb';

// Persistent MongoDB connection instance
let db;

/**
 * Connect to MongoDB, creating a peristent connection
 */
const connect = async () => {
  let client = new MongoClient('mongodb://mongo');

  client = await client.connect();

  db = client.db('smith');
};

export {
  db,
  connect,
};
