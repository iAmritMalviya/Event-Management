const { MongoClient } = require('mongodb');
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function collection(collectionName) {
  const databaseName = 'challenges'

  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(databaseName);
    return db.collection(collectionName)   
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }

}
function close() {
  client.close()
  console.log('Disconnected from mongo');
}
module.exports = {
  collection,
  close
};
