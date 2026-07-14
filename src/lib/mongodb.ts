import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum diatur di .env.local");
}

declare global {
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const cached = global.mongooseConn || {
  conn: null,
  promise: null,
};

global.mongooseConn = cached;

function safeMongoUriPreview(uri: string) {
  // Avoid leaking credentials; show only host/path part.
  try {
    const withoutProto = uri.replace(/^mongodb(\+srv)?:\/\//i, "");
    // Remove credentials if present: user:pass@
    const parts = withoutProto.split("@");
    const hostAndRest = parts.length > 1 ? parts[1] : withoutProto;
    // Keep it short
    return hostAndRest.length > 80 ? hostAndRest.slice(0, 80) + "…" : hostAndRest;
  } catch {
    return "[unavailable]";
  }
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log(
      `[MongoDB] Connecting using MONGODB_URI (preview): ${safeMongoUriPreview(MONGODB_URI)}`
    );
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;

    console.error("❌ MongoDB connection failed", {
      message: err instanceof Error ? err.message : String(err),
    });

    throw err;
  }
}

