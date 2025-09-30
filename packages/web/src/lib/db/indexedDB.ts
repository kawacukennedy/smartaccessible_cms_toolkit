
// packages/web/src/lib/db/indexedDB.ts

import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'SmartAccessibleCMS';
const STORE_NAME = 'offlineContent';
const DB_VERSION = 1;

interface OfflineContent {
  id: string;
  content: string;
  timestamp: number;
  status: 'draft' | 'pending_sync';
}

let db: IDBPDatabase<unknown>;

async function initDB() {
  if (!db) {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return db;
}

export async function saveContentToIndexedDB(id: string, content: string, status: 'draft' | 'pending_sync' = 'draft') {
  const database = await initDB();
  await database.put(STORE_NAME, { id, content, timestamp: Date.now(), status });
}

export async function getContentFromIndexedDB(id: string): Promise<OfflineContent | undefined> {
  const database = await initDB();
  return database.get(STORE_NAME, id);
}

export async function getAllOfflineContent(): Promise<OfflineContent[]> {
  const database = await initDB();
  return database.getAll(STORE_NAME);
}

export async function deleteContentFromIndexedDB(id: string) {
  const database = await initDB();
  await database.delete(STORE_NAME, id);
}

export async function updateContentStatusInIndexedDB(id: string, status: 'draft' | 'pending_sync') {
  const database = await initDB();
  const content = await database.get(STORE_NAME, id);
  if (content) {
    await database.put(STORE_NAME, { ...content, status, timestamp: Date.now() });
  }
}
