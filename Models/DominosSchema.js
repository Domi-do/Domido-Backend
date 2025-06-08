import mongoose, { Schema } from "mongoose";

import objectInfoSchema from "./ObjectInfoSchema.js";

const dominosSchema = new Schema({
  projectId: { type: String },
  position: {
    type: [Number],
    required: true,
    validate: { validator: (arr) => arr.length === 3 },
  },
  rotation: {
    type: [Number],
    required: true,
    validate: { validator: (arr) => arr.length === 3 },
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
