const mongoose = require("mongoose");
const conn = async () => {
  try {
    const response = await mongoose.connect(
      "mongodb+srv://baba_management:PzI3GSKixPXtUjpM@cluster0.errvx.mongodb.net/Baba_Management"
    );
    if (response) {
      console.log("connected to DB");
    }
  } catch (error) {
    console.log("error", error);
  }
};

conn();
