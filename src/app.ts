import express from "express";
import router from "./routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(
      `Property Listing Manager API is running. Try /${process.env.APP_NAME}/property  to see data. <br>Note:  /${process.env.APP_NAME} is the base path for the API.`
    );
});
//API ENTRY POINT
app.use(`/${process.env.APP_NAME}`, router);

export default app;
