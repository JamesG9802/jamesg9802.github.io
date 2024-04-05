import { Mat4, Quat, Vec3, mat3, mat4, quat, vec3 } from "wgpu-matrix";
import { Model, model_uniform_bytelength } from "./model";
import { Engine } from "simulation/engine";
import { World } from "simulation/world";

export class Entity {
    //  GPU Related fields
    model: Model;

    //  Entity related fields   
    /**
     *  Tracks if the transform changed to determine if the entity needs to update its uniform buffer.
     */ 
    #transform_changed: boolean;
    #transform: Mat4;

    #position: Vec3;
    #rotation: Quat;
    #scale: Vec3;
    
    starting_height: number;
    time: number; 
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        this.model = model;
    
        //  Set to true so that on the first render, the entity will write its uniform into the buffer
        this.#transform_changed = true;
        this.#transform = mat4.identity();

        this.#position = position;
        this.#rotation = rotation;
        this.#scale = scale;
        
        this.#update_transform();
        this.starting_height = position[1];
        this.time = Math.random() * 10;
    }

    #update_transform() {
        this.#transform = mat4.identity();
        let scaling_matrix: Mat4 = mat4.create();
        let rotation_matrix: Mat4 = mat4.create();
        let translation_matrix: Mat4 = mat4.create();
        mat4.scaling(this.#scale, scaling_matrix);
        mat4.fromQuat(this.#rotation, rotation_matrix);
        mat4.translation(this.#position, translation_matrix);

    //    mat4.multiply(scaling_matrix, rotation_matrix, this.#transform);
    //    mat4.multiply(this.#transform, translation_matrix, this.#transform);
    
        mat4.multiply(translation_matrix, scaling_matrix, this.#transform);
        mat4.multiply(this.#transform, rotation_matrix, this.#transform);
    }

    /**
     * Gets all relevant data from the entity to put into the uniform buffer.
     */
    #update_uniform(device: GPUDevice, world: World) {
        //  4 bytes per float
        let uniform_data: Float32Array = new Float32Array(model_uniform_bytelength / 4);

        //  Model view
        /*
        let model_view: Mat4 = mat4.clone(world.main_camera.eye.view_matrix);
        mat4.scale(model_view, this.scale, model_view);
        let {axis, angle} = quat.toAxisAngle(this.rotation);
        mat4.rotate(model_view, axis, angle, model_view);
        mat4.translate(model_view, this.position, model_view);
        */
        
        let model_view = mat4.multiply(world.main_camera.eye.view_matrix, this.#transform);
        let normal_matrix = mat3.fromMat4(model_view);
        mat3.transpose(normal_matrix, normal_matrix);
        mat3.inverse(normal_matrix, normal_matrix);

        uniform_data.set(model_view, 0);
        uniform_data.set(normal_matrix, 16);
        
        device.queue.writeBuffer(this.model.uniform_buffer, 0, uniform_data);
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
     * Renders this entity to the engine's model pipeline.
     * @param engine 
     */
    render(engine: Engine, world: World, first: boolean) {
    //    this.position[1] = 2*Math.sin(this.rotation[3])
    //    quat.rotateX(this.rotation, Math.PI / 200, this.rotation);
    //    quat.rotateY(this.rotation, Math.PI / 400, this.rotation);
    //    quat.rotateZ(this.rotation, Math.PI / 800, this.rotation);
    //    this.#update_transform();
        
        //  There is only a need to update the Model*View matrix if
        //  the model (position, rotation, scale) changed or the view (position, forward) changed.
        if(this.#transform_changed || world.main_camera.eye.updated_view) {
            this.#update_transform();
            this.#update_uniform(engine.device, world);
            this.#transform_changed = false;
        }
        engine.model_pipeline.render(engine, world, this.model, first);
    }

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