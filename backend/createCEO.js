// createCEO.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function createCEO() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Brightex CEO",
    email: "ceo@brightex.com",
    password: hashedPassword,
    role: "CEO",
  });

  console.log("CEO created");
  process.exit();
}

createCEO();

// we have to run this file once to create the CEO user in the database

// CEO Authorization Token:
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDUyNzA1NWFiYzc2ZjZiNmNmNzRmMiIsInJvbGUiOiJDRU8iLCJpYXQiOjE3NjYzMDUzMzAsImV4cCI6MTc2NjM5MTczMH0.iCoWPo9p9UIiMuumKNKWBb18Tg0IBP2P2IvAZJ36ecQ

// Employee login:
// "email": "rahul@brightex.com",
// "password": "employee@123"

// Employee Authorization Token:
//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDY0ZGU2NDE4YzBhYWU2NWIxYmJiNCIsInJvbGUiOiJFTVBMT1lFRSIsImlhdCI6MTc2NjM5NDU5MCwiZXhwIjoxNzY2NDgwOTkwfQ.oYhn1EUeH1vhmIiahDZkBZj6mRbCReeydZyUlc3lxGM
