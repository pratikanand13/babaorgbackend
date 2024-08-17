const express = require("express");
const app = express();
require("dotenv").config();
require("./src/utils/ConnectMongo");

const cors = require("cors");

const userAPI = require("./src/routes/user");
const taskAPI = require("./src/routes/tasks");

app.use(cors());
app.use(express.json());
app.use("/api/v1", userAPI);
app.use("/api/v2", taskAPI);

const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
