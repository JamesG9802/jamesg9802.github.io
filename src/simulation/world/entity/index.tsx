import { Mat4, Quat, Vec3, mat3, mat4, vec3 } from "wgpu-matrix";
import { Model } from "simulation/world/model";
import { Engine } from "simulation/engine";
import { World } from "simulation/world";

/**
 * An entity is the basic agent in the simulation. They have a position, rotation, and scale
 * in the world. They are updated and then rendered every frame.
 */
export class Entity {
    /**
     * The model of the entity.
     */
    model: Model;
 
    /**
     *  Flat to track if the transform changed to determine if the entity needs to update its uniform buffer.
     */ 
    #transform_changed: boolean;

    /**
     * The entity's transform matrix.
     */
    #transform: Mat4;

    /**
     * The entity's position.
     */
    #position: Vec3;

    /**
     * The entity's rotation.
     */
    #rotation: Quat;

    /**
     * The entity's scale.
     */
    #scale: Vec3;
    
    starting_height: number;
    time: number; 

    /**
     * Creates and returns a new Entity.
     * @param position 
     * @param rotation 
     * @param scale 
     * @param model 
     */
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        this.model = model;
    
        //  Set to true so that on the first render, the entity will write its uniform into the buffer
        this.#transform_changed = true;
        this.#transform = mat4.identity();

        this.#position = position;
        this.#rotation = rotation;
        this.#scale = scale;
        
        this.#update_transform_matrix();
        this.starting_height = position[1];
        this.time = Math.random() * 10;
    }

    /**
     * Updates the entity's CPU side transform.
     * @returns 
     */
    #update_transform_matrix() {
        if(!this.#transform_changed) return;

        this.#transform = mat4.identity();
        let scaling_matrix: Mat4 = mat4.create();
        let rotation_matrix: Mat4 = mat4.create();
        let translation_matrix: Mat4 = mat4.create();

        mat4.scaling(this.#scale, scaling_matrix);
        mat4.fromQuat(this.#rotation, rotation_matrix);
        mat4.translation(this.#position, translation_matrix);
    
        mat4.multiply(translation_matrix, scaling_matrix, this.#transform);
        mat4.multiply(this.#transform, rotation_matrix, this.#transform);
    }

    /**
     * Updates the entity's CPU side uniform data.
     */
    #update_model_uniform(engine: Engine, world: World) {
        if(!this.#transform_changed && !world.main_camera.eye.updated_view) return;
        //  4 bytes per float
        let model_view = mat4.multiply(world.main_camera.eye.view_matrix, this.#transform);
        let normal_matrix = mat3.fromMat4(model_view);
        mat3.transpose(normal_matrix, normal_matrix);
        mat3.inverse(normal_matrix, normal_matrix);

        this.model.update_uniform(engine, model_view, normal_matrix);
        this.#transform_changed = false;
    }

    /**
     * Updates the entity based on time_delta.
     * @param time_delta 
     */
    update(time_delta: number) {
        this.time += time_delta;
        this.position = vec3.fromValues(this.position[0], this.starting_height + Math.cos(this.time), this.position[2]);
    }

    /**
     * Before rendering, entities need to write to their uniform buffers
     */
    update_buffers(engine: Engine, world: World) {
        this.#update_transform_matrix();
        this.#update_model_uniform(engine, world);
    }

    /**
     * Writes the data from the entity's CPU side uniform data to the GPU.
     * @param engine 
     */
    write_buffers(engine: Engine) {
        this.model.write_uniform(engine);
    }

    /**
     * Renders this entity to the engine's model pipeline.
     * @param engine 
     */
    render(engine: Engine, world: World) {
        if(this.model.uniform_buffer.for_instance)
            engine.model_pipeline.render_instance(world, this.model);
        else
            engine.model_pipeline.render_unique(world, this.model);
    }

    /**
     * Frees the entity's resources.
     */
    destroy() {
        this.model.destroy();
    }

    //  Getters and Setters
    get position(): Vec3 { return this.#position; }
    get rotation(): Quat { return this.#rotation; }
    get scale(): Vec3 { return this.#scale; }
    set position(value: Vec3) { 
        this.#transform_changed = true;
        this.#position = value; 
    }
    set rotation(value: Quat) { 
        this.#transform_changed = true;
        this.#rotation = value; 
    }
    set scale(value: Vec3) { 
        this.#transform_changed = true;
        this.#scale = value; 
    }
}