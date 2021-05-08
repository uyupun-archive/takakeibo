import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';

class Migration {
  private db: firestore.Firestore;
  private batch: firestore.WriteBatch;

  constructor() {
    dotenv.config();
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.DATABASE_URL
    });
    this.db = admin.firestore();
    this.batch = this.db.batch();
  }

  public migrateCategories() {
    const categories = require('./data/categories.json');
    categories.forEach((category: string, idx: number) => {
      const id = idx + 1;
      const ref = this.db.collection('categories').doc(`${id}`);
      this.batch.set(ref, {
        id,
        name: category
      });
      console.log(`[categories] ${id}: ${category}`);
    });
  }

  public migrateKinds() {
    const kinds = require('./data/kinds.json');
    kinds.forEach((kind: string, idx: number) => {
      const id = idx + 1;
      const ref = this.db.collection('kinds').doc(`${id}`);
      this.batch.set(ref, {
        id,
        name: kind
      });
      console.log(`[kinds] ${id}: ${kind}`);
    });
  }

  public migrateRule() {

  }

  public commit() {
    this.batch.commit().then(() => {
      console.log('migration succeeded!');
    }).catch(() => {
      console.error('migration failed!');
    });
  }
}

const migration = new Migration();
migration.migrateCategories();
migration.migrateKinds();
