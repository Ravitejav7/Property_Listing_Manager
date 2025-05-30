import Property from "../models/property.model";
import { PropertyFilter } from "../types/filter.type";
import { propertySchema, updateSchema } from "../validators/property.validator";
import mongoose from "mongoose";
import { safeGet, safeSet, safeDel } from "../utils/redisClient.util"; // <-- changed import
import { generateFilterCacheKey } from "../helpers/redis.helper";

export async function createProperty(data: any, userId: string) {
  const { error, value } = propertySchema.validate(data);
  if (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }
  const lastProperty = await Property.findOne({
    id: { $regex: /^PROP\d+$/ },
  })
    .sort({ id: -1 })
    .lean();

  let nextId = "PROP1000";

  if (lastProperty?.id?.startsWith("PROP")) {
    const lastNum = parseInt(lastProperty.id.replace("PROP", ""));
    nextId = `PROP${lastNum + 1}`;
  }

  const newProperty = new Property({ ...data, id: nextId, createdBy: userId });
  await newProperty.save();
  await safeDel("properties:all"); // safeDel instead of redisClient.del
  return newProperty;
}

export async function getAllProperties() {
  const cacheKey = "properties:all";
  const cached = await safeGet(cacheKey); // safeGet
  if (cached) {
    return JSON.parse(cached);
  }
  const property = await Property.find();
  await safeSet(cacheKey, JSON.stringify(property), { EX: 600 }); // safeSet
  return property;
}

export async function getPropertyById(id: string) {
  const cacheKey = `property:${id}`;
  const cached = await safeGet(cacheKey); // safeGet
  if (cached) {
    return JSON.parse(cached);
  }
  let property;
  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  if (isMongoId) {
    property = await Property.findById(id);
  }
  if (!property) {
    property = await Property.findOne({ id });
  }
  if (!property) throw new Error("Not found");

  await safeSet(cacheKey, JSON.stringify(property), { EX: 600 }); // safeSet
  return property;
}

export async function updateProperty(id: string, data: any, userId: string) {
  let property;
  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  if (isMongoId) {
    property = await Property.findById(id);
  }
  if (!property) {
    property = await Property.findOne({ id });
  }
  if (!property) throw new Error("Not found");

  if (property.createdBy.toString() !== userId) {
    throw new Error("Unauthorized");
  }
  delete data.id;
  delete data.createdBy;
  const { error, value } = updateSchema.validate(data);
  if (error) throw new Error(`Validation failed: ${error.message}`);

  Object.assign(property, value);
  await property.save();
  await safeDel(`property:${id}`); // safeDel
  await safeDel("properties:all"); // safeDel
  return property;
}

export async function deleteProperty(id: string, userId: string) {
  let property;
  const isMongoId = mongoose.Types.ObjectId.isValid(id);
  if (isMongoId) {
    property = await Property.findById(id);
  }
  if (!property) {
    property = await Property.findOne({ id });
  }
  if (!property) throw new Error("Not found");
  if (property.createdBy.toString() !== userId) throw new Error("Unauthorized");

  await property.deleteOne();
  await safeDel(`property:${id}`); // safeDel
  await safeDel("properties:all"); // safeDel
  return { message: "Property deleted" };
}

export const filterProperties = async (filter: PropertyFilter) => {
  const cacheKey = generateFilterCacheKey(filter);
  const cached = await safeGet(cacheKey); // safeGet
  if (cached) {
    return JSON.parse(cached);
  }
  const query: any = {};

  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    query.price = {};
    if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
    if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
  }

  if (filter.location) {
    query.location = { $regex: new RegExp(filter.location, "i") };
  }

  if (filter.city) {
    query.city = { $regex: new RegExp(filter.city, "i") };
  }

  if (filter.state) {
    query.state = { $regex: new RegExp(filter.state, "i") };
  }

  if (filter.bedrooms !== undefined) {
    query.bedrooms = filter.bedrooms;
  }

  if (filter.bathrooms !== undefined) {
    query.bathrooms = filter.bathrooms;
  }

  if (filter.type) {
    query.type = { $regex: new RegExp(`^${filter.type}$`, "i") };
  }

  if (filter.furnished) {
    query.furnished = { $regex: new RegExp(`^${filter.furnished}$`, "i") };
  }

  if (filter.amenities && filter.amenities.length > 0) {
    query.$and = filter.amenities.map((amenity: string) => ({
      amenities: { $regex: new RegExp(`(^|\\|)${amenity}(\\||$)`, "i") },
    }));
  }

  if (filter.listingType) {
    query.listingType = { $regex: new RegExp(`^${filter.listingType}$`, "i") };
  }

  if (filter.availableFrom) {
    query.availableFrom = { $gte: new Date(filter.availableFrom) };
  }

  if (filter.tags) {
    let pattern: string;
    if (Array.isArray(filter.tags)) {
      pattern = filter.tags
        .map((tag) => tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|");
    } else {
      pattern = filter.tags.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    query.tags = { $regex: new RegExp(pattern, "i") };
  }

  const properties = await Property.find(query);
  await safeSet(cacheKey, JSON.stringify(properties), { EX: 600 }); // safeSet
  return properties;
};
