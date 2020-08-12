import * as functions from 'firebase-functions';
const cors = require('cors');



export default functions.https.onRequest((req, res) => cors()(req, res, async () => {
  const db = firebase.firestore();

  const { collection } = req.params;

  const index: any = {};

  (await db.collection(collection).get()).docs.forEach((doc: any) => {
    const data = doc.data();

    Object.entries(data).forEach(([key, value]) => {
      const propIndex = index[index];
      if (!index[key]) index[key] = {};

      if (typeof value === 'string') {
        const valueArray = propIndex[value];
        if (!valueArray) propIndex[value] = [];

        valueArray.push(doc.id);
      }
    });
  });

  res.json(index);
}));