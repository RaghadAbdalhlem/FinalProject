const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'content-manager'], default: 'user' },
  gender: { type: String, enum: ['man', 'woman', 'other'], default: "man" },
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  dietPreference: { type: String, enum: ['keto', 'vegan', 'vegetarian', 'mediterranean', 'other'], default: "keto" },
  goal: { type: String, enum: ['lose', 'gain', 'maintain'], default: "maintain" },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
