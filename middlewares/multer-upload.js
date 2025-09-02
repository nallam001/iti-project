const multer = require('multer');
const path = require("path");

const uploadPath = path.join(__dirname, "..", "uploads");
const disStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    try {
      const originalname = file.originalname || 'unknown-file';
      const ext = path.extname(originalname);
      const fileName = `${Date.now()}-${file.fieldname}${ext}`;
      cb(null, fileName);
    } catch (error) {
      console.log('Error in filename function:', error);
      cb(error);
    }
  }
})
const memoryStorage = multer.memoryStorage()

const uploadLocal = multer({ storage: disStorage })

const uploadCDN = multer({ storage: memoryStorage })

module.exports = {
  uploadLocal,
  uploadCDN
}