import { quat, vec3, mat4 } from "gl-matrix";
import  "./extensions";
import { Model } from "./model";
import { Engine } from "engine";

export class Entity {
    model: Model;

    transform: mat4;
    position: vec3;
    rotation: quat;
    scale: vec3;
    
    constructor(position: vec3, rotation: quat, scale: vec3, model: Model) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.transform = mat4.createModelMatrix(position, rotation, scale);
        this.model = model;
    }

    /**
     * Renders this entity to the engine's model pipeline.
     * @param engine 
     */
    render(engine: Engine) {
        engine.device.queue.writeBuffer(this.model.uniform_buffer, 0, mat4.toFloat32Array(this.transform));
        engine.model_pipeline.render(engine, this.model);
    }
}