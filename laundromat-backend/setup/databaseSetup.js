require('dotenv').config();
const database = require('./databaseConnect.js');
const { defaultCollections, defaultCollectionData } = require('./defaultData.js');

async function setupDatabase() {
    // initialise default database and collections if not created
    try {
        for (const collection of defaultCollections) {
            await buildDefaultCollection(database, collection);
        }
    } catch (error) {
        mongoose.disconnect();
        throw(error);
    }
}

async function buildDefaultCollection(database, collection) {
    console.log(`Checking collection ${collection}...`);
    await database.createCollection(collection);
    
    const count = await database.collection(collection).countDocuments();
    if (count === 0 && defaultCollectionData[collection]) {
        console.log(`Collection ${collection} is empty, inserting default data.`);
        await database.collection(collection).insertMany(defaultCollectionData[collection]);
    } else {
        console.log(`Collection ${collection} already has data or no default data provided, skip inserting.`);
    }
}

module.exports = setupDatabase;
