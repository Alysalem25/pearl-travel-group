const express = require("express");
const path = require("path");
const uploadCountry = require("../middlewares/uploadCountry");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/authorizeMiddleware");
const { validateCountry, handleValidationErrors } = require("../middlewares/validators");
const { logSuccess, logError } = require("../utils/loggerService");
const Country = require("../models/Country");

const router = express.Router();

/**
 * Image path normalization helper
 * ✅ Returns: /uploads/categories/filename.jpg
 * Used by API to return absolute paths that work in browser
 */
// function normalizeImagePath(imagePath) {
//   return `/uploads/countries/${imagePath}`;
// }

function normalizeImagePath(imagePath) {
  // Check if already normalized
  if (imagePath.startsWith('/uploads/')) {
    return imagePath;
  }
  return `/uploads/countries/${imagePath}`;
}

/**
 * GET /countries
 * Get all countries - PUBLIC ROUTE 
 */
router.get("/", async (req, res, next) => {
  try {
    const countries = await Country.find();
    const normalizedCountries = countries.map(country => ({
      ...country.toObject(),
      images: country.images ? country.images.map(normalizeImagePath) : []
    }));
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", null, req, {
        resultCount: normalizedCountries.length
      });
    }
    
    res.json(normalizedCountries);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /countries/by-name/:nameEn
 * Get country by English name - PUBLIC ROUTE
 */
router.get("/by-name/:nameEn", async (req, res, next) => {
  try {
    const country = await Country.findOne({ nameEn: req.params.nameEn });

    if (!country) {
      if (req.user) {
        await logError(req.user._id, "SEARCH_COUNTRY", "Country", req, "Country not found", {
          searchTerm: req.params.nameEn
        });
      }
      return res.status(404).json({ error: "country not found" });
    }

    const normalizedCountry = {
      ...country.toObject(),
      images: country.images ? country.images.map(normalizeImagePath) : []
    };
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", country._id, req, {
        searchTerm: req.params.nameEn
      });
    }

    res.json(normalizedCountry);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /countries/:id
 * Get single country by ID - PUBLIC ROUTE
 */
// router.get("/:id", async (req, res, next) => {
//   try {
//     const country = await Country.findById(req.params.id);

//     if (!country) {
//       return res.status(404).json({ error: "country not found" });
//     }

//     const normalizedCountry = {
//       ...country.toObject(),
//       images: country.images ? country.images.map(normalizeImagePath) : []
//     };

//     res.json(normalizedCountry);
//   } catch (err) {
//     next(err);
//   }
// });

/**
 * POST /countries
 * Create new country - ADMIN ONLY
 * 
 * Security:
 * - Requires authentication (authMiddleware)
 * - Requires admin role (authorize)
 * - Validates input (validateCountries)
 * - File uploads restricted to 1 image
 */
router.post(
  "/",
  authMiddleware,
  authorize("add_country"),
  uploadCountry.array("images", 1),
   handleValidationErrors,
  async (req, res, next) => {
    try {
      const {
        nameEn,
        nameAr,
        inhomepage,
        inVisa,
        inFromCountry,
        inToCountry
      } = req.body;

      const images = (req.files || []).map(f => "/uploads/countries/" + f.filename);

      const country = new Country({
        nameEn,
        nameAr,
        inhomepage,
        inVisa,
        inFromCountry,
        inToCountry,
        images
      });
      await country.save();

      const response = {
        ...country.toObject(),
        images: country.images.map(normalizeImagePath)
      };
      
      // 🔹 Log CREATE action
      await logSuccess(req.user._id, "CREATE_COUNTRY", "Country", country._id, req, {
        countryName: nameEn,
        imageCount: images.length
      });

      res.status(201).json(response);
    } catch (err) {
      // 🔹 Log error
      await logError(req.user._id, "CREATE_COUNTRY", "Country", req, err.message, {
        countryName: req.body.nameEn
      });
      next(err);
    }
  }
);

/**
 * PUT /counties/:id
 * Update country - ADMIN ONLY
 */
router.put(
  "/:id",
  authMiddleware,
  authorize("update_country"),
  uploadCountry.array("images", 5),
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { nameEn, nameAr, inhomepage, inVisa, inFromCountry, inToCountry } = req.body;

      const existingCountry = await Country.findById(req.params.id);
      if (!existingCountry) {
        await logError(req.user._id, "EDIT_COUNTRY", "Country", req, "Country not found", {
          countryId: req.params.id
        });
        return res.status(404).json({ error: "country not found" });
      }

      let images = existingCountry.images || [];

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(f => "/uploads/countries/" + f.filename);
        images = [...images, ...newImages];
      }

      const country = await Country.findByIdAndUpdate(
        req.params.id,
        { nameEn, nameAr, inhomepage, inVisa, inFromCountry, inToCountry, images },
        { new: true, runValidators: true }
      );

      if (!country) {
        await logError(req.user._id, "EDIT_COUNTRY", "Country", req, "Country not found after update", {
          countryId: req.params.id
        });
        return res.status(404).json({ error: "country not found" });
      }

      const response = {
        ...country.toObject(),
        images: country.images ? country.images.map(normalizeImagePath) : []
      };
      
      // 🔹 Log EDIT action
      await logSuccess(req.user._id, "EDIT_COUNTRY", "Country", country._id, req, {
        countryName: nameEn,
        newImageCount: images.length
      });

      res.json(response);
    } catch (err) {
      // 🔹 Log error
      await logError(req.user._id, "EDIT_COUNTRY", "Country", req, err.message, {
        countryId: req.params.id,
        countryName: req.body.nameEn
      });
      next(err);
    }
  }
);

