import { GROUP_NAMES } from "./domino";

export type PresetDomino = {
  _id?: string;
  position: number[];
  rotation: number[];
  opacity: number;
  color: string | null;
  objectInfo: {
    objectName: string;
    thumbnail: string;
    model: string;
    sound: string;
    colliders: string;
    type: string;
    groupName: (typeof GROUP_NAMES)[number];
    title: string;
  };
};