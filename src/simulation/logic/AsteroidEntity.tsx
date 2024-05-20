import { World } from "simulation/world";
import { Entity } from "simulation/world/entity";
import { Model } from "simulation/world/model";
import { Quat, Vec3, quat, vec3 } from "wgpu-matrix";

export default class AsteroidEntity extends Entity {
    x_speed?: number
    y_speed?: number

    static #on_update(entity: AsteroidEntity, _world: World, _mouse_position: Vec3, time_delta: number) {
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
        if(entity.position[0] > 15 || entity.position[0] < -15) {
            entity.position[0] = Math.random() > .5 ? -15 : 15;
            entity.position[1] =  Math.random() > .5 ? -15 : 15;
            entity.x_speed = 7 * Math.random() - 3.5;
            entity.y_speed = 7 * Math.random() - 3.5;
            if(Math.abs(entity.x_speed) < .2)
                entity.x_speed = .2; 
            if(Math.abs(entity.y_speed) < .2)
                entity.y_speed = .2; 
        } 
        
        quat.rotateX(entity.rotation, time_delta * entity.x_speed, entity.rotation);
        quat.rotateY(entity.rotation, time_delta * entity.y_speed, entity.rotation);
    }
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        super(position, rotation, scale, model, AsteroidEntity.#on_update);
    }
}