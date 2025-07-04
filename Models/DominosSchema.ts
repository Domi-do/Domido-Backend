import mongoose, { Schema } from "mongoose";

import objectInfoSchema from "./ObjectInfoSchema";

const dominosSchema = new Schema({
  _id: { type: String, required: true },
  projectId: { type: String },
  position: {
    type: [Number],
    required: true,
    validate: { validator: (arr: number[]) => arr.length === 3 },
  },
  rotation: {
    type: [Number],
    required: true,
    validate: { validator: (arr: number[]) => arr.length === 3 },
  },
  opacity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
  },
  objectInfo: {
    type: objectInfoSchema,
    required: true,
  },
});

export const DominoModel = mongoose.model("DominoModel", dominosSchema);
