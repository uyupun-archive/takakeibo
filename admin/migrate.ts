import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

const init = () => {
  const serviceAccount = require('serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  });
};

const migrateCategories = () => {

};

const migrateKinds = () => {

};

const migrateRule = () => {

};
