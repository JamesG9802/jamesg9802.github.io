import { Engine } from "simulation/engine";
import { Camera } from "./camera";
import { Entity } from "./entity";

/**
 * A world is the container for all events in the simulation. Entities are contained in the world
 * and are updated and rendered every frame. There is also a main camera that controls
 * what is actually rendered to the screen.
 */
export class World {
    /**
     * The main camera of the world.
     */
    main_camera: Camera;

    /**
     * An array of all the entities that will update and be rendered in the world.
     */
    entities: Entity[];

    /**
     * Creates a new world. Use `create()` instead.
     * @param main_camera 
     * @param entities 
     */
    constructor(main_camera: Camera, entities: Entity[]) {
        this.main_camera = main_camera;
        this.entities = entities;
    }

    /**
     * Creates and returns a new world.
     * @param main_camera 
     * @param entities 
     * @returns 
     */
    static create(main_camera: Camera, entities?: Entity[]) {
        return new World(
            main_camera,
            entities != undefined ? [...entities] : []
        );
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
        //  Before rendering, we tell the camera to update it's view matrix
        //  if any changes were made.
        if(this.main_camera.eye.updated_view) {
            this.main_camera.eye.compute_view_matrix();
        }

        engine.model_pipeline.begin_unique_render(engine.device, engine.context);

        //  First update the uniforms of all entities.
        for(let i = 0; i < this.entities.length; i++) {
            this.entities[i].update_buffers(engine, this);
            this.entities[i].model.uniform_buffer.wrote_uniform_already = false;
            //  if the entity is a non instance, it can send a render call now.
            if(!this.entities[i].model.is_instance) {
                this.entities[i].write_buffers(engine);
                this.entities[i].render(engine, this);
            }
        }
        
        engine.model_pipeline.end_unique_render(engine.device);

        //  Next we render all instances
        
        engine.model_pipeline.begin_instance_render(engine.device, engine.context);
        for(let i = 0; i < this.entities.length; i++) {
            if(this.entities[i].model.is_instance && !this.entities[i].model.uniform_buffer.wrote_uniform_already) {
                this.entities[i].write_buffers(engine);
                this.entities[i].render(engine, this);
            }
        }

        engine.model_pipeline.end_instance_render(engine.device);
        
        //  After updating and before rendering, the world's main_camera may have changed (view_updated)
        //  After rendering, we need to set the view_updated back to false to track if any changes
        //  were made in the next update
        this.main_camera.eye.updated_view = false;
    }
}

