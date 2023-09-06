import { ObjectId } from 'mongodb';
import dbClient from './db';
import redisClient from './redis';

class AuthUtils {
  async authCheck(req) {
    this.key = `auth_${req.get('X-Token')}`;
    this.users = await dbClient.database.collection('users');

    this.userId = await redisClient.get(this.key);
    this.user = await this.users.findOne({ _id: new ObjectId(this.userId) });

    if (!this.user) return { status: 401, payload: { error: 'Unauthorized' } };
    return {
      status: 200,
      payload: { id: this.user._id, email: this.user.email },
    };
  }
}

const authUtils = new AuthUtils();
export default authUtils;
