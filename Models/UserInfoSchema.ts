import mongoose, { Schema } from "mongoose";

const achievementItemSchema = new Schema(
  {
    name: { type: String, required: true },
    achieved: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userInfoSchema = new Schema({
  kakaoId: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: { type: String, default: null },
  accessToken: { type: String, default: null },
  isTutorialUser: { type: Boolean, default: true },
  achievements: { type: [achievementItemSchema], default: [] },
});

const User = mongoose.model("user", userInfoSchema);

export default User;
