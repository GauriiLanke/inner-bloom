const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    age: { type: Number, required: true, min: 10, max: 80 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);