/**
 * DELETE /countries/:id
 * Delete country - ADMIN ONLY
 */
router.delete("/:id", authMiddleware, authorize("delete_country"), async (req, res, next) => {
  try {
    const country = await Country.findByIdAndDelete(req.params.id);

    if (!country) {
      await logError(req.user._id, "DELETE_COUNTRY", "Country", req, "Country not found", {
        countryId: req.params.id
      });
      return res.status(404).json({ error: "country not found" });
    }
    
    // 🔹 Log DELETE action
    await logSuccess(req.user._id, "DELETE_COUNTRY", "Country", req.params.id, req, {
      countryName: country.nameEn
    });

    res.json({ message: "country deleted successfully" });
  } catch (err) {
    // 🔹 Log error
    await logError(req.user._id, "DELETE_COUNTRY", "Country", req, err.message, {
      countryId: req.params.id
    });
    next(err);
  }
});

/**
 * POST /countries/:id/images
 * Add image to existing country - ADMIN ONLY
 */
router.post(
  "/:id/images",
  authMiddleware,
  authorize("add_country"),
  uploadCountry.array("images", 1),
  async (req, res, next) => {
    try {
      const country = await Country.findById(req.params.id);

      if (!country) {
        return res.status(404).json({ error: "country not found" });
      }

      const images = (req.files || []).map(f => "/uploads/countries/" + f.filename);
      country.images.push(...images);

      await country.save();

      const response = {
        ...country.toObject(),
        images: country.images ? country.images.map(normalizeImagePath) : []
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);


//  inhomepage countries
router.get("/inhomepage", async (req, res, next) => {
  try {
    const countries = await Country.find({ inhomepage: true });
    const normalizedCountries = countries.map(country => ({
      ...country.toObject(),
      images: country.images ? country.images.map(normalizeImagePath) : []
    }));
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", null, req, {
        filter: "inhomepage",
        resultCount: normalizedCountries.length
      });
    }
    
    res.json(normalizedCountries);
  } catch (err) {
    next(err);
  }
});


// inVisa countries
router.get("/inVisa", async (req, res, next) => {
    try {
    const countries = await Country.find({ inVisa: true });
    const normalizedCountries = countries.map(country => ({
      ...country.toObject(),
      images: country.images ? country.images.map(normalizeImagePath) : []
    }));
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", null, req, {
        filter: "inVisa",
        resultCount: normalizedCountries.length
      });
    }
    
    res.json(normalizedCountries);
  } catch (err) {
    next(err);
  }
});

// inFromCountry countries
router.get("/inFromCountry", async (req, res, next) => {
  try {
    const countries = await Country.find({ inFromCountry: true });
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", null, req, {
        filter: "inFromCountry",
        resultCount: countries.length
      });
    }

    res.json(countries);
  } catch (err) {
    next(err);
  }
});

// inToCountry countries
router.get("/inToCountry", async (req, res, next) => {
  try {
    const countries = await Country.find({ inToCountry: true });
    const normalizedCountries = countries.map(country => ({
      ...country.toObject(),
      images: country.images ? country.images.map(normalizeImagePath) : []
    }));
    
    // 🔹 Log search action
    if (req.user) {
      await logSuccess(req.user._id, "SEARCH_COUNTRY", "Country", null, req, {
        filter: "inToCountry",
        resultCount: normalizedCountries.length
      });
    }
    
    res.json(normalizedCountries);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:id/images",
  authMiddleware,
  authorize("add_country"),
  uploadCountry.array("images", 1),
  async (req, res, next) => {
    try {
      const contry = await Country.findById(req.params.id);

      if (!contry) {
        return res.status(404).json({ error: "contry not found" });
      }

      const images = (req.files || []).map(f => "/uploads/countries/" + f.filename);
      contry.images.push(...images);

      await contry.save();

      const response = {
        ...contry.toObject(),
        images: contry.images ? contry.images.map(normalizeImagePath) : []
      };

      res.json(response);
    } catch (err) {
      next(err);
    }
  }
);




module.exports = router;    