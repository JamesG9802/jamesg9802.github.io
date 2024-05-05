import { Entity } from "simulation/world/entity";
import { Model } from "simulation/world/model";
import { Quat, Vec3, quat, vec3 } from "wgpu-matrix";

export default class AsteroidEntity extends Entity {
    x_speed?: number
    y_speed?: number

    static #on_update(entity: AsteroidEntity, _mouse_position: [number, number], time_delta: number) {
        if(entity.x_speed == undefined || entity.y_speed == undefined) {
            entity.x_speed = 4 * Math.random() - 2;
            entity.y_speed = 4 * Math.random() - 2;
            if(Math.abs(entity.x_speed) < .01)
                entity.x_speed = .01; 
            if(Math.abs(entity.y_speed) < .01)
                entity.y_speed = .01; 
        }
        entity.position = vec3.fromValues(
            entity.position[0] + entity.x_speed * time_delta,
            entity.position[1] + entity.y_speed * time_delta,
            entity.position[2]
        );
        if(entity.position[0] > 8 || entity.position[0] < -8) {
            entity.position[0] = Math.random() > .5 ? -8 : 8;
            entity.position[1] =  Math.random() > .5 ? -8 : 8;
            entity.x_speed = 4 * Math.random() - 2;
            entity.y_speed = 4 * Math.random() - 2;
            if(Math.abs(entity.x_speed) < .01)
                entity.x_speed = .01; 
            if(Math.abs(entity.y_speed) < .01)
                entity.y_speed = .01; 
        } 
        
        quat.rotateX(entity.rotation, time_delta * entity.x_speed, entity.rotation);
        quat.rotateY(entity.rotation, time_delta * entity.y_speed, entity.rotation);
    }
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        super(position, rotation, scale, model, AsteroidEntity.#on_update);
    }
}