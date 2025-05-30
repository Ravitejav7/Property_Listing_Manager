import { createClient } from "redis";

let redisAvailable = false;
let redisErrorLogged = false;

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("connect", () => {
  redisAvailable = true;
  redisErrorLogged = false;
  console.log("✅ Redis connected");
});

redisClient.on("ready", () => {
  redisAvailable = true;
});

redisClient.on("end", () => {
  redisAvailable = false;
  console.warn("⚠️ Redis connection closed.");
});

redisClient.on("error", (err) => {
  redisAvailable = false;
  if (!redisErrorLogged) {
    console.warn("⚠️ Redis Client Error - caching disabled:", err.message);
    redisErrorLogged = true;
  }
});

// Initial connect attempt
(async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    redisAvailable = false;
    console.warn("⚠️ Redis not connected. Caching disabled.", error.message);
  }
})();

// Utility function to apply timeout to any Redis operation
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Redis timeout")),
      timeoutMs
    );
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function safeGet(key: string) {
  if (!redisAvailable) return null;
  try {
    return await withTimeout(redisClient.get(key), 1000); // 1s timeout
  } catch (err) {
    if (!redisErrorLogged) {
      console.warn(
        `⚠️ Redis operation failed (get): ${key}`,
        (err as Error).message
      );
      redisErrorLogged = true;
    }
    redisAvailable = false;
    return null;
  }
}

export async function safeSet(
  key: string,
  value: string,
  options?: { EX: number }
) {
  if (!redisAvailable) return;
  try {
    await withTimeout(redisClient.set(key, value, options), 1000);
  } catch (err) {
    if (!redisErrorLogged) {
      console.warn(
        `⚠️ Redis operation failed (set): ${key}`,
        (err as Error).message
      );
      redisErrorLogged = true;
    }
    redisAvailable = false;
  }
}

export async function safeDel(key: string) {
  if (!redisAvailable) return;
  try {
    await withTimeout(redisClient.del(key), 1000);
  } catch (err) {
    if (!redisErrorLogged) {
      console.warn(
        `⚠️ Redis operation failed (del): ${key}`,
        (err as Error).message
      );
      redisErrorLogged = true;
    }
    redisAvailable = false;
  }
}

export default redisClient;
