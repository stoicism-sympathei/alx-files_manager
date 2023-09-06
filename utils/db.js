import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.db = null; // Initialize as null

    (async () => {
      try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        this.db = client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
    })();
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    if (!this.db) {
      return 0; // Return 0 if the database is not connected
    }
    return this.users.countDocuments();
  }

  async nbFiles() {
    if (!this.db) {
      return 0; // Return 0 if the database is not connected
    }
    return this.files.countDocuments();
  }

  async getUser(query) {
    if (!this.db) {
      return null; // Return null if the database is not connected
    }
    const user = await this.db.collection('users').findOne(query);
    return user;
  }
}

const dbClient = new DBClient();
export default dbClient;

