import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easyshop';
// Check if the application is in build mode, which is when the `BUILD_WITH_MOCK_DB` environment variable is set
const IS_BUILD_MODE = process.env.BUILD_WITH_MOCK_DB === 'true';

if (!MONGODB_URI && !IS_BUILD_MODE) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached: MongooseCache = (global.mongoose as MongooseCache) || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  // If in build mode, return a mock connection object
  if (IS_BUILD_MODE) {
    console.log('Skipping MongoDB connection in build mode.');
    return {
      connection: {
        readyState: 1, // Mimic a connected state
      },
      // You can add other mock properties if your code needs them
    } as any;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('MongoDB connection error:', e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;