import { Router, Request, Response } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { AuthRequest } from "../types/auth.type";
import propertyController from "../controller/property.controller";

const router = Router();

router.post("/", authMiddleware,propertyController.postData);

router.get("/", propertyController.getAllData);

router.get("/filter", propertyController.filterData);

router.get("/:id", propertyController.getDatabyId);

router.put("/:id", authMiddleware, propertyController.updateData);

router.delete(
  "/:id",
  authMiddleware,
  propertyController.deleteDatabyId
);


export default router;
