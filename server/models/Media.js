// const mongoose = require("mongoose");

// const mediaSchema = new mongoose.Schema({
//   section: {
//     type: String,
//     required: true,
//     enum: ["about", "home", "hero", "contact", "footer"]
//   },
//   type: {
//     type: String,
//     enum: ["image", "video"],
//     // required: true
//   },
//   url: {
//     type: String,
//     required: true
//   },
//   public_id: {
//     type: String // for deletion (Cloudinary)
//   },
//   title: String,
// }, { timestamps: true });

// module.exports = mongoose.model("Media", mediaSchema);

const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "home_video",
        "about1",
        "about2",
        "about3",
        "logo",
        "hero",
        "egypt",
        "egypt_video",
        "albania",
        "albania_video",
        "flight",
        "hotel",
        "cruises_video",
        "tailored_planning",
        "transportation",
        "accommodation",
        "event_management",
        "dining_catering",
      ],
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },

    title: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Index for fast lookups
mediaSchema.index({ section: 1, type: 1, isActive: 1 });

module.exports = mongoose.model("Media", mediaSchema);
