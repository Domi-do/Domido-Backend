import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
  kakaoId: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: { type: String, default: null },
  accessToken: { type: String, default: null },
  isTutorialUser: { type: Boolean, default: true },
});

const User = mongoose.model("user", userInfoSchema);

export default User;
