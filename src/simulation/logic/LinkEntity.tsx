import { World } from "simulation/world";
import { Entity } from "simulation/world/entity";
import { Model } from "simulation/world/model";
import { Quat, Vec3, quat, vec3, } from "wgpu-matrix";

export default class LinkEntity extends Entity {
    static offset: number = 0;
    origin?: Vec3
    static #on_update(entity: LinkEntity, world: World, mouse_position: Vec3) {
        if(!entity.origin)
            entity.origin = vec3.create(entity.position[0], entity.position[1], entity.position[2]);

        let w_pos = world.screen_to_world(mouse_position);

        entity.position = vec3.add(entity.origin, LinkEntity.get_offset_position());

        let dir = vec3.create();
        dir = vec3.subtract(entity.position, vec3.create(w_pos[0], w_pos[1], 0));

        entity.rotation = quat.rotationTo(vec3.fromValues(0, 0, 1), dir);
        //entity.position = world.screen_to_world(mouse_position);
    }

    static get_offset_position(): Vec3 {
        return vec3.create(
            Math.sin(LinkEntity.offset),
            0.25 * Math.cos(.667 * LinkEntity.offset),
            0
        )
    }
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        super(position, rotation, scale, model, LinkEntity.#on_update);
    }
}