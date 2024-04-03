import { quat } from "gl-matrix";
import { vec3, mat4, mat4 as glMat4 } from "gl-matrix";

declare module 'gl-matrix' {
    export namespace mat4 {
      /**
       * Returns the product of A*B.
       * @param a 
       * @param b 
       */
      export function muln(a: mat4, b: mat4): mat4;

      /**
       * Given the position vector, returns the translation matrix.
       * @param a 
       */
      export function fromTranslationn(a: vec3): mat4;
      
      /**
       * Given the rotation quaternion, returns the rotation matrix.
       * @param a 
       */
      export function fromQuatn(a: quat): mat4;

      /**
       * Given the scale vector, returns the scale matrix.
       * @param a 
       */
      export function fromScalingn(a: vec3): mat4;

      /**
       * Given the position vector, rotation quaternion, and scale vector, returns the model matrix.
       * @param position 
       * @param rotation 
       * @param scale 
       */
      export function createModelMatrix(position: vec3, rotation: quat, scale: vec3): mat4;

      /**
       * Turns a mat4 into a more WebGPU friendly format.
       * @param matrix 
       */
      export function toFloat32Array(matrix: mat4): Float32Array;
    }
  }

export const zeromat4: mat4 = glMat4.create();

mat4.muln = function(a: mat4, b: mat4): mat4 {
  let new_matrix: mat4 = zeromat4;
  glMat4.mul(new_matrix, a, b);
  return new_matrix;
}

mat4.fromTranslationn = function(a: vec3): mat4 {
  let new_matrix: mat4 = zeromat4;
  glMat4.fromTranslation(new_matrix, a);
  return new_matrix;
}

mat4.fromQuatn = function(a: quat): mat4 {
  let new_matrix: mat4 = zeromat4;
  glMat4.fromQuat(new_matrix, a);
  return new_matrix;
}

mat4.fromScalingn = function(a: vec3): mat4 {
  let new_matrix: mat4 = zeromat4;
  glMat4.fromScaling(new_matrix, a);
  return new_matrix;
}

mat4.createModelMatrix = function(position: vec3, rotation: quat, scale: vec3): mat4 {
  let translation_matrix: mat4 = mat4.fromTranslationn(position);
  let rotation_matrix: mat4 = mat4.fromQuatn(rotation);
  let scale_matrix: mat4 = mat4.fromScalingn(scale);
  return mat4.muln(mat4.muln(translation_matrix, rotation_matrix), scale_matrix);
}

mat4.toFloat32Array = function(matrix: mat4): Float32Array {
  let array: Float32Array = new Float32Array([
    matrix[0], matrix[1], matrix[2], matrix[3],
    matrix[4], matrix[5], matrix[6], matrix[7],
    matrix[8], matrix[9], matrix[10], matrix[11],
    matrix[12], matrix[13], matrix[14], matrix[15],
  ]);
  return array;
}