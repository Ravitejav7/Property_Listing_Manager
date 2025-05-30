type Furnishing = "Unfurnished" | "Semi" | "Furnished";
type ListingType = "rent" | "sale";
type PropertyType = "Apartment" | "Villa" | "Studio" | "Penthouse" | "Bungalow";

export interface PropertyFilter {
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  city?: string;
  state?: string;
  bedrooms?: number;
  bathrooms?: number;
  type?: PropertyType;
  amenities?: string[];
  furnished?: Furnishing;
  listingType?: ListingType;
  availableFrom?: Date | string;
  tags?: string[] | string;
}
