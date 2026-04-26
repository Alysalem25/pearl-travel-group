// // const multer = require("multer");

// // const storage = multer.memoryStorage();

// // const upload = multer({
// //   storage,
// //   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// // });

// // module.exports = upload;

// // ===============================================================================
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadDir = "/app/uploads/media";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, Date.now() + ext);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp|jfif/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only .png, .jpg, .jpeg and .webp format allowed!"), false);
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter,
// });

// module.exports = upload;




const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "/app/uploads/media";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow both images AND videos
  const imageTypes = /jpeg|jpg|png|webp|jfif/;
  const videoTypes = /mp4|webm|ogg|mov|mkv/;
  
  const ext = path.extname(file.originalname).toLowerCase();
  const extname = imageTypes.test(ext) || videoTypes.test(ext);
  const mimetype = imageTypes.test(file.mimetype) || videoTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image (.png, .jpg, .jpeg, .webp) and video (.mp4, .webm, .ogg, .mov) files allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for videos
  fileFilter,
});

module.exports = upload;