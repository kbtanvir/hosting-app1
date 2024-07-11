import express, { Request, Response } from "express";
import router from "./router/router.js";
import multer from "multer";
import path from "path";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your React app's URL in production
  methods: ["GET", "POST", "DELETE", "PUT"], // Add other HTTP methods as needed
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));
app.use(router);

export default app;
