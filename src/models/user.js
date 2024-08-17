const { default: mongoose, Mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tasks",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
