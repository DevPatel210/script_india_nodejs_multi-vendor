const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/files/"),
  filename: (req, file, cb) => {
    if(!req.body.image) req.body.image = []
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      
      cb(null, uniqueName);
      if (file.fieldname === "image") {
        req.body.image.push(uniqueName);
      }
      
      req.body = JSON.parse(JSON.stringify(req.body))
  },
});

exports.handleImageFile = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, //5 mb limit
}).fields([
  { name: "image", maxCount: 5 }
]);
