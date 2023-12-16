import express from "express";
import "dotenv/config";
import initialize from "./app/app.js";
// app is an instance of express
const app = express();
// PORT is the port number at which the server will run:3000
const PORT = 3000;
// initialize is a function that will handle all the requests to the API
initialize(app);
// The following code will be executed when a request is made to /api
app.listen(process.env.PORT, () => {
  console.log(`Server is listening at port ${process.env.PORT}!`);
});
