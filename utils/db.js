const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

// constructor that creates a client to MongoDB
class DBClient {
  constructor() {
    MongoClient.connect(url, (err, client) => {
      if (!err) {
        this.db = client.db(database);
      } else {
        this.db = false;
      }
    });
  }

  // connection to MongoDB
  isAlive() {
    if (this.db) return true;
    return false;
  }

  // documents in the collection users
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  // documents in the collection files
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
