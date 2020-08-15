import { v4 as uuid } from 'uuid';

import firebase from 'firebase';
import firebaseConfig from './firebaseConfig'

import debug from './helpers/debug'

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const createEntity = (collection: any, entity: any) => {
  debug('apiHelpers/createEntity')('creating entity', entity)

  return (
    collection.doc(uuid()).set({
      ...entity,
      lastUpdated: new Date(),
      created: new Date()
    })
  );
}

export const updateEntity = (entity: any, update: any) => {
  debug(`apiHelpers/updatingEntity`)('updating entity', {
    entity,
    update,
    imageUrl: update.imageUrl
  })
  return (
    entity.update({
      ...update,
      lastUpdated: new Date(),
    })
  );
}

export const deleteEntity = (doc: any) => (
  doc.delete()
);