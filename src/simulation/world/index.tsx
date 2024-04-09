import { Engine } from "simulation/engine";
import { Camera } from "./camera";
import { Entity } from "./entity";
import { Mesh } from "./mesh";

export class World {
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

        engine.model_pipeline.begin_model_render(engine.device, engine.context);

        //  First update the uniforms of all entities.
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].write_uniform(engine, this);
            //  if the entity is a non instance, it can send a render call now.
            if(!this.entities[i].model.is_instance) {
                this.entities[i].render(engine, this);
            }
        }
        
        engine.model_pipeline.end_model_render(engine.device);

        //  Next we render all instances
        
        engine.model_pipeline.begin_instance_render(engine.device, engine.context);
        for(const key in Mesh.allocated_meshes) {
            Mesh.render_instance(engine, this, key);
        }
        engine.model_pipeline.end_instance_render(engine.device);

        //  After updating and before rendering, the world's main_camera may have changed (view_updated)
        //  After rendering, we need to set the view_updated back to false to track if any changes
        //  were made in the next update
        this.main_camera.eye.updated_view = false;
    }
}

