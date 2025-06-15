import mongoose from "mongoose";

// Get MongoDB connection string from environment variables and ensure it exists
// The exclamation mark (!) tells TypeScript that this value will not be null or undefined
const MONGODB_URI = process.env.MONGODB_URI!;

// Error handling to make sure the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error("Please define mongo_uri in env variables");
}

// Check if we already have a cached connection to avoid multiple connections
// This is important for serverless environments where functions can be reused
let cached = global.mongoose;

// Initialize the cached object if it doesn't exist yet
// This happens on the first run or after server restart
if (!cached) {
  cached = global.mongoose = { 
    connection: null, // Stores the active connection
    promise: null     // Stores the promise of a connection being established
  };
}

/**
 * Establish a connection to MongoDB or return an existing connection
 * This pattern ensures we reuse connections rather than creating new ones on every request
 * @returns {Promise<mongoose.Connection>} The mongoose connection object
 */
export async function connectionToDatabase() {
  // If we already have an active connection, return it immediately
  if (cached.connection) {
    return cached.connection;
  }

  // If no connection process has started yet, initiate a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,  // Queue operations until connection is established
      maxPoolSize: 10,       // Limit maximum number of concurrent connections
    };

    // Create a connection and store the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    // Await the connection promise and store the active connection
    cached.connection = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise so we can try again next time
    cached.promise = null;
    throw error;
  }
}
  // Return the established connection