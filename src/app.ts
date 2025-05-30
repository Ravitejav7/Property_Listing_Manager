import express from "express";
import router from "./routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API ENTRY POINT
app.use(`/${process.env.APP_NAME}`, router);

export default app;
