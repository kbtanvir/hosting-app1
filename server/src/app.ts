import express, { Request, Response } from "express";
import router from "./router/router.js";
import multer from "multer";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));

app.use(router);

export default app;
