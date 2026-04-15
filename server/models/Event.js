const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    titleEn: { type: String, required: true },
    titleAr: { type: String, required: true },
    descriptionEn: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    
    // Event specific fields
    eventDate: { type: Date, required: true },
    endDate: { type: Date },
    locationEn: { type: String, required: true },
    locationAr: { type: String, required: true },
    venueEn: { type: String },
    venueAr: { type: String },
    
    // Pricing
    price: { type: Number, default: 0 },
    originalPrice: { type: Number }, // For discounted events
    currency: { type: String, default: "USD" },
    
    // Capacity
    totalCapacity: { type: Number, default: 100 },
    bookedSeats: { type: Number, default: 0 },
    
    // Categorization
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: true 
    },
    country: { 
      type: String, 
      enum: ["Egypt", "Albania"],
      required: true 
    },
    eventType: {
      type: String,
      enum: ["concert", "festival", "cultural", "sports", "food", "art", "other"],
      default: "other"
    },
    
    // Media
    images: [{ type: String }],
    videoUrl: { type: String },
    
    // Status
    status: { 
      type: String, 
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming" 
    },
    isFeatured: { type: Boolean, default: false },
    
    // Additional info
    duration: { type: String }, // e.g., "3 hours", "2 days"
    ageRestriction: { type: String }, // e.g., "18+", "All ages"
    dressCode: { type: String },
    
    // Organizer
    organizerEn: { type: String },
    organizerAr: { type: String },
    organizerContact: { type: String },
    
    // Tags for search
    tagsEn: [{ type: String }],
    tagsAr: [{ type: String }],
  },
  { timestamps: true }
);

// Index for upcoming events
eventSchema.index({ eventDate: 1, status: 1 });
eventSchema.index({ category: 1, country: 1 });

module.exports = mongoose.model("Event", eventSchema);