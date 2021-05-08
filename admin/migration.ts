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

  private migrateCategories() {
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

  private migrateKinds() {
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

  private migrateRules() {
    const src = `rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /finances/{userId}/{document=**} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        match /kinds/{kindId} {
          allow read: if true;
        }
        match /categories/{categoryId} {
          allow read: if true;
        }
      }
    }`;
    admin.securityRules().releaseFirestoreRulesetFromSource(src).then(() => {
      console.log('[rules] migration succeeded!');
    }).catch(() => {
      console.log('[rules] migration failed!');
    });
  }

  private commit() {
    this.batch.commit().then(() => {
      console.log('[categories, kinds] migration succeeded!');
    }).catch(() => {
      console.error('[categories, kinds] migration failed!');
    });
  }

  public migrate() {
    migration.migrateCategories();
    migration.migrateKinds();
    migration.commit();
    migration.migrateRules();
  }
}

const migration = new Migration();
migration.migrate();
