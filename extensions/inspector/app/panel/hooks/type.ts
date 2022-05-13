export interface ICCEditorNode {
  active: Active;
  locked: Locked;
  name: Name;
  position: Position;
  rotation: Rotation;
  scale: Scale;
  layer: Layer;
  uuid: Uuid;
}

export interface Active {
  value: boolean;
  default: any;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: any[];
}

export interface Locked {
  value: boolean;
  default: boolean;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: any[];
}

export interface Name {
  value: string;
  default: any;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: any[];
}

export interface Position {
  value: Value;
  default: Default;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: string[];
}

export interface Value {
  x: number;
  y: number;
  z: number;
}

export interface Default {
  x: number;
  y: number;
  z: number;
}

export interface Rotation {
  value: Value2;
  default: Default2;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: string[];
}

export interface Value2 {
  x: number;
  y: number;
  z: number;
}

export interface Default2 {
  x: number;
  y: number;
  z: number;
}

export interface Scale {
  value: Value3;
  default: Default3;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: string[];
}

export interface Value3 {
  x: number;
  y: number;
  z: number;
}

export interface Default3 {
  x: number;
  y: number;
  z: number;
}

export interface Layer {
  value: number;
  default: number;
  type: string;
  readonly: boolean;
  visible: boolean;
  enumList: EnumList[];
  displayName: string;
  extends: any[];
}

export interface EnumList {
  name: string;
  value: number;
}

export interface Uuid {
  value: string;
  default: any;
  type: string;
  readonly: boolean;
  visible: boolean;
  displayName: string;
  extends: any[];
}
