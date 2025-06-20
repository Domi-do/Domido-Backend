export const GROUP_NAMES = ["STATIC_OBJECTS", "DYNAMIC_OBJECTS"] as const;

interface ObjectInfoType {
  objectName: string;
  thumbnail: string;
  model: string;
  sound: string;
  colliders: string;
  type: string;
  groupName: (typeof GROUP_NAMES)[number];
  title: string;
}

export interface DominoType {
  projectId: string;
  position: number[];
  rotation: number[];
  opacity: number;
  color: string | null;
  objectInfo: ObjectInfoType;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}
