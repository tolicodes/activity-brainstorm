import firebaseConfig from './firebaseConfig';

export const firebase = require('firebase-admin');

firebase.initializeApp(firebaseConfig);
