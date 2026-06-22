const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema(
  {
    contry: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    hotelName: {
      type: String,
      required: true,
    },

   note:{
      type: String,
   }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Distination", DestinationSchema);
