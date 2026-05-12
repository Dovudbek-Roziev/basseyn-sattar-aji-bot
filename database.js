require("dotenv").config();
const mongoose = require("mongoose");

// MongoDB ga ulanish
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB ga ulandi");
  } catch (err) {
    console.error("❌ MongoDB ulanish xatosi:", err.message);
    process.exit(1);
  }
}

// ─── Foydalanuvchi modeli ───────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, default: "" },
  firstName: { type: String, default: "" },
  language: { type: String, enum: ["uz", "ru", "ky"], default: "uz" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// ─── Sozlamalar modeli (narx, vaqt, manzil, telefon) ───────────────────────
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 'main' bo'ladi
  prices: { type: String, default: "" },
  workingHours: { type: String, default: "" },
  address: { type: String, default: "" },
  mapsLink: { type: String, default: "" },
  phone: { type: String, default: "" },
  photos: { type: [String], default: [] },
});

const Settings = mongoose.model("Settings", settingsSchema);

// ─── Band qilishlar modeli ──────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  username: { type: String, default: "" },
  firstName: { type: String, default: "" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  language: { type: String, default: "uz" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

// ─── Yordamchi funksiyalar ──────────────────────────────────────────────────

// Foydalanuvchi tilini olish
async function getUserLang(userId) {
  const user = await User.findOne({ userId });
  return user ? user.language : null;
}

// Foydalanuvchini saqlash yoki yangilash
async function saveUser(userId, username, firstName, language) {
  await User.findOneAndUpdate(
    { userId },
    { userId, username, firstName, language },
    { upsert: true, new: true }
  );
}

// Sozlamalarni olish (bitta qator bor doim)
async function getSettings() {
  let settings = await Settings.findOne({ key: "main" });
  if (!settings) {
    settings = await Settings.create({ key: "main" });
  }
  return settings;
}

// Sozlamani yangilash
async function updateSetting(field, value) {
  await Settings.findOneAndUpdate(
    { key: "main" },
    { [field]: value },
    { upsert: true }
  );
}

// Rasm qo'shish
async function addPhoto(fileId) {
  await Settings.findOneAndUpdate(
    { key: "main" },
    { $push: { photos: fileId } },
    { upsert: true }
  );
}

// Barcha rasmlarni o'chirish
async function clearPhotos() {
  await Settings.findOneAndUpdate(
    { key: "main" },
    { photos: [] },
    { upsert: true }
  );
}

// Band qilishni saqlash
async function saveBooking(data) {
  return await Booking.create(data);
}

// Barcha band qilishlarni olish
async function getAllBookings() {
  return await Booking.find().sort({ createdAt: -1 }).limit(50);
}

module.exports = {
  connectDB,
  User,
  Settings,
  Booking,
  getUserLang,
  saveUser,
  getSettings,
  updateSetting,
  addPhoto,
  clearPhotos,
  saveBooking,
  getAllBookings,
};
