import { vec4, vec4 as glVec4 } from "gl-matrix";

declare module 'gl-matrix' {
  export namespace vec4 {
  }
}

export const zerov4: vec4 = glVec4.create();
