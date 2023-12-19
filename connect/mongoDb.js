// MONGODB_URI
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { MONGODB_URI } = process.env;

const clientMongo = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


module.exports = clientMongo;
