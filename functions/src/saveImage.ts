import * as functions from 'firebase-functions';
const cors = require('cors');

import uploadImageToStorage from './uploadImageToStorage';
import fetchImage from './fetchImage'

export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const { extension, body } = await fetchImage(req.body.imageUrl);

  res.json({
    url: await uploadImageToStorage(extension, body)
  });
}));
