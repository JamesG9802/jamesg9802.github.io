import { Mat4, Quat, Vec3, mat4, quat, vec3, vec4 } from "wgpu-matrix";
import { Model, model_uniform_bytelength } from "./model";
import { Engine } from "engine";
import { World } from "world";

export class Entity {
    model: Model;

    transform: Mat4;
    position: Vec3;
    rotation: Quat;
    scale: Vec3;
    
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.transform = mat4.identity();

        this.#create_transform();
        this.model = model;
    }

    #create_transform() {
        this.transform = mat4.identity();
        let scaling_matrix: Mat4 = mat4.create();
        let rotation_matrix: Mat4 = mat4.create();
        let translation_matrix: Mat4 = mat4.create();
        mat4.scaling(this.scale, scaling_matrix);
        mat4.fromQuat(this.rotation, rotation_matrix);
        mat4.translation(this.position, translation_matrix);

        mat4.multiply(scaling_matrix, rotation_matrix, this.transform);
        mat4.multiply(this.transform, translation_matrix, this.transform);
    }

    /**
     * Gets all relevant data from the entity to put into the uniform buffer.
     * @returns 
     */
    #floats_for_uniform(world: World): Float32Array {
        //  4 bytes per float
        let uniform_data: Float32Array = new Float32Array(model_uniform_bytelength / 4);

        //  Model view
        let model_view: Mat4 = mat4.clone(world.main_camera.eye.view_matrix);
        mat4.scale(model_view, this.scale, model_view);
        let {axis, angle} = quat.toAxisAngle(this.rotation);
        mat4.rotate(model_view, axis, angle, model_view);
        mat4.translate(model_view, this.position, model_view);
        uniform_data.set(model_view, 0);
        uniform_data.set(world.main_camera.project_matrix, 16);
        return uniform_data;
    }
    /**
     * Renders this entity to the engine's model pipeline.
     * @param engine 
     */
    render(engine: Engine, world: World) {
    //    this.position[1] = 2*Math.sin(this.rotation[3])
    //    quat.rotateX(this.rotation, Math.PI / 200, this.rotation);
    //    quat.rotateY(this.rotation, Math.PI / 400, this.rotation);
    //    quat.rotateZ(this.rotation, Math.PI / 800, this.rotation);
        this.#create_transform();
        engine.device.queue.writeBuffer(this.model.uniform_buffer, 0, this.#floats_for_uniform(world));
        engine.model_pipeline.render(engine, this.model);
    }

    destroy() {
        this.model.destroy();
    }
}