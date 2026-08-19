const multer = require("multer");

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (/^(image|video)\//i.test(file.mimetype)) return callback(null, true);
    callback(new Error("Only image or video files are allowed."));
  },
});
