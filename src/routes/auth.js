const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token after "Bearer"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication Action Required" });
  }
  jwt.verify(token, "ravi022", (err, user) => {
    if (err) {
      console.log("Error:", err);
      return res.status(403).json({ error: "Token is not valid" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
