require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function seedAdmin() {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error(
        "Missing required environment variables: ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD"
      );
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODBURI);

    const existingAdmin = await User.findOne({ role: "Admin" });

    if (existingAdmin) {
      console.log("An Admin user already exists. No new Admin created.");
      await mongoose.connection.close();
      process.exit(0);
    }

    const existingUserWithEmail = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    });

    if (existingUserWithEmail) {
      console.log(
        "A user with this email already exists. No new Admin created."
      );
      await mongoose.connection.close();
      process.exit(0);
    }

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "Admin",
    });

    console.log(`Admin user created successfully: ${ADMIN_EMAIL}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedAdmin();
