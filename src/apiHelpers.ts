import { v4 as uuid } from 'uuid';

import firebase from 'firebase';
import firebaseConfig from './firebaseConfig'

import debug from './helpers/debug'

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const activitiesCollection = db.collection("activities");
activitiesCollection.orderBy("lastUpdated", "desc");

export const eventsCollection = db.collection("events");
eventsCollection.orderBy("timeStart", "desc");

export const getCollection = (collectionName: string, {
  orderBy
}: {
  orderBy?: {
    field: string
    direction?: 'desc' | 'asc'
  }
} = {}) => {
  const collection = db.collection(collectionName);
  if (orderBy) {
    const {
      field,
      direction
    } = orderBy;
    collection.orderBy(field, direction);
  }
  return collection;
}

export const createEntity = (collection: any, entity: any) => {
  debug('apiHelpers/createEntity', 'creating entity', entity)

  return (
    collection.doc(uuid()).set({
      ...entity,
      lastUpdated: new Date(),
      created: new Date()
    })
  );
}

export const updateEntity = (entity: any, update: any) => (
  entity.update({
    ...update,
    lastUpdated: new Date(),
  })
);

export const deleteEntity = (doc: any) => (
  doc.delete()
);

export const createActivity = (entity: any) => createEntity(activitiesCollection, entity)

export const updateActivity = updateEntity;

export const deleteActivity = deleteEntity;
