const fs = require('fs').promises;
const path = require('path');

const localUpload = (isMultipleFiles) => {
    return async (req, res, next) => {
        try {
            console.log('Local upload middleware triggered');

            if (
                (!isMultipleFiles && !req.file) ||
                (isMultipleFiles && (!req.files || req.files.length === 0))
            ) {
                console.log('No files found, skipping local save');
                return next();
            }

            const files = isMultipleFiles ? req.files : [req.file];
            console.log('Files found for local save:', files.length);
            const uploadPath = path.join(__dirname, "..", "uploads");
            try {
                await fs.access(uploadPath);
            } catch (error) {
                console.log('Creating uploads directory...');
                await fs.mkdir(uploadPath, { recursive: true });
            }
            const localSavePromises = files.map(async (file) => {
                if (!file.originalname) {
                    throw new Error('File originalname is missing');
                }

                if (!file.buffer || file.buffer.length === 0) {
                    throw new Error('File buffer is empty or missing');
                }

                const fileName = `${Date.now()}-${file.originalname}`;
                const filePath = path.join(uploadPath, fileName);

                await fs.writeFile(filePath, file.buffer);
                console.log('File saved locally:', filePath);

                return {
                    fileName,
                    filePath,
                    originalName: file.originalname,
                    size: file.size,
                    mimetype: file.mimetype
                };
            });

            const localFiles = await Promise.all(localSavePromises);
            console.log('Local save results:', localFiles.length, 'files saved');

            req.localFiles = localFiles;
            req.localFilenames = localFiles.map(f => f.fileName);

            next();
        } catch (error) {
            console.log("Local Upload Error:", error);
            next(error);
        }
    };
};

module.exports = localUpload;