import { Mat4, Vec3, mat4, vec3 } from 'wgpu-matrix';

/**
 * Where the camera is looking from and what the camera is looking at.
 */
export class Eye {
    position: Vec3;
    forward: Vec3;
    look_at_matrix: Mat4;
    view_matrix: Mat4;

    /**
     * Creates an eye at a given position and facing a specific direction. Note that the camera usually faces in the negative Z direction.
     * @param position 
     * @param forward
     */
    constructor(position: Vec3, forward: Vec3) {
        this.position = position;
        this.forward = forward;
        this.look_at_matrix = mat4.create();
        this.view_matrix = mat4.create();
        this.#compute_view_matrix();
    }

    /**
     * Computes the view matrix given the target position.
     */
    #compute_view_matrix() {
        const z_axis = vec3.normalize(this.forward);
        const x_axis = vec3.normalize(vec3.cross(vec3.fromValues(0, 1, 0), z_axis));
        const y_axis = vec3.normalize(vec3.cross(z_axis, x_axis));

        this.view_matrix = mat4.create(
            x_axis[0], x_axis[1], x_axis[2], 0,
            y_axis[0], y_axis[1], y_axis[2], 0,
            z_axis[0], z_axis[1], z_axis[2], 0,
            this.position[0], this.position[1], this.position[2], 1
        )
        //mat4.lookAt(this.position, this.target, vec3.fromValues(0, 1, 0), this.view_matrix);
        mat4.inverse(this.view_matrix, this.view_matrix);
    }

    /**
     * Sets the camera's new position
     * @param new_position the camera's new position
     */
    set_position(new_position: Vec3) {
        this.position = new_position;
        this.#compute_view_matrix();
    }

    /**
     * Sets the new target position for the camera
     * @param new_forward the new target position
     */
    set_forward(new_forward: Vec3) {
        this.forward = new_forward;
        this.#compute_view_matrix();
    }

    /**
     * Sets the new position and target position for the camera
     * @param new_position the camera's new position
     * @param new_forward the new target position
     */
    set_position_and_forward(new_position: Vec3, new_forward: Vec3) {
        this.position = new_position;
        this.forward = new_forward;
        this.#compute_view_matrix();
    }
}

export type Camera = {
    eye: Eye
    project_matrix: Mat4
}

export module Camera {
    /**
     * Computes the projection matrix.
     * @param field_of_view the angle of the field of view
     * @param aspect_ratio the desired aspect ratio of the screen
     * @param near_plane_distance the distance to the near plane
     * @param far_plane_distance the distance to the far plane
     */
    export function compute_projection_matrix(field_of_view: number, aspect_ratio: number,  
        near_plane_distance: number, far_plane_distance: number
    ): Mat4 {
        //  https://carmencincotti.com/2022-05-02/homogeneous-coordinates-clip-space-ndc/
        let perspective_view_matrix: Mat4 = mat4.perspective(field_of_view, 
            aspect_ratio, near_plane_distance, far_plane_distance);
        return perspective_view_matrix;
    }
}

