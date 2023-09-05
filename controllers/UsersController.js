import sha1 from 'sha1';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).send({
        error: 'Missing email',
      });
    }
    if (!password) {
      res.status(400).send({
        error: 'Missing password',
      });
    }

    const existEmail = await dbClient.users.findOne({ email });
    if (existEmail) {
      return res.status(400).send({
        error: 'Already exist',
      });
    }

    let createdUser;

    try {
      createdUser = await dbClient.users.insertOne({
        email,
        password: sha1(password),
      });
    } catch (err) {
      return res.status(500).send({
        error: 'Error while creating an user',
      });
    }

    const newUser = {
      id: createdUser.insertedId,
      email,
    };

    return res.send(201).send(newUser);
  }
}
