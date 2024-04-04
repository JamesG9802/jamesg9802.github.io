import { Engine } from "engine";
import { Camera } from "./camera"
import { Entity } from "./entity"
import { vec3 } from "wgpu-matrix";

export class World {
    test: number = 0;
    main_camera: Camera;
    entities: Entity[];

    constructor(main_camera: Camera, entities?: Entity[]) {
        this.main_camera = main_camera;
        this.entities = entities != undefined ? [...entities] : [];
    }

    /**
     * Renders all entities using the engine's model pipeline.
     */
    render(engine: Engine) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(engine, this);
        }
    }
}

