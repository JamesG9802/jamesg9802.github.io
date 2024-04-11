import { Engine } from 'simulation/engine';
import { Mat4, Vec3, mat4, vec3 } from 'wgpu-matrix';

/**
 * Where the camera is looking from and what the camera is looking at.
 */
export class Eye {
    /**
     * Keeps track if the eye was updated since the last frame.
     */
    updated_view: boolean;

    /**
     * The eye position.
     */
    #position: Vec3;

    /**
     * The direction the eye is looking at.
     */
    #forward: Vec3;

    /**
     * The view matrix that will be sent to the GPU during rendering.
     */
    #view_matrix: Mat4;

    /**
     * Creates an eye at a given position and facing a specific direction. Note that the camera usually faces in the negative Z direction.
     * @param position 
     * @param forward
     */
    constructor(position: Vec3, forward: Vec3) {
        //  Set to true so that on the first frame, the camera will update the view matrix.
        this.updated_view = true;
        this.#position = position;
        this.#forward = forward;
        this.#view_matrix = mat4.create();
        this.compute_view_matrix();
    }

    /**
     * Computes the view matrix given the target position.
     */
    compute_view_matrix() {
        const z_axis = vec3.normalize(this.#forward);
        const x_axis = vec3.normalize(vec3.cross(vec3.fromValues(0, 1, 0), z_axis));
        const y_axis = vec3.normalize(vec3.cross(z_axis, x_axis));

        this.#view_matrix = mat4.create(
            x_axis[0], x_axis[1], x_axis[2], 0,
            y_axis[0], y_axis[1], y_axis[2], 0,
            z_axis[0], z_axis[1], z_axis[2], 0,
            this.#position[0], this.#position[1], this.#position[2], 1
        )
        //mat4.lookAt(this.position, this.target, vec3.fromValues(0, 1, 0), this.view_matrix);
        mat4.inverse(this.#view_matrix, this.#view_matrix);
    }

    /**
     * Sets the new position and target position for the camera
     * @param new_position the camera's new position
     * @param new_forward the new target position
     */
    set_position_and_forward(new_position: Vec3, new_forward: Vec3) {
        this.updated_view = true;
        this.#position = new_position;
        this.#forward = new_forward;
    }

    get position(): Vec3 { return this.#position; }
    get forward(): Vec3 { return this.#forward; } 
    get view_matrix(): Mat4 { return this.#view_matrix };
    set position(position: Vec3) { 
        this.updated_view = true;
        this.#position = position;
    }
    set forward(forward: Vec3) {
        this.updated_view = true;
        this.#forward = forward;
    }
}

/**
 * A camera has a position and direction in the world along with a projection matrix to 
 * render objects to the screen.
 */
export class Camera {
    /**
     * The kind of projection the camera is using.
     */
    #projection_matrix: Mat4;
    
    /**
     * The buffer where the projection matrix is stored on the GPU.
     */
    #projection_buffer: GPUBuffer;
    
    /**
     * The bind group for the projection buffer.
     */
    #projection_bind_group: GPUBindGroup;

    /**
     * The eye of the camera, which controls where and what it is looking at.
     */
    eye: Eye;

    /**
     * Creates a camera
     * @param engine 
     * @param eye 
     * @param field_of_view 
     * @param aspect_ratio 
     * @param near_plane_distance 
     * @param far_plane_distance 
     */
    constructor(engine: Engine, eye: Eye, field_of_view: number, aspect_ratio: number,  
        near_plane_distance: number, far_plane_distance: number) {
        this.eye = eye;
        this.#projection_matrix = mat4.identity();
        this.#projection_buffer = engine.device.createBuffer({
            label: "Main camera's projection buffer",
            size: 64,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: false
        });
        this.#projection_bind_group = engine.device.createBindGroup({
            label: "Renderer bind group",
            layout: engine.model_pipeline.unique_pipeline.getBindGroupLayout(0),
            entries: [{
                binding: 0,
                resource: {buffer: this.#projection_buffer}
            }]
        });
        this.set_perspective_projection(engine.device, field_of_view, aspect_ratio, 
            near_plane_distance, far_plane_distance);

        engine.device.queue.writeBuffer(this.#projection_buffer, 0, new Float32Array(this.#projection_matrix));
    }

    /**
     * Computes the projection matrix.
     * @param field_of_view the angle of the field of view
     * @param aspect_ratio the desired aspect ratio of the screen
     * @param near_plane_distance the distance to the near plane
     * @param far_plane_distance the distance to the far plane
     * @param output the matrix where the results will be saved to
     */
    set_perspective_projection(device: GPUDevice, field_of_view: number, aspect_ratio: number,  
        near_plane_distance: number, far_plane_distance: number
    ) {
        //  https://carmencincotti.com/2022-05-02/homogeneous-coordinates-clip-space-ndc/
        mat4.perspective(field_of_view, aspect_ratio, near_plane_distance, far_plane_distance, this.#projection_matrix);
        device.queue.writeBuffer(this.#projection_buffer, 0, new Float32Array(this.#projection_matrix));
    }

    /**
     * Called when the camera is destroyed.
     */
    destroy() {
        this.#projection_buffer.destroy();
    }

    /**
     * Get the camera's projection buffer.
     */
    get projection_bind_group(): GPUBindGroup {
        return this.#projection_bind_group;
    }
}
