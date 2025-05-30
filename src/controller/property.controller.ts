import { Request,Response } from "express";
import { getAllProperties ,getPropertyById,createProperty,updateProperty,deleteProperty,filterProperties} from "../services/property.service";
import { AuthRequest } from "../types/auth.type";
import { filterSchema } from "../validators/property.validator";
class PropertyController {
  public getAllData = async (req: Request, res: Response) => {
    try {
      const properties = await getAllProperties();
      return res.json(properties);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  };

  //finding by id attribute or mongodb objectid
  public getDatabyId = async (req: Request, res: Response) => {
    try {
      const property = await getPropertyById(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      return res.json(property);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  };

  public postData = async (req: Request, res: Response) => {
    try {
      //no need of passing id in requestbody
      const property = await createProperty(
        req.body,
        (req as any).user!._id.toString()
      );
      return res.status(201).json(property);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  };

  public updateData = async (req: Request, res: Response) => {
    try {
      const property = await updateProperty(
        req.params.id,
        req.body,
        (req as any).user!._id.toString()
      );
      return res.json(property);
    } catch (err: any) {
      if (err.message === "Unauthorized")
        return res.status(403).json({ error: err.message });
      else if (err.message === "Not found")
        return res.status(404).json({ error: err.message });
      else return res.status(400).json({ error: err.message });
    }
  };

  public deleteDatabyId = async (req: AuthRequest, res: Response) => {
    try {
      const result = await deleteProperty(
        req.params.id,
        req.user!._id.toString()
      );
      return res.json(result);
    } catch (err: any) {
      if (err.message === "Unauthorized")
        return res.status(403).json({ error: err.message });
      else if (err.message === "Not found")
        return res.status(404).json({ error: err.message });
      else return res.status(400).json({ error: err.message });
    }
  };


 public filterData = async (req: Request, res: Response) => {
  try {
    // Validate query parameters
    const { error, value } = filterSchema.validate(req.query, {
      convert: true, // converts strings to numbers/dates where needed
      allowUnknown: true // allows extra query params if needed
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Normalize amenities (convert comma-separated string to array)
    if (typeof value.amenities === "string") {
      value.amenities = value.amenities.split(",").map((a: string) => a.trim());
    }

    if (typeof value.tags === "string") {
      value.tags = value.tags.split(",").map((t: string) => t.trim());
    }
      

    const properties = await filterProperties(value);
    return res.json(properties);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
 };


}

export default new PropertyController();