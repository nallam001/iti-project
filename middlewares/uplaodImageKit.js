const ImageKit = require("imagekit");
require('dotenv').config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uplaodImageKit = (isMultipleFiles) => {
  return async (req, res, next) => {
    try {
      console.log('CDN upload middleware triggered');

      if (
        (!isMultipleFiles && !req.file) ||
        (isMultipleFiles && (!req.files || req.files.length === 0))
      ) {
        console.log('No files found, skipping CDN upload');
        return next();
      }

      const files = isMultipleFiles ? req.files : [req.file];
      console.log('Files found for CDN upload:', files.length);

    
      const uploadPromises = files.map((file) => {
        if (!file.originalname) {
          throw new Error('File originalname is missing');
        }

        if (!file.buffer || file.buffer.length === 0) {
          throw new Error('File buffer is empty or missing');
        }

        return imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "uploads",
        });
      });

      const results = await Promise.all(uploadPromises);
      console.log('CDN upload results:', results.length, 'files uploaded');

      req.cdnUrls = results.map((r) => r.url);
      req.cdnData = results; 

      next();
    } catch (error) {
      console.log("CDN Upload Error:", error);
      next(error);
    }
  };
};

module.exports = uplaodImageKit;