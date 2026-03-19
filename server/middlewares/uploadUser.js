const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadUser = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = uploadUser;


// // const multer = require("multer");
// // const path = require("path");
// // const crypto = require("crypto");

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, "/uploads/users");
// //   },
// //   filename: (req, file, cb) => {
// //     const ext = path.extname(file.originalname);
// //     const uniqueName =
// //       Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
// //     cb(null, uniqueName);
// //   },
// // });

// // const fileFilter = (req, file, cb) => {
// //   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
// //   if (allowed.includes(file.mimetype)) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only images are allowed"), false);
// //   }
// // };

// // const uploadUser = multer({
// //   storage,
// //   fileFilter,
// //   limits: { fileSize: 10 * 1024 * 1024 },
// // });

// // module.exports = uploadUser;








// // const fs = require("fs");
// // const path = require("path");
// // const multer = require("multer");
// // const crypto = require("crypto");

// // const uploadPath = path.join(__dirname, "/uploads/users");

// // // ensure folder exists
// // if (!fs.existsSync(uploadPath)) {
// //   fs.mkdirSync(uploadPath, { recursive: true });
// // }

// // const storage = multer.diskStorage({
// //   destination: (req, file, cb) => {
// //     cb(null, uploadPath);
// //   },
// //   filename: (req, file, cb) => {
// //     const ext = path.extname(file.originalname);
// //     const uniqueName =
// //       Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
// //     cb(null, uniqueName);
// //   },
// // });

// // const fileFilter = (req, file, cb) => {
// //   const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
// //   if (allowed.includes(file.mimetype)) {
// //     cb(null, true);
// //   } else {
// //     cb(new Error("Only images are allowed"), false);
// //   }
// // };

// // module.exports = multer({
// //   storage,
// //   fileFilter,
// //   limits: { fileSize: 10 * 1024 * 1024 },
// // });




// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const crypto = require("crypto");

// const UPLOADS_BASE = "/uploads/users";
// const uploadPath = path.join(UPLOADS_BASE, "users");

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