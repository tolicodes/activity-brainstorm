import { v4 as uuid } from 'uuid';
const firebase = require('firebase-admin');

import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

export default async (extension: string, body: any) => {
  const bucket = await firebase.storage().bucket();
  const id = `${uuid()}.${extension}`
  const file = bucket.file(id);
  const stream = file.createWriteStream();

  return new Promise((resolve) => {
    // @ts-ignore
    body.pipe(stream).on('finish', async () => {
      await file.makePublic();
      const url = `https://storage.googleapis.com/${bucket.name}/${id}`;
      resolve(url);
    });
  });
}