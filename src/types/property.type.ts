import { Types,Document } from 'mongoose';
export interface IProperty extends Document {
  id: string;
  title?: string;
  type?: string;
  price?: number;
  state?: string;
  city?: string;
  areaSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string;
  furnished?: string;
  availableFrom?: Date;
  listedBy?: string;
  tags?: string;
  colorTheme?: string;
  rating?: number;
  isVerified?: boolean;
  listingType?: string;
  createdBy: Types.ObjectId;
}
