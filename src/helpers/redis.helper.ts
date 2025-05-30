import stableStringify from "json-stable-stringify";
import { PropertyFilter } from "../types/filter.type";
import redisClient from "../utils/redisClient.util";

/**
 * Generates a consistent cache key for filtered property queries.
 */
export const generateFilterCacheKey = (filter: PropertyFilter): string => {
  const stableStr = stableStringify(filter);

  // Sanity check (should never fail with valid input)
  if (typeof stableStr !== "string" || !stableStr.trim()) {
    throw new Error("Filter stringify failed");
  }

  return `properties:filter:${Buffer.from(stableStr).toString("base64")}`;
};

/**
 * Deletes all cached filtered property results from Redis.
 */
// export async function invalidateFilterCache(): Promise<void> {
//   try {
//     const keys = await redisClient.keys("properties:filter:*");

//     if (keys.length === 0) return;

//     await redisClient.del(...(keys as [string, ...string[]]));
// } catch (error: any) {
//     console.error("Failed to invalidate filter cache:", error.message);
//   }
// }
