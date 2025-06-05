import mongoose, { Schema } from "mongoose";

import { OBJECT_NAMES, COLLIDERS, GROUP_NAMES, TYPE } from "../constants/index.js";

const objectInfoSchema = new Schema({
  objectName: {
    type: String,
    enum: OBJECT_NAMES,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  sound: {
    type: String,
    required: true,
  },
  colliders: {
    type: String,
    enum: COLLIDERS,
    required: true,
  },
  type: {
    type: String,
    enum: TYPE,
    required: true,
  },
  groupName: {
    type: String,
    enum: GROUP_NAMES,
    required: true,
  },
});

const projectSchema = new Schema({
  title: {
    type: String,
  },
  ownerId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const DominosSchema = new Schema({
  projectId: {
    type: String,
    required: false,
  },
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
  color: { type: String },
  objectInfo: {
    type: objectInfoSchema,
    required: true,
  },
});

export const Domino = mongoose.model("Domino", DominosSchema);
export const Project = mongoose.model("Project", projectSchema);
