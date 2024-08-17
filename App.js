const express = require("express");
const app = express();
require("dotenv").config();
require("./src/utils/ConnectMongo");

const cors = require("cors");

// Allow requests from your frontend's origin (adjust to match your frontend's deployment URL)
app.use(
  cors()
);

app.use(express.json());

const userAPI = require("./src/routes/user");
const taskAPI = require("./src/routes/tasks");

app.use("/api/v1", userAPI);
app.use("/api/v2", taskAPI);

// Listen on the correct port (handled automatically by Vercel)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port :", ` ${port}`);
});

// Export the Express app for Vercel
module.exports = app;
