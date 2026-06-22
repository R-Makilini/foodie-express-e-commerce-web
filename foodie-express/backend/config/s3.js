const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const imageFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const uploadProduct = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `products/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
});

const uploadProfile = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `profiles/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter(["image/jpeg", "image/jpg", "image/png"]),
});

module.exports = { s3, uploadProduct, uploadProfile };