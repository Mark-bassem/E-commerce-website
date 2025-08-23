import "dotenv/config";
import mongoose from "mongoose";
import Product from "./src/models/Product.js";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected");

  // create test products if none
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.create([
      {
        name: "White Tank Top",
        description: "Breathable training tank",
        price: 50,
        image: "",
      },
      {
        name: "Black Sport Shorts",
        description: "Sweat-wicking shorts",
        price: 35,
        image: "",
      },
      {
        name: "Sport Shoes",
        description: "Cushioned sole",
        price: 80,
        image: "",
      },
      {
        name: "Gym Bag",
        description: "Water resistant",
        price: 100,
        image: "",
      },
      {
        name: "Sunglasses",
        description: "Stylish black frame",
        price: 20,
        image: "",
      },
    ]);
    console.log("seeded products");
  }

  // create admin user
  const adminEmail = "admin@example.com";
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hash = await bcrypt.hash("secret123", 10);
    await User.create({
      username: "Admin",
      email: adminEmail,
      password: hash,
      isAdmin: true,
    });
    console.log("created admin user:", adminEmail, "password: secret123");
  }

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});