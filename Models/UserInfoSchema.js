import mongoose, { Schema } from "mongoose";

const userInfoSchema = new Schema({
  kakaoId: {
    type: String,
    required: true,
    unique: true,
  },
});

const userSchema = mongoose.model("auth", userInfoSchema);

export default userSchema;
