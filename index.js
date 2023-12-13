const express = require("express");
// start express server
const app = express();
require("dotenv").config();

// calling config files
require("./src/config/prod")(app);
require("./src/config/routes")(app);
require("./src/config/dbConfig")();
require("./src/config/config")();

// Setup server port
const port = process.env.PORT || 8000;
// listen for requests
app.listen(port, () => console.log(`INFO: ON PORT TO ${port}`));
