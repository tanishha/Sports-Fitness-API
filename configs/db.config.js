const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const conxnUrl = 'mongodb://localhost:27017';
const dbName = 'sports_fitness';
module.exports = {
    conxnUrl,
    dbName,
    MongoClient,
    oid: mongodb.ObjectID
}