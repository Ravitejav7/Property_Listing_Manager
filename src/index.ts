import { config } from "dotenv";
config();
import { createServer } from "http";
import app from "./app";
import { createMongoConnection } from "./utils/db.util";
const PORT = process.env.PORT || 8080;

const server = createServer(app);

server.listen(PORT, () => {
  try {
    console.log(`Server is running on port ${PORT}`);
    createMongoConnection();
   // console.log(`App deployed at :  https://property-listing-manager.onrender.com`);
    console.log(`URL :  http://localhost:${PORT}/${process.env.APP_NAME}`);


  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
});
