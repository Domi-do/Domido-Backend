import { Schema } from "mongoose";

import { OBJECT_NAMES, COLLIDERS, GROUP_NAMES, TYPE } from "../constants/index";

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
  title: {
    type: String,
    required: true,
  },
});

export default objectInfoSchema;
