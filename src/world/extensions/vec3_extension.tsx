import { vec3, vec3 as glVec3 } from "gl-matrix";

declare module 'gl-matrix' {
  export namespace vec3 {
    /**
     * Returns the subtracted value of subtraction.
     * @param a a
     * @param b 
     */
    export function subn(a: vec3, b: vec3): vec3;

    /**
     * Returns the normalizd vector.
     * @param a
     */
    export function normalizen(a: vec3): vec3;

    /**
     * Returns the cross product between two vectors
     * @param a
     * @param b 
     */
    export function crossn(a: vec3, b: vec3): vec3;
  }
}

export const zerov3: vec3 = glVec3.create();
export const onev3: vec3 = glVec3.fromValues(1, 1, 1);
export const upv3: vec3 = glVec3.fromValues(0, 1, 0);

vec3.subn = function(a: vec3, b: vec3): vec3 {
  let new_vector: vec3 = vec3.create();
  glVec3.sub(new_vector, a, b);
  return new_vector;
}

vec3.normalizen = function(a: vec3): vec3 {
  let new_vector: vec3 = vec3.create();
  glVec3.normalize(new_vector, a);
  return new_vector;
}

vec3.crossn = function(a: vec3, b: vec3): vec3 {
  let new_vector: vec3 = vec3.create();
  glVec3.cross(new_vector, a, b);
  return new_vector;
}