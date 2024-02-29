/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "A",
    required: true,
    minlength: 1,
    maxlength: 1,
  },
});

categorySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject({ virtuals: true });
  object.id = object._id;
  return object;
});

// pass auth token through the models [encapsulating]
categorySchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_STRING, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });
  return token;
};

exports.categorySchema = categorySchema;
exports.Category = mongoose.model("Category", categorySchema);