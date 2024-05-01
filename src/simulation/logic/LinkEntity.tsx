import { Entity } from "simulation/world/entity";
import { Model } from "simulation/world/model";
import { Quat, Vec3, quat, vec3 } from "wgpu-matrix";

export default class LinkEntity extends Entity {
    static #on_update(entity: LinkEntity, mouse_position: [number, number]) {
        entity.rotation = quat.rotationTo(vec3.fromValues(0, 0, 1), vec3.fromValues(mouse_position[0], -mouse_position[1], 0));
    }
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        super(position, rotation, scale, model, LinkEntity.#on_update);
    }
}