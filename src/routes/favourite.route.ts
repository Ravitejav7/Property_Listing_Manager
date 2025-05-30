import { Router } from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import favouriteController from "../controller/favourite.controller";

const router = Router();

router.post("/:propertyId", authMiddleware, favouriteController.add);

router.delete(
  "/:propertyId",
  authMiddleware,
  favouriteController.remove
);

router.get("/", authMiddleware, favouriteController.list);

export default router;
