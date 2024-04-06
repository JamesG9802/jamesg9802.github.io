import { quat, vec3 } from "wgpu-matrix";
import { Engine } from "./engine";
import { World } from "./world";
import { Camera, Eye } from "./world/camera";
import { Entity } from "./world/entity";
import { Mesh } from "./world/mesh";
import { Model } from "./world/model";

export class Simulation {
    #frame: number;
    #timeSinceLastFPSCheck: number;
    #frameSinceLastFPSCheck: number;
    last_time: number;

    x: number = 0;
    y: number = 0;
    left_pressed: boolean = false;
    right_pressed: boolean = false;
    up_pressed: boolean = false;
    down_pressed: boolean = false;
    left_rotate_pressed: boolean = false;
    right_rotate_pressed: boolean = false;

    aspect_ratio: number;
    engine: Engine;
    world: World;

    constructor(engine: Engine, world: World) {
        this.#timeSinceLastFPSCheck = new Date().getTime();
        this.#frameSinceLastFPSCheck = 0;
        this.#frame = 0;

        this.last_time = this.#timeSinceLastFPSCheck;

        this.aspect_ratio = 1;
        this.engine = engine;
        this.world = world;
    }

    static async create(canvas: HTMLCanvasElement): Promise<Simulation | undefined> {
        let engine: Engine | undefined = await Engine.create(canvas);
        if(engine == undefined) {
            console.error("Failed to create simulation.");
            return;
        }
            
        let camera: Camera = new Camera(engine, new Eye(vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, -1)),
        Math.PI / 5, 1, .1, 100);
        await Mesh.initialize_dictionary();
        let model1 = await Model.load_from_file(engine, "cube");
        let model2 = await Model.load_from_file(engine, "cliff");
        if(model1 == undefined || model2 == undefined)
        {
            console.error("model is undefined");
            return;
        }
        let e1 = new Entity(vec3.fromValues(0, 0, 0), quat.fromEuler(0, 0, 0, "xyz"), vec3.fromValues(.125, .125, .125), model1);
        let e2 = new Entity(vec3.fromValues(1, 2, 4), quat.fromEuler(0, 0, 2 * Math.PI, "xyz"), vec3.fromValues(.1, .1, .1), model2);
        
        let entities: Entity[] = [e1, e2];

        for(let i = 0; i < 2000; i++) {
            let model = await Model.load_from_file(engine, Math.random() > 5 ? "cube" : "cliff");
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
        let world: World = new World(camera, entities)
        console.log("Successfully created simulation.");
        return new Simulation(engine, world);
    }

    /**
     * Upon a resize event, GPU related fields need to be updated
     */
    resize(width: number, height: number) {
        this.aspect_ratio = height != 0 ? width / height : 1; 
        this.engine.resize();
        this.world.main_camera.recompute_projection_matrix(this.engine.device, 
            Math.PI / 5, this.aspect_ratio, .1, 100, this.world.main_camera.project_matrix);
    }

    /**
     * Updates the world.
     */
    update() {
        let now = new Date().getTime();
        this.world.update((now - this.last_time)/1000);
        this.last_time = now;

        const radius = 6;
        
        if(this.left_pressed)
            this.x++;
        if(this.right_pressed)
            this.x--;
        if(this.up_pressed)
            this.y++;
        if(this.down_pressed)
            this.y--;
        this.world.main_camera.eye.set_position_and_forward(
            vec3.fromValues(radius*Math.sin(this.x / 64), radius*Math.sin(this.y / 64), radius*Math.cos(this.x / 64)),
            vec3.subtract(vec3.fromValues(radius*Math.sin(this.x / 64), radius*Math.sin(this.y / 64), radius*Math.cos(this.x / 64)), vec3.fromValues(0,0,0)),
        );
        if(this.left_rotate_pressed)
            this.world.main_camera.eye.set_forward(vec3.rotateY(this.world.main_camera.eye.forward, vec3.fromValues(0, 0, 0), Math.PI / 64));
        if(this.right_rotate_pressed)
            this.world.main_camera.eye.set_forward(vec3.rotateY(this.world.main_camera.eye.forward, vec3.fromValues(0, 0, 0), -Math.PI / 64));
        
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
}