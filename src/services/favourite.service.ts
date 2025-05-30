import User from "../models/user.model";
import Property from "../models/property.model";

/**
 * Find property by custom string ID (e.g., PROP2001)
 */
const findPropertyByCustomId = async (propertyId: string) => {
  return await Property.findOne({ id: propertyId });
};

export const addFavorite = async (userId: string, propertyId: string) => {
  const property = await findPropertyByCustomId(propertyId);
  if (!property) throw new Error("Property not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.favorites) user.favorites = [];

  if (!user.favorites.includes(property.id)) {
    user.favorites.push(property.id);
    await user.save();

    // Fetch full property documents for all favorites after update
    const favoriteProperties = await Property.find({
      id: { $in: user.favorites },
    });

    return {
      message: "Property added to favorites",
      favorites: favoriteProperties,
    };
  } else {
    // Return full property documents, not just ids
    const favoriteProperties = await Property.find({
      id: { $in: user.favorites },
    });
    return {
      message: "Property already exists",
      favorites: favoriteProperties,
    };
  }
};

export const removeFavorite = async (userId: string, propertyId: string) => {
  const property = await findPropertyByCustomId(propertyId);
  if (!property) throw new Error("Property not found");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.favorites) user.favorites = [];

  const index = user.favorites.indexOf(property.id);
  if (index === -1) {
    // Return full property documents, not just ids
    const favoriteProperties = await Property.find({
      id: { $in: user.favorites },
    });
    return {
      message: "Property not found in favorites",
      favorites: favoriteProperties,
    };
  }

  user.favorites.splice(index, 1);
  await user.save();

  const favoriteProperties = await Property.find({
    id: { $in: user.favorites },
  });

  return {
    message: "Property removed from favorites",
    favorites: favoriteProperties,
  };
};

export const getFavorites = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.favorites || user.favorites.length === 0) return [];

  const properties = await Property.find({ id: { $in: user.favorites } });
  return properties;
};
