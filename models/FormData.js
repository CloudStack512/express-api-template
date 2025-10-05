const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to the user who submitted the form
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    // Add more fields as needed
  },
  { timestamps: true } // automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("FormData", formDataSchema);
