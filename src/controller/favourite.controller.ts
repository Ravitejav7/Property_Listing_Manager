import { Request, Response } from "express";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/favourite.service";
import { AuthRequest } from "../types/auth.type";

class FavouriteController {
  public add = async (req: AuthRequest, res: Response) => {
    try {
      const result = await addFavorite(
        req.user!._id.toString(),
        req.params.propertyId
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  public remove = async (req: AuthRequest, res: Response) => {
    try {
      const result = await removeFavorite(
        req.user!._id.toString(),
        req.params.propertyId
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  public list = async (req: AuthRequest, res: Response) => {
    try {
      const favorites = await getFavorites(req.user!._id.toString());
      return res.json(favorites);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };
}

export default new FavouriteController();
