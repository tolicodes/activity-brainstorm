import { v4 as uuid } from 'uuid';

import firebase from 'firebase';
import firebaseConfig from './firebaseConfig'

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const activitiesCollection = db.collection("activities");
activitiesCollection.orderBy("lastUpdated", "desc");

export const createActivity = (activity: any) => (
  activitiesCollection.doc(uuid()).set({
    ...activity,
    lastUpdated: new Date(),
    created: new Date()
  })
);

export const updateActivity = (activity: any, updates: any) => (
  activity.update({
    ...updates,
    lastUpdated: new Date(),
  })
);

export const deleteActivity = (doc: any) => (
  doc.delete()
);
