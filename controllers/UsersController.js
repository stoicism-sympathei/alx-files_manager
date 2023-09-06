import { createHash } from 'crypto';
import authUtils from '../utils/auth';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    const users = await dbClient.database.collection('users');

    if (!email) return res.status(400).send({ error: 'Missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'Already exist' });

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const newUserData = { email, password: hashedPwd };
    const result = await users.insertOne(newUserData);

    return res.status(201).send({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const result = await authUtils.authCheck(req);
    return res.status(result.status).send(result.payload);
  }
}

export default UsersController;
