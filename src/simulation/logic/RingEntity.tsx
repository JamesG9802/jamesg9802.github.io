import { RingVolume } from "@mui/icons-material";
import { Entity } from "simulation/world/entity";
import { Model } from "simulation/world/model";
import { Quat, Vec3, quat, vec2, vec3 } from "wgpu-matrix";

const min_speed = .5;
const pos_acceleration = 2;
const neg_acceleration = .5;
const max_speed = 4;

export default class RingEntity extends Entity {
    static count: number = 0;
    static FAST: boolean = false;
    static speed: number = min_speed;
    time?: number = 0
    radius?: number = 1
    static #on_update(entity: RingEntity, mouse_position: [number, number], time_delta: number) {
        if(entity.time == undefined)
            entity.time = 0;
        if(entity.radius == undefined)
            entity.radius = 1;

        if(RingEntity.FAST)
        {
            RingEntity.speed = Math.min(RingEntity.speed + pos_acceleration * time_delta, max_speed);
        }
        else
        {
            RingEntity.speed = Math.max(RingEntity.speed - neg_acceleration * time_delta, min_speed);
        }

        entity.time += RingEntity.speed * time_delta;
        entity.position = vec3.fromValues(
            entity.radius * Math.cos(entity.time), 
            entity.radius * Math.sin(entity.time),
            entity.position[2]);
        
        quat.rotateX(entity.rotation, RingEntity.speed * time_delta / 5.5, entity.rotation);
        quat.rotateY(entity.rotation, RingEntity.speed * time_delta / 3.5, entity.rotation);
    }
    constructor(position: Vec3, rotation: Quat, scale: Vec3, model: Model) {
        super(position, rotation, scale, model, RingEntity.#on_update);
        this.radius = vec2.len(vec2.fromValues(this.position[0], this.position[1]));

        //  Because I am too lazy to implement my scripting system yet,
        //  I force each entity to get a time evenly spaced by 12
        this.time = RingEntity.count++ / 12 * 2 * Math.PI;     
    }
}