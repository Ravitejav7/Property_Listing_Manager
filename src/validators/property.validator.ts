import Joi from "joi";

export const propertySchema = Joi.object({
  title: Joi.string().required(),
  type: Joi.string()
    .valid("Apartment", "Villa", "Studio", "Penthouse", "Bungalow")
    .required(),
  price: Joi.number().min(0).required(),
  state: Joi.string().required(),
  city: Joi.string().required(),
  areaSqFt: Joi.number().min(0).required(),
  bedrooms: Joi.number().min(0).required(),
  bathrooms: Joi.number().min(0).required(),
  amenities: Joi.string().required(),
  furnished: Joi.string().valid("Furnished", "Unfurnished", "Semi").required(),
  availableFrom: Joi.date().iso().required(),
  listedBy: Joi.string().valid("Owner", "Builder", "Agent").required(),
  tags: Joi.string().allow(""),
  colorTheme: Joi.string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .required(),
  rating: Joi.number().min(0).max(5).required(),
  isVerified: Joi.boolean().required(),
  listingType: Joi.string().valid("rent", "sale").required(),
});



export const updateSchema = Joi.object({
  title: Joi.string(),
  type: Joi.string().valid(
    "Apartment",
    "Villa",
    "Studio",
    "Penthouse",
    "Bungalow"
  ),
  price: Joi.number(),
  state: Joi.string(),
  city: Joi.string(),
  areaSqFt: Joi.number(),
  bedrooms: Joi.number(),
  bathrooms: Joi.number(),
  amenities: Joi.string(),
  furnished: Joi.string(),
  availableFrom: Joi.date(),
  listedBy: Joi.string(),
  tags: Joi.string(),
  colorTheme: Joi.string(),
  rating: Joi.number(),
  isVerified: Joi.boolean(),
  listingType: Joi.string(),
}).min(1); // Ensures at least one field is sent


export const filterSchema = Joi.object({
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    location: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    type: Joi.string().valid("Apartment", "Villa", "Studio", "Penthouse", "Bungalow"),
    amenities: Joi.alternatives().try(
      Joi.string(), // comma-separated
      Joi.array().items(Joi.string())
    ),
    furnished: Joi.string().valid("Unfurnished", "Semi", "Furnished"),
    listingType: Joi.string().valid("rent", "sale"),
    availableFrom: Joi.date().iso(),
    tags: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
      )
}).custom((obj, helpers) => {
    if (obj.minPrice !== undefined && obj.maxPrice !== undefined && obj.minPrice > obj.maxPrice) {
      return helpers.error("any.invalid", {message:"minPrice cannot be greater than maxPrice"});
    }
    return obj;
});
  