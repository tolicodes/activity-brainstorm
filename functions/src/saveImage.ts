import * as functions from 'firebase-functions';
import { v4 as uuid } from 'uuid';
const cors = require('cors');
const firebase = require('firebase-admin');

import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const imageUrl = req.body.imageUrl + '';

  const { body } = await fetch(imageUrl);
  const split = imageUrl.split('.');

  const extension = split[split.length - 1];

  const bucket = await firebase.storage().bucket();

  const id = `${uuid()}.${extension}`

  const file = bucket.file(id);

  const stream = file.createWriteStream();

  return new Promise((resolve) => {
    // @ts-ignore
    body.pipe(stream).on('finish', async () => {
      console.log(`https://storage.googleapis.com/${bucket.name}/${id}`)
      await file.makePublic();
      res.json({
        url: `https://storage.googleapis.com/${bucket.name}/${id}`
      });
      resolve();
    });
  })
}));
