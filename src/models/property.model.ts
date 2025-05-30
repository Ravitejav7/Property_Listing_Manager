import {Model,model,Schema} from "mongoose";
import { IProperty } from "../types/property.type";
const propertySchema = new Schema<IProperty>(
  {
    id: { type: String, required: true, unique: true },
    title: String,
    type: String,
    price: Number,
    state: String,
    city: String,
    areaSqFt: Number,
    bedrooms: Number,
    bathrooms: Number,
    amenities: String,
    furnished: String,
    availableFrom: Date,
    listedBy: String,
    tags: String,
    colorTheme: String,
    rating: Number,
    isVerified: Boolean,
    listingType: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
const Property = model<IProperty,Model<IProperty>>("Property", propertySchema,"Property");

export default Property;