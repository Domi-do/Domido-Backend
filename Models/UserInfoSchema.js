import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
  kakaoId: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = mongoose.model("user", userInfoSchema);

export default User;
