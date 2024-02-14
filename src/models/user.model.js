/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
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
  address: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    // min: 1,
    // max: 5,
    required: true
  },
  status: {
    type: String,
    default: "A",
    required: true,
    minlength: 1,
    maxlength: 1,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  }
});

userSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject({ virtuals: true });
  object.id = object._id;
  return object;
});

// pass auth token through the models [encapsulating]
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_STRING, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
  return token;
};

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
