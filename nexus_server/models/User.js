const mongoose = require("mongoose");

const QuestSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  expReward: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  category: {
    type: String,
    enum: ["TECH", "FITNESS", "MINDSET"],
    default: "TECH",
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Em produção, utilize bcrypt para encriptar
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    strength: { type: Number, default: 10 },
    agility: { type: Number, default: 10 },
    quests: { type: [QuestSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
