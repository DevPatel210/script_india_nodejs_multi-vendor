/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const vendorSchema = mongoose.Schema({
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
  commission: {
    type: Number,
    required: false,
    default: 0,
  },
  status: {
    type: String,
    default: "A",
    required: true,
    minlength: 1,
    maxlength: 1,
  },
  phone_number: {
    type: Number,
    // min: 1,
    // max: 5,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  taxId: {
    type: String,
  },
  image: {
    type: Array,
    required: true,
  },
  display: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    default: false,
  },
});

vendorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject({ virtuals: true });
  object.id = object._id;
  return object;
});

// pass auth token through the models [encapsulating]
vendorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_STRING, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
  return token;
};

exports.vendorSchema = vendorSchema;
exports.Vendor = mongoose.model("Vendor", vendorSchema);
