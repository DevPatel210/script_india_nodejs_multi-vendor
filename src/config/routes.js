const router = require("../routes");
const adminRouter = require("../routes/admin");
module.exports = (app) => {
  // define a root/default route
  app.get("/", (req, res) => {
    res.json({
      message: "Coffee House",
      api_health: "good",
      api_version: "V1.0.0",
    });
  });

  app.use("/api/v1/app", router);

  app.use("/api/v1/admin", adminRouter);
};
