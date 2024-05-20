import { Vec2, Vec4, quat, vec3, vec4 } from "wgpu-matrix";
import { Engine } from "./engine";
import { World } from "./world";
import { Camera, Eye } from "./world/camera";
import { Entity } from "./world/entity";
import { Mesh } from "./world/mesh";
import { Model } from "./world/model";
import LinkEntity from "./logic/LinkEntity";
import RingEntity from "./logic/RingEntity";
import AsteroidEntity from "./logic/AsteroidEntity";

/**
 * A simulation is a class that handles the logic for drawing 3d objects to a given HTML Canvas element.
 */
export class Simulation {
    /**
     * The current frame number of the simulation. So on a computer that runs at 60 frames per second,
     * the frame number will increment every 1/60th of a second and the `update()` and `render()`
     * functions will be called. 
     */
    #frame: number;

    /**
     * The number of milliseconds since the UTC epoch measured when the last frames per second (FPS)
     * check was made.
     */
    #timeSinceLastFPSCheck: number;
    
    /**
     * The frame number measured when the last frames per second (FPS) check was made.
     */
    #frameSinceLastFPSCheck: number;

    /**
     * The number of milliseconds since the UTC epoch measured at the last `update()` call. 
     */
    #last_time: number;

    x: number = 0;
    y: number = 0;

    /**
     * The engine connecting to the WebGPU API.
     */
    engine: Engine;

    /**
     * The world containing the simulation information.
     */
    world: World;

    /**
     * Creates and returns a simulation. Use `create()` instead.
     * @param engine 
     * @param world 
     */
    constructor(engine: Engine, world: World) {
        this.#timeSinceLastFPSCheck = new Date().getTime();
        this.#frameSinceLastFPSCheck = 0;
        this.#frame = 0;

        this.#last_time = this.#timeSinceLastFPSCheck;

        this.engine = engine;
        this.world = world;
    }

    /**
     * Creates and returns a new simulation.
     * @param canvas 
     * @param clear_color
     * @returns 
     */
    static async create(canvas: HTMLCanvasElement, clear_color: GPUColor): Promise<Simulation | undefined> {
        let engine: Engine | undefined = await Engine.create(canvas, clear_color);
        if(engine == undefined) {
            console.error("Failed to create simulation.");
            return;
        }
            
        let camera: Camera = new Camera(
            engine, 
            new Eye(
                vec3.fromValues(0, 0, -5), 
                vec3.fromValues(0, 0, -1)
            ),
            Math.PI / 5, 
            1, 
            .1, 
            100, 
            vec4.fromValues(1, 1, 1, 1)
        );

        await Mesh.initialize_dictionary();
        let model1 = await Model.load_from_file(engine, "cube");
        let model2 = await Model.load_from_file(engine, "cliff");
        if(model1 == undefined || model2 == undefined)
        {
            console.error("model is undefined");
            return;
        }
        let e1 = new LinkEntity(vec3.fromValues(0, 0, 0), quat.fromEuler(0, 0, 0, "xyz"), vec3.fromValues(.25, .25, .25), model1);
        
        let entities: Entity[] = [e1];

        //  Rings
        for(let i = 0; i < 0; i++) {
            let model = model2.create_instance_copy(engine);
            const radius = .8;
            entities.push(
                new RingEntity(
                    vec3.fromValues(radius * Math.sin((i / 12) * 2 * Math.PI), radius * Math.cos((i / 12) * 2 * Math.PI), 0), 
                    quat.fromEuler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, "xyz"), 
                    vec3.fromValues(.075, .075, .075),
                    model
                )
            );
        }

        //  Asteroids
        for(let i = 0; i < 10; i++) {
            let model = model2.create_instance_copy(engine);
            let entity = new AsteroidEntity(
                vec3.fromValues(Math.random() * 12 - 6, Math.random() * 12 - 6, 15 + Math.random() * 5 ), 
                quat.fromEuler(0, 0, 2 * Math.PI, "xyz"), 
                vec3.fromValues(.2 * Math.random() + .2, .2 * Math.random() + .2, .2 * Math.random() + .2),
                model
            );
            entities.push(entity);
        }
        /*
        for(let i = 0; i < 20000; i++) {
            //let model = await Model.load_from_file(engine, Math.random() > 0 ? "cube" : "cliff");
            let model = model1.create_instance_copy(engine);
            if(!model) continue;
            let angle = Math.random() * 2 * Math.PI;
            let range = Math.random() * 2 ;
            let height = Math.random() * 2 - 1;
            let scale = Math.random() * .04 + .04;
            entities.push(
                new Entity(
                    vec3.fromValues(range * Math.sin(angle), range * Math.cos(angle), height), 
                    quat.fromEuler(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, "xyz"), 
                    vec3.fromValues(scale, scale, scale),
                    model)
            );
        }
        */
        let world: World = World.create(camera, entities);
        let simulation: Simulation = new Simulation(engine, world);
        console.log("Successfully created simulation.");
        console.log(simulation);
        return simulation;
    }

    /**
     * Upon a resize event, GPU related fields need to be updated
     */
    resize(width: number, height: number) {
        let aspect_ratio = height != 0 ? width / height : 1; 
        this.engine.resize();
        this.world.main_camera.set_perspective_projection(this.engine.device, 
            Math.PI / 5, aspect_ratio, .1, 100);
    }

    set_clear_color(clear_color: GPUColor) {
        this.engine.set_clear_color(clear_color);
    }

    set_global_light_color(light_color: Vec4) {
        this.world.set_global_light_color(this.engine, light_color);
    }

    /**
     * Updates the world.
     */
    update(mouse_position: Vec2) {
        let now = new Date().getTime();
        let time_delta = (now - this.#last_time) / 1000;
    
        this.world.update(mouse_position, time_delta);

        //  Update timing
        this.#last_time = now;
        
        this.#frame += 1;
        const diff = new Date().getTime() - this.#timeSinceLastFPSCheck;
        if(diff >= 1000) {
            console.log((this.#frame - this.#frameSinceLastFPSCheck) / (diff / 1000));
            this.#frameSinceLastFPSCheck = this.#frame;
            this.#timeSinceLastFPSCheck += diff;
        }
    }

    /**
     * Renders the world to the screen.
     */
    render() {
        this.world.render(this.engine);
    }

    /**
     * Clean up all information from the simulation.
     */
    destroy() {
        this.engine.destroy();
        this.world.destroy();
    }
}