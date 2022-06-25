/**
 * jobdurations/ingestion.js
 * Initialize the `jobdurations` collection in MongoDB.
 * To run, issue the following command at a terminal prompt in THIS directory:
 * node ingestion.js 'mongodb://user:password@host:port/databaseName'
 * e.g.
 * node ingestion.js 'mongodb://missionapi:Miss10Ns3cure!@localhost:27017/mission'
 */
const csv = require('csvtojson');
const { MongoClient } = require('mongodb');

const MONGO_URL_DEFAULT = 'mongodb://missionapi:Miss10Ns3cure!@localhost:27017/mission';

/**
 * Process command line arguments.
 * First argument should be MongoDB connection URL; otherwise use default
 */
const args = process.argv.slice(2);
const MONGO_URL = args[0] || MONGO_URL_DEFAULT;
console.log(`MONGO_URL: ${MONGO_URL}`);

const client = new MongoClient(MONGO_URL);

/**
 * Load an Excel data file and return the contents as a collection of objects
 * where each object represents a single row in the Excel sheet.
 * @param {string} [fileName='data.csv'] The name of the file containing Excel data. Default: 'data.csv'
 * @returns {Object[]} A JSON collection containing the file contents.
 */
const loadData = async (fileName = 'data.csv') => {
  return csv().fromFile(fileName);
};

/**
 * Initialize a MongoDB collection with records from the supplied Excel spreadhsheet file.
 * @param {string} collectionName The collection name. Required.
 * @param {string} fileName The Excel filename. Required.
 */
const initializeDatabase = async (collectionName, fileName) => {
  try {
    await client.connect();

    const rawData = await loadData(fileName);

    const result = await client.db().collection(collectionName).insertMany(rawData);
    console.log(`Number of documents inserted: ${result.insertedCount}`);
  } catch (err) {
    console.error(`Unable to initialize collection ${collectionName} with file ${fileName}.`, err);
    throw err;
  } finally {
    await client.close();
  }
};

initializeDatabase('jobdurations', 'jobdurations.csv').catch((err) => {
  console.error(err);
});
