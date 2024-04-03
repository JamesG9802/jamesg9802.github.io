import { mat4, vec3 } from "gl-matrix";
import  { upv3, zeromat4, zerov3} from './extensions';

/**
 * Where the camera is looking from and what the camera is looking at.
 */
export class Eye {
    position: vec3;
    target: vec3;
    look_at_matrix: mat4;
    view_matrix: mat4;

    constructor(position: vec3 = zerov3, target: vec3 = vec3.create()) {
        this.position = position;
        this.target = target;
        this.look_at_matrix = mat4.create();
        this.view_matrix = mat4.create();
        this.#compute_view_matrix();
    }

    /**
     * Computes the view matrix given the target position.
     */
    #compute_view_matrix() {
        //  https://carmencincotti.com/2022-04-25/cameras-theory-webgpu/
        let forward_vector: vec3 = vec3.normalizen(vec3.subn(this.position, this.target));
        let right_vector: vec3 = vec3.normalizen(vec3.crossn(upv3, forward_vector));
        let up_vector: vec3 = vec3.normalizen(vec3.crossn(forward_vector, right_vector));
        let translation_vector: vec3 = vec3.fromValues(
            vec3.dot(this.position, right_vector),
            vec3.dot(this.position, up_vector),
            vec3.dot(this.position, forward_vector)
        );
        this.look_at_matrix = mat4.fromValues(
            right_vector[0],    right_vector[1],    right_vector[2],    translation_vector[0], 
            up_vector[0],       up_vector[1],       up_vector[2],       translation_vector[0],
            forward_vector[0],  forward_vector[1],  forward_vector[2],  translation_vector[0],
            0,                  0,                  0,                  1,
        )
        this.view_matrix = mat4.fromValues(
            right_vector[0],        up_vector[0],            forward_vector[0],       0, 
            right_vector[1],        up_vector[1],            forward_vector[1],       0,
            right_vector[2],        up_vector[2],            forward_vector[2],       0,
            -translation_vector[0], -translation_vector[1],  -translation_vector[2],  1,
        )
    }

    /**
     * Sets the new target position for the camera
     * @param new_target the new target position
     */
    set_target(new_target: vec3) {
        this.target = new_target;
        this.#compute_view_matrix();
    }
}

export type Camera = {
    eye: Eye
    project_matrix: mat4
}

export module Camera {
    /**
     * Computes the projection matrix.
     * @param aspect_ratio the desired aspect ratio of the screen
     * @param field_of_view the angle of the field of view
     * @param near_plane_distance the distance to the near plane
     * @param far_plane_distance the distance to the far plane
     */
    export function compute_projection_matrix(aspect_ratio: number, field_of_view: number, 
        near_plane_distance: number, far_plane_distance: number
    ): mat4 {
        //  https://carmencincotti.com/2022-05-02/homogeneous-coordinates-clip-space-ndc/
        let perspective_view_matrix: mat4 = zeromat4;
        mat4.perspective(perspective_view_matrix, field_of_view, aspect_ratio, near_plane_distance, far_plane_distance);
        /*return mat4.fromValues(
            1/(Math.tan(field_of_view / 2) * aspect_ratio), 0, 0, 0,
            0, 1/Math.tan(field_of_view / 2), 0, 0,
            0, 0, -(far_plane_distance - near_plane_distance) / (far_plane_distance - near_plane_distance), 0,
            0, 0, 0, 0,
        )*/
        return perspective_view_matrix;
    }
}

