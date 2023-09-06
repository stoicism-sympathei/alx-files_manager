import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || 27017;
    const DB_DATABASE = process.env.DB_DATABASE || 'files_manager'; // Fix the environment variable name

    MongoClient.connect(`mongodb://${DB_HOST}:${DB_PORT}`, {
      useUnifiedTopology: true,
    })
      .then((client) => {
        this.database = client.db(DB_DATABASE);
        console.log('Connected to the database'); // Add a log to confirm the connection
      })
      .catch((err) => {
        console.error('Error connecting to the database:', err); // Handle connection errors
      });
  }

  isAlive() {
    return !!this.database;
  }

  async nbUsers() {
    return this.database.collection('users').countDocuments({});
  }

  async nbFiles() {
    return this.database.collection('files').countDocuments({});
  }
}

const dbClient = new DBClient();
export default dbClient;

