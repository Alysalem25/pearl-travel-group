const mongoose = require("mongoose");

const MiceSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },

        lastName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true
        },

        organization: {
            type: String,
            required: true
        },

        jobFunction: {
            type: String,
            required: true
        },

        nationality: {
            type: String,
            required: true
        },

        numOfGuests: {
            type: Number,
            required: true,
            min: 0
        },

        dateFrom: {
            type: Date,
            required: true
        },

        dateTo: {
            type: Date,
            required: true
        },

        destination: {
            type: String,
            required: true
        },

        number: {
            type: String,
            required: false
        },

        remarks: {
            type: String,
            trim: true
        },


        status: {
            type: String,
            enum: ["pending", "reviewed"],
            default: "pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("Mice", MiceSchema);






