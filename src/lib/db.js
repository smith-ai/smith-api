import { MongoClient } from 'mongodb';

let db;

const connect = async () => {
    let client = new MongoClient('mongodb://mongo');

    client = await client.connect();

    db = client.db('smith');
};

export {
    db,
    connect,
};
