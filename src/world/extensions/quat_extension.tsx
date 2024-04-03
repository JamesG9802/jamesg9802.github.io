import { quat } from "gl-matrix";

declare module 'gl-matrix' {
  export namespace quat {
    /**
     * Returns the quaternion of euler rotations
     * @param a a
     * @param b 
     */
    export function fromEulern(x: number, y: number, z: number): quat;
  }
}

quat.fromEulern = function fromEulern(x: number, y: number, z: number): quat {
    let new_quat: quat = quat.fromValues(0, 0, 0, 0);
    quat.fromEuler(new_quat, x, y, z);
    return new_quat;
}