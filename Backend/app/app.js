import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import * as authController from "./controllers/auth-controller.js";
import "dotenv/config";
import router from "./routes/index.js";
const corOptions = {
  credentials: true,
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const initialize = (app) => {
  app.use(cors(corOptions)); // use cors middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  app.use(cookieParser()); // use cookie parser middleware
  app.use(express.json()); // use express json middleware
  app.use(express.urlencoded()); // use express urlencoded middleware
  // app.use(authController.authMiddleware);
  const isConnected = mongoose.connect(process.env.MONGODB_URL); // connect to MongoDB
  if (isConnected) {
    console.log("Connected to MongoDB");
  } else {
    console.log("Error connecting to MongoDB");
  }
  router(app);
};

export default initialize;
