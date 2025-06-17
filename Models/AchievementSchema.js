import mongoose, { Schema } from "mongoose";

const achievementItemSchema = new Schema(
  {
    name: { type: String, required: true },
    achieved: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const achievementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User", unique: true },
  achievements: { type: [achievementItemSchema], default: [] },
});

const Achievement = mongoose.model("achievement", achievementSchema);

export default Achievement;
