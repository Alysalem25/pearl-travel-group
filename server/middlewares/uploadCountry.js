const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/countries");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadCountry = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
});

module.exports = uploadCountry;



// const multer = require("multer");
// const path = require("path");
// const crypto = require("crypto");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "/root/uploads/countries");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName =
//       Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// const uploadCountry = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// module.exports = uploadCountry;









// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const crypto = require("crypto");

// const uploadPath = path.join(__dirname, "/root/uploads/countries");

// // ensure folder exists
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName =
//       Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// module.exports = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });




// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const crypto = require("crypto");

// const UPLOADS_BASE = "/app/uploads";
// const uploadPath = path.join(UPLOADS_BASE, "countries");

// // Ensure directory exists
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName =
//       Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
//     cb(null, uniqueName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
//   if (allowed.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images are allowed"), false);
//   }
// };

// module.exports = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 },
// });