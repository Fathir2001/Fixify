const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const serviceNeederSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetOTP: {
    code: String,
    expiresAt: Date,
  },
});

// Hash password before saving
// Remove any pre-save middleware for password hashing
serviceNeederSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  next();
});

//comparePassword method
serviceNeederSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const ServiceNeeder = mongoose.model("ServiceNeeder", serviceNeederSchema);
module.exports = ServiceNeeder;
