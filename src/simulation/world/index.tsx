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
     * Updates all entities with the time delta.
     * @param time_delta the number of milliseconds since the last update
     */
    update(time_delta: number) {
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].update(time_delta);
        }
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
        //  After updating and before rendering, the world's main_camera may have changed (view_updated)
        //  After rendering, we need to set the view_updated back to false to track if any changes
        //  were made in the next update
        this.main_camera.eye.updated_view = false;
    }
}

