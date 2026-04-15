const mongoose = require("mongoose");
const User = require("./models/Users");
require("dotenv").config();

async function updateUserPermissions() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/pearl-travel");

    // Update admin users
    const adminPermissions = [
      'add_program', 'edit_program', 'delete_program',
      'add_country', 'edit_country', 'delete_country',
      'add_category', 'edit_category', 'delete_category',
      'add_cruise', 'edit_cruise', 'delete_cruise',
      'manage_users', 'manage_visa',
      'manage_booked_flights', 'manage_booked_programs',
      'manage_booked_transportation', 'manage_booked_hotels', 'manage_booked_cruises',
      '*'
    ];

    const headPermissions = [
      'add_program', 'edit_program', 'delete_program',
      'add_country', 'edit_country', 'delete_country',
      'add_category', 'edit_category', 'delete_category',
      'add_cruise', 'edit_cruise', 'delete_cruise',
      'manage_visa',
      'manage_booked_flights', 'manage_booked_programs',
      'manage_booked_transportation', 'manage_booked_hotels', 'manage_booked_cruises',
    ];

    await User.updateMany({ role: 'admin' }, { permissions: adminPermissions });
    await User.updateMany({ role: 'head' }, { permissions: headPermissions });

    console.log("User permissions updated successfully");
  } catch (error) {
    console.error("Error updating permissions:", error);
  } finally {
    await mongoose.disconnect();
  }
}

updateUserPermissions();