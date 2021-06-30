import { MongoClient, Db } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

if (!mongoUri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 */

let cached = (global as any).mongo;
// eslint-disable-next-line no-multi-assign
if (!cached) cached = (global as any).mongo = {};

const connectMongo: () => Promise<{
  client: MongoClient;
  db: Db;
}> = async () => {
  if (cached.conn) {
    if (process.env.NODE_ENV === 'development') console.log('[MongoDB] using existing connection.');
    return cached.conn;
  }
  if (!cached.promise) {
    if (process.env.NODE_ENV === 'development') console.log('[MongoDB] creating new promise.');
    const conn: any = {};
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ignoreUndefined: true,
      maxIdleTimeMS: 5000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    };
    cached.promise = MongoClient.connect(mongoUri, opts)
      .then((client) => {
        conn.client = client;
        return client.db(dbName);
      })
      .then((db) => {
        conn.db = db;
        cached.conn = conn;
      });
  }
  if (process.env.NODE_ENV === 'development') console.log('[MongoDB] creating new connection.');
  await cached.promise;
  return cached.conn;
};

export default connectMongo;
