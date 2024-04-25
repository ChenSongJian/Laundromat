require('dotenv').config();
const mongoose = require('mongoose');

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DATABASE,
} = process.env;

const mongoUrl = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/admin`;

mongoose.connect(mongoUrl);
const database = mongoose.connection.useDb(MONGO_DATABASE);
console.info(`Connected to MongoDB, using database ${MONGO_DATABASE}`);

module.exports = database;