import * as functions from 'firebase-functions';
const cors = require('cors');
const firebase = require('firebase-admin');

export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const activities = firebase.firestore().collection('activities');
  const docs = (await activities.get()).docs;

  for (let i = 0; i <= docs.length; i++) {
    const doc = docs[i];

    if (!doc) {
      return;
    }

    const { thumbnailUrl, imageUrl, created, lastUpdated, name } = doc.data();

    await activities.doc(doc.id).set({ thumbnailUrl, imageUrl, created: created || new Date(), lastUpdated: lastUpdated || new Date(), name });

    console.log(`Updated ${name}`);
  }

  res.json({
    done: true
  })
}));