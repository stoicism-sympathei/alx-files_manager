import authUtils from '../utils/auth';

class FilesController {
  static async postUpload(req, res) {
    const result = await authUtils.authCheck(req);

    if (result.status === 400) {
      return res.status(result.status).send(result.payload);
    }

    return res.send('Youpi');
  }
}

export default FilesController;
