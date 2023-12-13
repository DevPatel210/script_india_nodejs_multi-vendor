const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

module.exports = function (app) {
  // gzip compression
  app.use(express.json());
  // parse requests of content-type - application/x-www-form-urlencoded, application/json
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  // secure apps by setting HTTP headers
  app.use(helmet());
  // gzip compression
  app.use(compression());
  // use HTTP verbs such as PUT or DELETE
  app.use(methodOverride());
  // enable CORS
  app.use(cors({ origin: true }));
  let staticPath = path.join(__dirname, "../../public/files")
  app.use(express.static(staticPath));
  app.use("/uploads", express.static(staticPath));
};
