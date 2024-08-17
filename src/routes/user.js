const router = require("express").Router();
const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logMiddleware = require('../middlewares/logMiddleware')
router.use(logMiddleware)
// username, email, password
router.post("/sign-in", async (req, res) => {
  // console.log(req.body.username, req.body.email, req.body.password);
  try {
    const { username, email, password } = req.body;

    if (username && email && password) {
      if (validator.isEmail(email)) {
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
          return res
            .status(400)
            .json({ success: false, message: "Email already exists" });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
      } else if (username.length < 4) {
        return res.status(400).json({
          success: false,
          message: "Username should have at least 4 characters",
        });
      }
      const hashPass = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashPass,
      });

      await newUser.save();

      return res
        .status(200)
        .json({ success: true, message: "Sign-In Successfully" });
    } else {f
      return res.status(400).json({
        success: false,
        message: "Invalid Payload",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// login
router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the body is correctly populated
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find user by email
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // Compare password
    bcrypt.compare(password, existingUser.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "An error occurred during password comparison",
        });
      }

      if (isMatch) {
        // Create JWT token
        const claims = { username, jti: jwt.sign({}, "ravi022") };
        // const claims = [{ username, jti: jwt.sign({}, "ravi022") }];
        const token = jwt.sign(claims, "ravi022", { expiresIn: "30d" });

        // console.log(token);

        // Send response with token
        return res.status(200).json({ id: existingUser._id, token });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
    });
  } catch (error) {
    console.error("Error in /log-in route:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
