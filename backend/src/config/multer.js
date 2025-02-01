const multer = require("multer");
const path = require("path");

// Image upload configuration
const imageMulterConfig = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/images'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// PDF and DOC upload configuration
const DocMulterConfig = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/docs'));
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  //   if (allowedTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error('Invalid file type. Only PDF and DOC files are allowed.'));
  //   }
  // },
  // limits: {
  //   fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  // },
});

module.exports = { imageMulterConfig, DocMulterConfig };
