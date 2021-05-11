import dotenv from 'dotenv';
import * as fs from 'fs';
import * as admin from 'firebase-admin';
import {firestore} from 'firebase-admin';
import {Category} from './models/category';

class Migration {
  private db: firestore.Firestore;
  private batch: firestore.WriteBatch;

  constructor() {
    dotenv.config();
    let serviceAccount = require('./serviceAccountKeyDev.json');
    if (process.env.ENV === 'production')
      serviceAccount = require('./serviceAccountKeyProd.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.DATABASE_URL
    });
    this.db = admin.firestore();
    this.batch = this.db.batch();
  }

  private migrateCategories() {
    const categories: Array<Category> = require('./data/categories.json');
    categories.forEach((category: Category) => {
      const ref = this.db.collection('categories').doc(`${category.id}`);
      this.batch.set(ref, category);
      console.log(`[categories] ${category.id}: ${category.name}`);
    });
  }

  private migrateRules() {
    const src = fs.readFileSync('./data/rules.txt', {encoding: 'utf-8'});
    admin.securityRules().releaseFirestoreRulesetFromSource(src).then(() => {
      console.log('[rules] migration succeeded!');
    }).catch(() => {
      console.log('[rules] migration failed!');
    });
  }

  private commit() {
    this.batch.commit().then(() => {
      console.log('[categories] migration succeeded!');
    }).catch(() => {
      console.error('[categories] migration failed!');
    });
  }

  public migrate() {
    migration.migrateCategories();
    migration.commit();
    migration.migrateRules();
  }
}

const migration = new Migration();
migration.migrate();
