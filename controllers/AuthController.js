import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import authUtils from '../utils/auth';

class AuthController {
  static async getConnect(req, res) {
    const users = await dbClient.database.collection('users');
    const [email, password] = Buffer.from(
      req.get('authorization').trim().split(' ')[1],
      'base64',
    )
      .toString('ascii')
      .split(':');

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const existingUser = await users.findOne({ email, password: hashedPwd });
    if (!existingUser) return res.status(401).send({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, existingUser._id, 24 * 60 * 60);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const key = `auth_${req.get('X-Token')}`;
    const result = await authUtils.authCheck(req);

    if (result.status === 400) {
      return res.status(result.status).send(result.payload);
    }

    await redisClient.del(key);
    return res.status(200).send();
  }
}

export default AuthController;
