// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//       select: false
//     },
//     number: {
//       type: String,
//       required: true
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user"
//     },
//     inTeam: {
//       type: Boolean,
//       default: false,
//     },

//     roleInTeam: {
//       type: String,
//       required: function () { return this.inTeam; }
//     },

//     images: [String], // array of image filenames

//   },
//   { timestamps: true }
// );

// /**
//  * 🔐 Hash password before save
//  * IMPORTANT:
//  * - Uses async/await (Mongoose auto-handles promise)
//  * - Do NOT use next() callback with async pre-hooks
//  * - Simply return early or throw on error
//  */
// UserSchema.pre("save", async function () {
//   // Only hash if password is new or modified
//   if (!this.isModified("password")) {
//     return;
//   }

//   try {
//     const salt = await bcrypt.genSalt(12);
//     this.password = await bcrypt.hash(this.password, salt);
//   } catch (err) {
//     // Mongoose will reject the save promise
//     throw err;
//   }
// });

// /**
//  * 🔑 Compare password
//  */
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   try {
//     if (!this.password) {
//       throw new Error("Password field is not set");
//     }
//     if (!enteredPassword) {
//       return false;
//     }
//     return await bcrypt.compare(enteredPassword, this.password);
//   } catch (err) {
//     console.error("Password comparison error:", err);
//     throw err;
//   }
// };

// module.exports = mongoose.model("User", UserSchema);



const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    number: {
      type: String,
      required: true
    },

    // 🎯 role مجرد label
    role: {
      type: String,
      enum: ["admin", "head", "user"],
      default: "user"
    },

    // 🔥 أهم حاجة
    permissions: {
      type: [String],
      default: []
    },

    // 👤 بيانات العميل فقط
    clientInfo: {
      nationalId: String,
      passportNumber: String,
      address: String
    },

    // 📊 Work Status for filtering users
    workStatus: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active"
    },

    images: [String]
  },
  { timestamps: true }
);

// 🔐 Hash password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 Compare password
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);