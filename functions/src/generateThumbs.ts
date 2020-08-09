import * as functions from 'firebase-functions';
const cors = require('cors');
const firebase = require('firebase-admin');
const sharp = require('sharp');

import fetchImage from './fetchImage';
import uploadImageToStorage from './uploadImageToStorage';

const RESIZE_SIZE = 500;

export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const activities = firebase.firestore().collection('activities');
  const docs = (await activities.get()).docs;

  for (let i = 0; i <= docs.length; i++) {
    const doc = docs[i];

    const { thumbnailUrl, image } = doc.data();

    if (!thumbnailUrl) {
      const { extension, body } = await fetchImage(image, {
        toBuffer: true
      });

      const resized = await sharp(body)
        .resize(RESIZE_SIZE, RESIZE_SIZE)
        .max();

      const url = await uploadImageToStorage(extension, resized);

      activities.doc(doc.id).update({
        thumbnailUrl: url
      });
    }
  }
}));