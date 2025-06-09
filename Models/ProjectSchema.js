import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ProjectModel = mongoose.model("ProjectModel", projectSchema);
