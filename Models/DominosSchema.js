import mongoose, { Schema } from "mongoose";

import { OBJECT_NAMES, COLLIDERS, GROUP_NAMES } from "../constants/index.js";

const objectInfoSchema = new Schema({
  objectName: {
    type: String,
    enum: OBJECT_NAMES,
    required: true,
  },
  thumbnailPath: {
    type: String,
    required: true,
  },
  glbPath: {
    type: String,
    required: true,
  },
  soundPath: {
    type: String,
    required: true,
  },
  colliders: {
    type: String,
    enum: COLLIDERS,
    required: true,
  },
  groupName: {
    type: String,
    enum: GROUP_NAMES,
    required: true,
  },
});

const DominosSchema = new Schema({
  position: {
    type: [Number],
    required: true,
    validate: {
      validator: (arr) => arr.length === 3,
    },
  },
  rotation: {
    type: [Number],
    required: true,
    validate: {
      validator: (arr) => arr.length === 3,
    },
  },
  opacity: { type: Number, required: true },
  color: { type: String, required: true },
  objectInfo: {
    type: objectInfoSchema,
    required: true,
  },
});

const dominosSchema = mongoose.model("dominos", DominosSchema);

export default dominosSchema;
