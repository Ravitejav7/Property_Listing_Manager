import { Router } from "express";
import authroute from "./routes/auth.route";
import propertyroute from "./routes/property.route";
import favouriteroute from "./routes/favourite.route";
const router = Router();

router.use("/auth", authroute);
router.use('/property',propertyroute);
router.use('/favourite',favouriteroute);

export default router;
