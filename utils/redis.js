const redis = require('redis');
const { promisify } = require('util');
// class to create the redis client
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });
  }

  // connection to Redis validator
  isAlive() {
    return this.client.connected;
  }

  // getter function
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  // setter function
  async set(key, value, duration) {
    this.client.set(key, value);
    this.client.expire(key, duration);
  }

  // delete function
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
