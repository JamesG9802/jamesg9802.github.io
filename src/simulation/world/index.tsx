import { Engine } from "simulation/engine";
import { Camera } from "./camera";
import { Entity } from "./entity";

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
        engine.model_pipeline.begin_render_command(engine.device);
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].render(engine, this, i == 0);
        }
        engine.model_pipeline.end_render_command(engine.device);
    }
}

