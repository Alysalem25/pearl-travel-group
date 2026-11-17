require("dotenv").config();

const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/Users");

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

async function seedDemoAdmin() {
  const mongoUri = process.env.MONGO_URI;
  const email = (process.env.DEMO_ADMIN_EMAIL || "demo-admin@localhost.test").toLowerCase();
  const password = process.env.DEMO_ADMIN_PASSWORD || crypto.randomBytes(24).toString("hex");

  if (process.env.ALLOW_LOCAL_DEMO_SEED !== "true") {
    throw new Error("Set ALLOW_LOCAL_DEMO_SEED=true to explicitly enable local demo seeding.");
  }
  if (!mongoUri) {
    throw new Error("MONGO_URI must point to a local MongoDB instance.");
  }

  let hostname;
  try {
    hostname = new URL(mongoUri).hostname.replace(/^\[|\]$/g, "").toLowerCase();
  } catch {
    throw new Error("MONGO_URI is not a valid MongoDB connection URL.");
  }
  if (!localHosts.has(hostname)) {
    throw new Error("Refusing to seed a non-local MongoDB host.");
  }
  if (password.length < 12) {
    throw new Error("DEMO_ADMIN_PASSWORD must be at least 12 characters.");
  }

  await mongoose.connect(mongoUri);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log(`Admin account ${email} already exists; its password was not changed.`);
      return;
    }
    throw new Error(`Account ${email} already exists and is not an admin. Choose another DEMO_ADMIN_EMAIL.`);
  }

  await new User({
    name: "Local Demo Admin",
    email,
    password,
    number: "0000000000",
    role: "admin",
    permissions: ["*"],
    workStatus: "active",
    inTeam: false,
    images: []
  }).save();

  console.log(`Created local demo admin: ${email}`);
  if (!process.env.DEMO_ADMIN_PASSWORD) {
    console.log(`Generated password (save it now): ${password}`);
  }
}

seedDemoAdmin()
  .catch((error) => {
    console.error(`Demo admin seeding failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
