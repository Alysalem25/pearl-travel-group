// const express = require("express");
// const Media = require("../models/Media");
// const upload = require("../middlewares/uploadMedia");
// // import Media from "../models/Media.js";
// // import upload from "../middleware/uploadMedia.js";

// function normalizeImagePath(imagePath) {
//   // Check if already normalized
//   if (imagePath.startsWith('/uploads/')) {
//     return imagePath;
//   }
//   return `/uploads/media/${imagePath}`;
// }

// const router = express.Router();

// router.post("/", upload.single("file"), async (req, res) => {
//     try {
//         const { section, type, title, url } = req.body;
//         console.log("Received media upload:", { section, type, title, url, file: req.file });

//         let mediaUrl = url;

//         // If file is uploaded, use local storage path
//         if (req.file) {
//             mediaUrl = normalizeImagePath(req.file.filename);
//         } else if (!mediaUrl) {
//             return res.status(400).json({ error: "File or URL is required" });
//         }

//         const media = new Media({
//             section,
//             type,
//             title,
//             url: mediaUrl,
//             file_path: req.file ? normalizeImagePath(req.file.filename) : null
//         });

//         await media.save();

//         res.status(201).json(media);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Failed to upload media" });
//     }
// });

// // 📥 Get media by section
// router.get("/:section", async (req, res) => {
//   try {
//     const media = await Media.find({ section: req.params.section });
//     const normalizedMedia = media.map(m => ({
//       ...m.toObject(),
//       url: normalizeImagePath(m.file_path || m.url)
//     }));
//     res.json(normalizedMedia);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch media" });
//   }
// });

// // ❌ Delete media
// router.delete("/:id", async (req, res) => {
//   try {
//     const media = await Media.findById(req.params.id);

//     if (!media) {
//       return res.status(404).json({ error: "Media not found" });
//     }

//     await media.deleteOne();

//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete media" });
//   }
// });

// module.exports = router;

// ========================================================================================

// const express = require("express");
// const multer = require("multer"); // ← MISSING IMPORT
// const Media = require("../models/Media");
// const upload = require("../middlewares/uploadMedia");

// function normalizeImagePath(imagePath) {
//   if (!imagePath) return "";
//   if (imagePath.startsWith('/uploads/')) {
//     return imagePath;
//   }
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
//   return `/uploads/media/${imagePath}`;
// }

// const router = express.Router();

// // POST — handle multer errors properly
// router.post("/", (req, res, next) => {
//   upload.single("file")(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ error: `Upload error: ${err.message}` });
//     } else if (err) {
//       return res.status(400).json({ error: err.message });
//     }
//     next();
//   });
// }, async (req, res) => {
//     try {
//         const { section, type, title, url } = req.body;
//         console.log("Received media upload:", { section, type, title, url, file: req.file });

//         let mediaUrl = url;

//         if (req.file) {
//             mediaUrl = normalizeImagePath(req.file.filename);
//         } else if (!mediaUrl) {
//             return res.status(400).json({ error: "File or URL is required" });
//         }

//         const media = new Media({
//             section,
//             type: type || "image",
//             title,
//             url: mediaUrl,
//             file_path: req.file ? req.file.filename : null
//         });

//         await media.save();
//         res.status(201).json(media);
//     } catch (error) {
//         console.error("ROUTE ERROR:", error);
//         res.status(500).json({ error: "Failed to upload media", details: error.message });
//     }
// });

// // GET by section
// router.get("/:section", async (req, res) => {
//   try {
//     const media = await Media.find({ section: req.params.section });
//     const normalizedMedia = media.map(m => {
//       const obj = m.toObject();
//       obj.url = m.file_path ? normalizeImagePath(m.file_path) : m.url;
//       return obj;
//     });
//     res.json(normalizedMedia);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch media" });
//   }
// });

// // DELETE
// router.delete("/:id", async (req, res) => {
//   try {
//     const media = await Media.findById(req.params.id);
//     if (!media) {
//       return res.status(404).json({ error: "Media not found" });
//     }
//     await media.deleteOne();
//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to delete media" });
//   }
// });

// module.exports = router;

// =========================================================================================

const express = require("express");
const Media = require("../models/Media");

// function normalizeImagePath(imagePath) {
//   if (!imagePath) return "";
//   if (imagePath.startsWith('/uploads/')) return imagePath;
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
//   return `/uploads/media/${imagePath}`;
// }

const router = express.Router();

// POST - Create new media (URL only, no file upload)
router.post("/", async (req, res) => {
  try {
    const { section, type, title, url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }



    const media = new Media({
      section,
      type: type || "image",
      title,
      url: url,
      file_path: null,
    });

    await media.save();
    res.status(201).json(media);
  } catch (error) {
    console.error("ROUTE ERROR:", error);
    res
      .status(500)
      .json({ error: "Failed to create media", details: error.message });
  }
});

//  get all
router.get("/", async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// GET by section
router.get("/:section", async (req, res) => {
  try {
    const media = await Media.find({
      section: req.params.section,
      isActive: true,
    });
    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// GET single media by section and type
router.get("/:section/:type", async (req, res) => {
  try {
    const media = await Media.findOne({
      section: req.params.section,
      type: req.params.type,
      isActive: true,
    });

    if (!media) {
      return res.json(null);
    }

    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// PUT - Update existing media
router.put("/:id", async (req, res) => {
  try {
    const { section, type, title, url } = req.body;
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Update fields
    if (section) media.section = section;
    if (type) media.type = type;
    if (title !== undefined) media.title = title;
    if (url) media.url = url;

    await media.save();
    res.json(media);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ error: "Failed to update media" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }
    await media.deleteOne();
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

module.exports = router;
